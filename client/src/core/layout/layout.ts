import type { Graph } from "../model/graph";
import type { GraphNode, Position } from "../model/node";

export class Layout {
    protected graph: Graph;
    protected width: number;
    protected height: number;
    protected nodePositions: Map<string, Position> = new Map();
    protected isStable: boolean = false;
    protected lastAverageMovement: number = 0;

    constructor(graph: Graph, width: number, height: number) {
        this.graph = graph;
        this.width = width;
        this.height = height;
        this.initializeNodePositions();
    }

    private initializeNodePositions() {
        const nodes = Array.from(this.graph.getNodes());
        const angleStep = (2 * Math.PI) / nodes.length;

        nodes.forEach((node, index) => {
            const angle = index * angleStep;
            const radius = Math.min(this.width, this.height) / 3;
            const x = this.width / 2 + radius * Math.cos(angle);
            const y = this.height / 2 + radius * Math.sin(angle);
            this.nodePositions.set(node.id, { x, y });
        });
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

    stepSimulation(): number {
        const nodes = this.graph.getNodes();
        const edges = this.graph.getEdges();
        const connectedIds = this.getConnectedNodeIds();
        const centre = this.getConnectedGraphCentre(nodes, connectedIds);

        let totalMovement = 0;

        // Don't do anything if there is only one node, to avoid it moving for no reason.
        if (nodes.length <= 1) {
            return totalMovement;
        }

        // Repulsion
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const a = nodes[i];
                const b = nodes[j];

                const dx = b.position.x - a.position.x;
                const dy = b.position.y - a.position.y;

                const distSq = dx * dx + dy * dy || 0.01;
                const distance = Math.sqrt(distSq);

                const force = 250 * (a.weight + b.weight) / distSq;

                const fx = (dx / distance) * force;
                const fy = (dy / distance) * force;

                a.position.x -= fx;
                a.position.y -= fy;
                b.position.x += fx;
                b.position.y += fy;

                totalMovement += Math.abs(fx) + Math.abs(fy);
            }
        }

        // Springs only for connected nodes via edges
        for (const edge of edges) {
            const a = nodes.find((node) => node.id === edge.from);
            const b = nodes.find((node) => node.id === edge.to);

            if (!a || !b) continue;

            const dx = b.position.x - a.position.x;
            const dy = b.position.y - a.position.y;

            const distSq = dx * dx + dy * dy || 0.01;
            const distance = Math.sqrt(distSq);

            const idealLength = 90;
            const springStrength = 0.005;

            const force = springStrength * (distance - idealLength);

            const fx = (dx / distance) * force;
            const fy = (dy / distance) * force;

            a.position.x += fx;
            a.position.y += fy;
            b.position.x -= fx;
            b.position.y -= fy;

            totalMovement += Math.abs(fx) + Math.abs(fy);
        }

        // Get the weight of all nodes to determine how much to apply the centering force
        const totalWeight = nodes.reduce((sum, node) => sum + node.weight, 0);
        const centeringStrength = 0.0003 * totalWeight / nodes.length;

        for (const node of nodes) {
            const dx = centre.x - node.position.x;
            const dy = centre.y - node.position.y;

            const fx = dx * centeringStrength;
            const fy = dy * centeringStrength;

            node.position.x += fx;
            node.position.y += fy;

            totalMovement += Math.abs(fx) + Math.abs(fy);
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
        this.lastAverageMovement = 0;
    }
}