import { GraphInteractionContext, GraphInteractionController } from "./graph-interaction-controller";

export class DefaultInteractionController implements GraphInteractionController {
    onKeyDown(event: KeyboardEvent, context: GraphInteractionContext): boolean {
        return false;
    }

    private createChildNode(context: GraphInteractionContext) {
        // create node
        // create parent-child edge from selected node to new node
        // select new node
    }

    private createSiblingNode(context: GraphInteractionContext) {
        // find parent of selected node
        // create new child under same parent
        // select new node
    }
}