import type { Graph } from "../../core/model/graph";
import type { GraphInteractionContext, GraphInteractionController } from "./graph-interaction-controller";

export class DefaultInteractionController implements GraphInteractionController {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onKeyDown(event: KeyboardEvent, context: GraphInteractionContext): boolean {
        return false;
    }

    deleteNode(nodeId: string, graph: Graph): void {
        graph.deleteNode(nodeId);
    }
}