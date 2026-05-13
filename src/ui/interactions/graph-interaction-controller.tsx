import type { Graph } from "../../core/model/graph";

export interface GraphInteractionContext {
    graph: Graph;
    selectedNodeId?: string;
    setSelectedNodeId: (nodeId: string | null) => void;
    graphVersion: number;
    setGraphVersion: (v: number) => void;
}

export interface GraphInteractionController {
    onKeyDown?(event: KeyboardEvent, context: GraphInteractionContext): boolean;
    deleteNode(nodeId: string, graph: Graph): void;
}

