import type { Graph } from "../model/graph";
import type { GraphNode, Position } from "../model/node";

export class NarrativeStrategyLayout {
    protected graph: Graph;
    protected width: number;
    protected height: number;
    protected isStable: boolean = true;
    protected lastAverageMovement: number = 0;

    constructor(graph: Graph, width: number, height: number) {
        this.graph = graph;
        this.width = width;
        this.height = height;
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
        return 0;
    }

    isSimulationStable(): boolean {
        return true;
    }

    resetSimulationStability(): void {
        this.isStable = true;
    }
}