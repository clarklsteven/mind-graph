import { Edge } from "../../core/model/edge";
import { GraphNode } from "../../core/model/node";
import { GraphInteractionContext, GraphInteractionController } from "./graph-interaction-controller";

export class MindMapInteractionController implements GraphInteractionController {
    onKeyDown(event: KeyboardEvent, context: GraphInteractionContext): boolean {
        if (!context.selectedNodeId) return false;

        if (event.key === "Tab") {
            this.createChildNode(context);
            return true;
        }

        if (event.key === "Enter") {
            this.createSiblingNode(context);
            return true;
        }

        return false;
    }

    private createChildNode(context: GraphInteractionContext) {
        const parent = context.graph.getNodes().find(n => n.id === context.selectedNodeId);
        if (!parent) return;
        // Mind Map nodes are of the form "level-x", where x is a number
        const parentLevel: number = parseInt(parent.type.split("-")[1]);
        const childLevel: number = parentLevel + 1;
        const childType: string = `level-${childLevel}`;


        const childId = crypto.randomUUID();

        const xOffset = Math.random() * 400 - 200;
        const yOffset = Math.random() * 400 - 200;
        const child: GraphNode = {
            id: childId,
            title: "New Node",
            type: childType,
            weight: 10 / (childLevel + 1),
            position: {
                x: parent.position.x + xOffset, y: parent.position.y + yOffset,
            }
        };

        const edge: Edge = {
            id: crypto.randomUUID(),
            from: parent.id,
            to: child.id,
            type: "parent-child",
        };

        context.graph.addNode(child);
        context.graph.addEdge(edge);
        context.setSelectedNodeId(child.id);
        context.setGraphVersion(context.graphVersion + 1);
    }

    private createSiblingNode(context: GraphInteractionContext) {
        const parentEdge = context.graph.getEdges().find(
            e => e.to === context.selectedNodeId && e.type === "parent-child"
        );

        if (!parentEdge) {
            this.createChildNode(context);
            return;
        }

        const parentId = parentEdge.from;
        // create new child under parentId
        const parent = context.graph.getNodes().find(n => n.id === parentId);
        if (!parent) return;
        // Mind Map nodes are of the form "level-x", where x is a number
        const parentLevel: number = parseInt(parent.type.split("-")[1]);
        const childType: string = `level-${parentLevel + 1}`;

        const childId = crypto.randomUUID();

        const child: GraphNode = {
            id: childId,
            title: "New Node",
            type: childType,
            weight: 1,
            position: {
                x: parent.position.x + 200, y: parent.position.y + 200,
            }
        };

        const edge: Edge = {
            id: crypto.randomUUID(),
            from: parent.id,
            to: child.id,
            type: "parent-child",
        };

        context.graph.addNode(child);
        context.graph.addEdge(edge);
        context.setSelectedNodeId(child.id);
        context.setGraphVersion(context.graphVersion + 1);
    }
}