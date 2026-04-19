import { GraphNode } from "./node";
import { Edge } from "./edge";
import { GraphData } from "./graph-data";

export class Graph {
  private name: string = "";
  private interpretation: string = "";
  private nodes: Map<string, GraphNode> = new Map();
  private edges: Map<string, Edge> = new Map();

  getName(): string {
    return this.name;
  }

  setName(name: string) {
    this.name = name;
  }

  addNode(node: GraphNode) {
    this.nodes.set(node.id, node);
  }

  deleteNode(nodeId: string) {
    this.nodes.delete(nodeId);
    for (const edge of this.edges.values()) {
      if (edge.from === nodeId || edge.to === nodeId) {
        this.edges.delete(edge.id);
      }
    }
  }

  addEdge(edge: Edge) {
    this.edges.set(edge.id, edge);

  }

  deleteEdge(edgeId: string) {
    this.edges.delete(edgeId);
  }

  getNode(id: string): GraphNode | undefined {
    return this.nodes.get(id);
  }

  getNodes(): GraphNode[] {
    return Array.from(this.nodes.values());
  }

  getEdge(id: string): Edge | undefined {
    return this.edges.get(id);
  }

  getEdges(): Edge[] {
    return Array.from(this.edges.values());
  }

  getConnectedNodes(nodeId: string): GraphNode[] {
    const connections: GraphNode[] = [];

    for (const edge of this.edges.values()) {
      if (edge.from === nodeId || edge.to === nodeId) {
        const node = this.nodes.get(edge.to === nodeId ? edge.from : edge.to);
        if (node) connections.push(node);
      }
    }
    return connections;
  }

  getConnectionCount = (nodeId: string): number => {
    return Array.from(this.edges.values()).filter((edge) => edge.from === nodeId || edge.to === nodeId).length;
  };

  getConnectedEdges(nodeId: string): Edge[] {
    const connections: Edge[] = [];

    for (const edge of this.edges.values()) {
      if (edge.from === nodeId || edge.to === nodeId) {
        connections.push(edge);
      }
    }
    return connections;
  }

  getNodeWeight(nodeId: string): number {
    const node = this.nodes.get(nodeId);
    return node ? node.weight : 0;
  }

  getInterpretation(): string {
    return this.interpretation;
  }

  setInterpretation(interpretation: string) {
    this.interpretation = interpretation;
  }

  export(): GraphData {
    return {
      name: this.name,
      interpretation: this.interpretation,
      nodes: Array.from(this.nodes.values()),
      edges: Array.from(this.edges.values())
    };
  }

  import(data: GraphData): Graph {
    const graph = new Graph();
    graph.name = data.name;
    graph.interpretation = data.interpretation;

    for (const node of data.nodes) {
      console.log(JSON.stringify(node));
      if (graph.getNode(node.id)) {
        throw new Error(`Duplicate node id: ${node.id}`);
      }
      graph.addNode(node);
    }

    for (const edge of data.edges) {
      if (!graph.getNode(edge.from)) {
        throw new Error(`Edge ${edge.id} refers to missing from node: ${edge.from}`);
      }
      if (!graph.getNode(edge.to)) {
        throw new Error(`Edge ${edge.id} refers to missing to node: ${edge.to}`);
      }
      graph.addEdge(edge);
    }

    return graph;
  }
}
