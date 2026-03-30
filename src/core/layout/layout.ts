import { Graph } from "../model/graph";
import { GraphNode, Position } from "../model/node";

export class Layout {
    private graph: Graph;
    private width: number;
    private height: number;
    private nodePositions: Map<string, Position> = new Map();

    constructor(graph: Graph, width: number, height: number) {
        this.graph = graph;
        this.width = width;
        this.height = height;
        this.initializeNodePositions();
    }

    private initializeNodePositions() {
        const nodes = Array.from(this.graph.export().nodes);
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
        //console.log(`Node ${nodeId} has weight ${node.weight}`);
        return Math.sqrt(node.weight) * 8;
    }

    getNodes(): GraphNode[] {
        let nodes: GraphNode[] = this.graph.getNodes();
        return nodes;
    }

    getEdges() {
        return Array.from(this.graph.export().edges);
    }

    stepSimulation(): number {
        const nodes = this.graph.export().nodes;
        const edges = this.graph.export().edges;
        let totalMovement = 0;

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

        // Springs
        for (const edge of edges) {
            const a = nodes.find((node) => node.id === edge.from);
            const b = nodes.find((node) => node.id === edge.to);

            if (!a || !b) continue;

            const dx = b.position.x - a.position.x;
            const dy = b.position.y - a.position.y;

            const distSq = dx * dx + dy * dy || 0.01;
            const distance = Math.sqrt(distSq);

            const idealLength = 90;
            const springStrength = 0.01;

            const force = springStrength * (distance - idealLength);

            const fx = (dx / distance) * force;
            const fy = (dy / distance) * force;

            a.position.x += fx;
            a.position.y += fy;
            b.position.x -= fx;
            b.position.y -= fy;

            totalMovement += Math.abs(fx) + Math.abs(fy);
        }

        return totalMovement;
    }
}