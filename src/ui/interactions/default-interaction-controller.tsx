import { Graph } from "../../core/model/graph";
import { GraphInteractionContext, GraphInteractionController } from "./graph-interaction-controller";

export class DefaultInteractionController implements GraphInteractionController {
    onKeyDown(event: KeyboardEvent, context: GraphInteractionContext): boolean {
        return false;
    }

    deleteNode(nodeId: string, graph: Graph): void {
        graph.deleteNode(nodeId);
    }
}