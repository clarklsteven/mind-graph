import { describe, it, expect, vi, beforeEach } from "vitest";
import { DefaultInteractionController } from "./default-interaction-controller";
import { Graph } from "../../core/model/graph";
import type { GraphInteractionContext } from "./graph-interaction-controller";

describe("DefaultInteractionController", () => {
    let controller: DefaultInteractionController;
    let graph: Graph;
    let context: GraphInteractionContext;

    beforeEach(() => {
        controller = new DefaultInteractionController();
        graph = new Graph();
        context = {
            graph,
            selectedNodeId: "node-1",
            setSelectedNodeId: vi.fn(),
            graphVersion: 1,
            setGraphVersion: vi.fn(),
        };
    });

    describe("onKeyDown", () => {
        it("should return false for any key event", () => {
            const event = new KeyboardEvent("keydown", { key: "Enter" });
            const result = controller.onKeyDown(event, context);
            expect(result).toBe(false);
        });

        it("should return false for Tab key", () => {
            const event = new KeyboardEvent("keydown", { key: "Tab" });
            const result = controller.onKeyDown(event, context);
            expect(result).toBe(false);
        });

        it("should return false when no node is selected", () => {
            const contextWithoutSelection: GraphInteractionContext = {
                ...context,
                selectedNodeId: undefined,
            };
            const event = new KeyboardEvent("keydown", { key: "Enter" });
            const result = controller.onKeyDown(event, contextWithoutSelection);
            expect(result).toBe(false);
        });
    });

    describe("deleteNode", () => {
        it("should delete the specified node from the graph", () => {
            const deleteNodeSpy = vi.spyOn(graph, "deleteNode");
            const nodeId = "node-to-delete";

            controller.deleteNode(nodeId, graph);

            expect(deleteNodeSpy).toHaveBeenCalledWith(nodeId);
            expect(deleteNodeSpy).toHaveBeenCalledTimes(1);
        });

        it("should delete the node even if it does not exist", () => {
            const deleteNodeSpy = vi.spyOn(graph, "deleteNode");
            const nodeId = "non-existent-node";

            controller.deleteNode(nodeId, graph);

            expect(deleteNodeSpy).toHaveBeenCalledWith(nodeId);
        });
    });
});
