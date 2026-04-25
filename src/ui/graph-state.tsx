import { DragState, ViewTransform } from "./panels/graph-canvas";

export interface GraphState {
    view: ViewTransform;
    selectedNodeId: string | null;
    selectedEdgeId: string | null;
    hoveredNodeId: string | null;
    linkStartNodeId: string | null;
    drag: DragState | null;
    mode: "select" | "add" | "link" | "delete";
    indicatorState: Record<string, boolean>;
}