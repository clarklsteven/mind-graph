import { Edge } from "../../core/model/edge";
import { Graph } from "../../core/model/graph";
import { GraphNode } from "../../core/model/node";

export interface GraphInteractionContext {
    graph: Graph;
    selectedNodeId?: string;
    setSelectedNodeId: (nodeId: string | null) => void;
    graphVersion: number;
    setGraphVersion: (v: number) => void;
}

export interface GraphInteractionController {
    onKeyDown?(event: KeyboardEvent, context: GraphInteractionContext): boolean;
}

