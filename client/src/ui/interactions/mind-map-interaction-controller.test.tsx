import { describe, it, expect, vi, beforeEach } from "vitest";
import { MindMapInteractionController } from "./mind-map-interaction-controller";
import { Graph } from "../../core/model/graph";
import type { GraphInteractionContext } from "./graph-interaction-controller";
import type { GraphNode } from "../../core/model/node";
import type { Edge } from "../../core/model/edge";

vi.mock("../../core/utils/descendent-nodes", () => ({
    getDescendantNodeIds: vi.fn((graph: Graph, nodeId: string) => {
        const descendants = new Set<string>();
        descendants.add(nodeId);
        const stack = [nodeId];

        while (stack.length > 0) {
            const currentId = stack.pop()!;
            const childIds = graph
                .getEdges()
                .filter((edge) => edge.from === currentId)
                .map((edge) => edge.to);

            for (const childId of childIds) {
                if (!descendants.has(childId)) {
                    descendants.add(childId);
                    stack.push(childId);
                }
            }
        }

        return descendants;
    }),
}));

describe("MindMapInteractionController", () => {
    let controller: MindMapInteractionController;
    let graph: Graph;
    let context: GraphInteractionContext;
    let mockSetSelectedNodeId: ReturnType<typeof vi.fn>;
    let mockSetGraphVersion: ReturnType<typeof vi.fn>;
    let uuidCounter: number;

    beforeEach(() => {
        controller = new MindMapInteractionController();
        graph = new Graph();
        mockSetSelectedNodeId = vi.fn();
        mockSetGraphVersion = vi.fn();
        uuidCounter = 0;

        context = {
            graph,
            selectedNodeId: "parent-node",
            // @ts-expect-error Can't stop this from erroring
            setSelectedNodeId: mockSetSelectedNodeId,
            graphVersion: 1,
            // @ts-expect-error Can't stop this from erroring
            setGraphVersion: mockSetGraphVersion,
        };

        // Add a parent node to the graph
        const parentNode: GraphNode = {
            id: "parent-node",
            title: "Parent",
            type: "level-0",
            weight: 1,
            position: { x: 100, y: 100 },
            size: { width: 50, height: 20 },
        };
        graph.addNode(parentNode);

        // Mock crypto.randomUUID to return predictable values
        const mockRandomUUID = vi.fn(() => {
            const id = `uuid-${uuidCounter}`;
            uuidCounter++;
            return id;
        });

        vi.stubGlobal("crypto", {
            randomUUID: mockRandomUUID,
        } as unknown);
    });

    describe("onKeyDown", () => {
        it("should return false when no node is selected", () => {
            context.selectedNodeId = undefined;
            const event = new KeyboardEvent("keydown", { key: "Tab" });
            const result = controller.onKeyDown(event, context);
            expect(result).toBe(false);
        });

        it("should return false for unhandled keys", () => {
            const event = new KeyboardEvent("keydown", { key: "a" });
            const result = controller.onKeyDown(event, context);
            expect(result).toBe(false);
        });

        it("should create a child node when Tab is pressed", () => {
            const event = new KeyboardEvent("keydown", { key: "Tab" });
            const result = controller.onKeyDown(event, context);

            expect(result).toBe(true);
            expect(graph.getNodes().length).toBe(2);

            const childNode = graph.getNodes().find((n) => n.id.startsWith("uuid-"));
            expect(childNode).toBeDefined();
            expect(childNode?.type).toBe("level-1");
            expect(childNode?.title).toBe("New Node");

            const edges = graph.getEdges();
            expect(edges.length).toBe(1);
            expect(edges[0].from).toBe("parent-node");
            expect(edges[0].to).toBe(childNode?.id);
            expect(edges[0].type).toBe("parent-child");

            expect(mockSetSelectedNodeId).toHaveBeenCalledWith(childNode?.id);
            expect(mockSetGraphVersion).toHaveBeenCalledWith(2);
        });

        it("should create a sibling node when Enter is pressed and node has a parent", () => {
            // Add a child node and select it
            const childNode: GraphNode = {
                id: "child-node",
                title: "Child",
                type: "level-1",
                weight: 1,
                position: { x: 150, y: 150 },
                size: { width: 50, height: 20 },
            };
            graph.addNode(childNode);

            const edge: Edge = {
                id: "edge-1",
                from: "parent-node",
                to: "child-node",
                type: "parent-child",
            };
            graph.addEdge(edge);

            context.selectedNodeId = "child-node";

            const event = new KeyboardEvent("keydown", { key: "Enter" });
            const result = controller.onKeyDown(event, context);

            expect(result).toBe(true);
            expect(graph.getNodes().length).toBe(3);

            const siblingNode = graph
                .getNodes()
                .find((n) => n.id.startsWith("uuid-") && n.id !== "child-node");
            expect(siblingNode).toBeDefined();
            expect(siblingNode?.type).toBe("level-1");
            expect(siblingNode?.title).toBe("New Node");

            const edges = graph.getEdges();
            expect(edges.length).toBe(2);
            expect(edges.some((e) => e.from === "parent-node" && e.to === siblingNode?.id)).toBe(
                true
            );

            expect(mockSetSelectedNodeId).toHaveBeenCalledWith(siblingNode?.id);
            expect(mockSetGraphVersion).toHaveBeenCalledWith(2);
        });

        it("should create a child node when Enter is pressed and node has no parent", () => {
            context.selectedNodeId = "parent-node";
            const event = new KeyboardEvent("keydown", { key: "Enter" });
            const result = controller.onKeyDown(event, context);

            expect(result).toBe(true);
            expect(graph.getNodes().length).toBe(2);

            const childNode = graph.getNodes().find((n) => n.id.startsWith("uuid-"));
            expect(childNode).toBeDefined();
            expect(childNode?.type).toBe("level-1");

            expect(mockSetSelectedNodeId).toHaveBeenCalledWith(childNode?.id);
            expect(mockSetGraphVersion).toHaveBeenCalledWith(2);
        });
    });

    describe("deleteNode", () => {
        it("should delete the node and its descendants", () => {
            // Create a tree structure: parent -> child -> grandchild
            const childNode: GraphNode = {
                id: "child-node",
                title: "Child",
                type: "level-1",
                weight: 1,
                position: { x: 150, y: 150 },
                size: { width: 50, height: 20 },
            };
            const grandchildNode: GraphNode = {
                id: "grandchild-node",
                title: "Grandchild",
                type: "level-2",
                weight: 1,
                position: { x: 200, y: 200 },
                size: { width: 50, height: 20 },
            };

            graph.addNode(childNode);
            graph.addNode(grandchildNode);

            const edge1: Edge = {
                id: "edge-1",
                from: "parent-node",
                to: "child-node",
                type: "parent-child",
            };
            const edge2: Edge = {
                id: "edge-2",
                from: "child-node",
                to: "grandchild-node",
                type: "parent-child",
            };

            graph.addEdge(edge1);
            graph.addEdge(edge2);

            const deleteNodeSpy = vi.spyOn(graph, "deleteNode");

            controller.deleteNode("parent-node", graph);

            // Should delete parent, child, and grandchild
            expect(deleteNodeSpy).toHaveBeenCalledWith("parent-node");
            expect(deleteNodeSpy).toHaveBeenCalledWith("child-node");
            expect(deleteNodeSpy).toHaveBeenCalledWith("grandchild-node");
            expect(deleteNodeSpy).toHaveBeenCalledTimes(3);
        });

        it("should delete only the node when it has no descendants", () => {
            const deleteNodeSpy = vi.spyOn(graph, "deleteNode");

            controller.deleteNode("parent-node", graph);

            expect(deleteNodeSpy).toHaveBeenCalledWith("parent-node");
            expect(deleteNodeSpy).toHaveBeenCalledTimes(1);
        });

        it("should delete only the child when parent node is deleted", () => {
            const childNode: GraphNode = {
                id: "child-node",
                title: "Child",
                type: "level-1",
                weight: 1,
                position: { x: 150, y: 150 },
                size: { width: 50, height: 20 },
            };
            graph.addNode(childNode);

            const edge: Edge = {
                id: "edge-1",
                from: "parent-node",
                to: "child-node",
                type: "parent-child",
            };
            graph.addEdge(edge);

            const deleteNodeSpy = vi.spyOn(graph, "deleteNode");

            controller.deleteNode("child-node", graph);

            expect(deleteNodeSpy).toHaveBeenCalledWith("child-node");
            expect(deleteNodeSpy).toHaveBeenCalledTimes(1);
        });
    });
});
