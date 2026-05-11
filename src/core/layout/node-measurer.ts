import { GraphNode } from "../model/node";

export interface NodeMeasurer {
    measure(node: GraphNode): { width: number; height: number };
}