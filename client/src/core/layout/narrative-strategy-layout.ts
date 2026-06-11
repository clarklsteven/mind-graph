import type { Graph } from "../model/graph";
import type { GraphNode } from "../model/node";
import { Layout } from "./layout";

export class NarrativeStrategyLayout extends Layout {
    protected isStable: boolean = true;
    protected lastAverageMovement: number = 0;
    private horizontalSpacing: number = 200;

    constructor(graph: Graph, width: number, height: number) {
        super(graph, width, height);
    }

    getNodeRadius(nodeId: string): number {
        const node = this.graph.getNode(nodeId);
        if (!node) return 8;
        return Math.sqrt(node.weight) * 8;
    }

    getNodes(): GraphNode[] {
        const nodes: GraphNode[] = this.graph.getNodes();
        return nodes;
    }

    getEdges() {
        return this.graph.getEdges();
    }

    protected getConnectedNodeIds(): Set<string> {
        const connected = new Set<string>();

        for (const edge of this.graph.getEdges()) {
            connected.add(edge.from);
            connected.add(edge.to);
        }

        return connected;
    }

    protected getConnectedGraphCentre(nodes: GraphNode[], connectedIds: Set<string>): { x: number; y: number } {
        const connectedNodes = nodes.filter(node => connectedIds.has(node.id));

        if (connectedNodes.length === 0) {
            return { x: 0, y: 0 };
        }

        const sumX = connectedNodes.reduce((sum, node) => sum + node.position.x, 0);
        const sumY = connectedNodes.reduce((sum, node) => sum + node.position.y, 0);

        return {
            x: sumX / connectedNodes.length,
            y: sumY / connectedNodes.length,
        };
    }

    applyStatusTimeForce(node: GraphNode): void {
        const status = node.properties?.status;

        node.velocity ??= { vx: 0, vy: 0 };

        if (typeof status !== "string") {
            return;
        }

        const strength = 0.5;

        if (status.toLowerCase() === "done") {
            node.velocity.vx -= strength;
        } else if (status.toLowerCase() === "pending") {
            node.velocity.vx += strength;
        }
    }

    stepSimulation(): number {
        const nodes = this.graph.getNodes();
        const edges = this.graph.getEdges();
        const connectedNodes = this.getConnectedNodeIds();

        let totalMovement = 0;

        // Repulsion
        for (let i = 0; i < nodes.length; i++) {

            for (let j = i + 1; j < nodes.length; j++) {
                const a = nodes[i];
                const b = nodes[j];

                if (!connectedNodes.has(a.id) || !connectedNodes.has(b.id)) continue;

                a.velocity ??= { vx: 0, vy: 0 };
                b.velocity ??= { vx: 0, vy: 0 };

                const dx = b.position.x - a.position.x;
                const dy = b.position.y - a.position.y;

                const distSq = dx * dx + dy * dy || 0.01;
                const distance = Math.sqrt(distSq);

                const force = 250 * (a.weight + b.weight) / distSq;

                const fx = (dx / distance) * force;
                const fy = (dy / distance) * force * 2;

                a.velocity.vx -= fx;
                a.velocity.vy -= fy;
                b.velocity.vx += fx;
                b.velocity.vy += fy;
            }
        }

        // Get the average y position of all nodes to use as the baseline for the horizontal layout
        const averageY = nodes.reduce((sum, node) => sum + node.position.y, 0) / nodes.length;

        // Apply a force to pull all nodes towards the horizontal line at averageY, with stronger force for nodes further from the line
        for (const node of nodes) {
            if (!connectedNodes.has(node.id)) continue;

            node.velocity ??= { vx: 0, vy: 0 };

            const dy = averageY - node.position.y;
            const force = dy * 0.001;

            node.velocity.vy += force;
        }

        // Springs only for connected nodes via edges
        for (const edge of edges) {
            const a = nodes.find((node) => node.id === edge.from);
            const b = nodes.find((node) => node.id === edge.to);

            if (!a || !b) continue;

            a.velocity ??= { vx: 0, vy: 0 };
            b.velocity ??= { vx: 0, vy: 0 };

            const dx = b.position.x - a.position.x;
            const dy = b.position.y - a.position.y;

            const distSq = dx * dx + dy * dy || 0.01;
            const distance = Math.sqrt(distSq);

            const idealLength = 90;
            let springStiffness = 0.005;
            if (b.type === "goal" && a.type !== "goal") springStiffness = 0.002;
            const springStrength = springStiffness * Math.sqrt(nodes.length);

            const force = springStrength * (distance - idealLength);

            const fx = (dx / distance) * force;
            const fy = (dy / distance) * force;

            a.velocity.vx += fx;
            a.velocity.vy += fy;
            b.velocity.vx -= fx;
            b.velocity.vy -= fy;
        }

        for (const edge of edges) {
            const a = nodes.find((node) => node.id === edge.from);
            const b = nodes.find((node) => node.id === edge.to);

            if (!a || !b) continue;
            // Make sure the connected nodes are linked from left to right to give a clearer structure to the graph
            a.velocity ??= { vx: 0, vy: 0 };
            b.velocity ??= { vx: 0, vy: 0 };
            if (a.position.x + this.horizontalSpacing >= b.position.x) {
                a.velocity.vx -= 0.8;
                b.velocity.vx += 0.8;
            }
        }

        for (const node of nodes) {
            // Damp the velocity slighty to give things chance to settle
            const damping = 0.25;
            const maxSpeed = 5;
            const minSpeed = 0.01;

            node.velocity ??= { vx: 0, vy: 0 };
            node.velocity.vx *= damping;
            node.velocity.vy *= damping;

            const speed = Math.sqrt(
                node.velocity.vx * node.velocity.vx +
                node.velocity.vy * node.velocity.vy
            );

            if (speed > maxSpeed) {
                node.velocity.vx = (node.velocity.vx / speed) * maxSpeed;
                node.velocity.vy = (node.velocity.vy / speed) * maxSpeed;
            }

            if (Math.abs(node.velocity.vx) < minSpeed) node.velocity.vx = 0;
            if (Math.abs(node.velocity.vy) < minSpeed) node.velocity.vy = 0;

            node.position.x += node.velocity.vx;
            node.position.y += node.velocity.vy;

            totalMovement += Math.abs(node.velocity.vx) + Math.abs(node.velocity.vy);
        }

        const averageMovement = totalMovement / nodes.length;
        const movementChange = Math.abs(averageMovement - this.lastAverageMovement) / this.lastAverageMovement;
        if (movementChange < 1e-8) {
            this.isStable = true;
        }
        this.lastAverageMovement = averageMovement;

        return totalMovement;
    }

    isSimulationStable(): boolean {
        return this.isStable;
    }

    resetSimulationStability(): void {
        this.isStable = false;
    }
}