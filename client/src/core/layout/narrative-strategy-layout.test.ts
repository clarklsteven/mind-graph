import { describe, it, expect } from "vitest";
import { NarrativeStrategyLayout } from "./narrative-strategy-layout";
import { Graph } from "../model/graph";

describe("NarrativeStrategyLayout", () => {
    it("returns the correct node radius for an existing node", () => {
        const graph = new Graph();
        graph.addNode({
            id: "n1",
            title: "Node 1",
            type: "default",
            weight: 9,
            position: { x: 0, y: 0 },
            size: { width: 20, height: 20 }
        });

        const layout = new NarrativeStrategyLayout(graph, 400, 400);

        expect(layout.getNodeRadius("n1")).toBe(24);
    });

    it("returns 8 for a missing node when calculating radius", () => {
        const graph = new Graph();
        const layout = new NarrativeStrategyLayout(graph, 400, 400);

        expect(layout.getNodeRadius("missing")).toBe(8);
    });

    it("exposes graph nodes and edges through getNodes and getEdges", () => {
        const graph = new Graph();
        graph.addNode({
            id: "n1",
            title: "Node 1",
            type: "default",
            weight: 1,
            position: { x: 0, y: 0 },
            size: { width: 20, height: 20 }
        });
        graph.addEdge({ id: "e1", from: "n1", to: "n1", type: "Relates To" });

        const layout = new NarrativeStrategyLayout(graph, 400, 400);

        expect(layout.getNodes()).toHaveLength(1);
        expect(layout.getEdges()).toHaveLength(1);
        expect(layout.getNodes()[0].id).toBe("n1");
        expect(layout.getEdges()[0].id).toBe("e1");
    });

    it("calculates connected node ids and the connected centre correctly", () => {
        const graph = new Graph();
        graph.addNode({
            id: "n1",
            title: "Node 1",
            type: "default",
            weight: 1,
            position: { x: 0, y: 0 },
            size: { width: 20, height: 20 }
        });
        graph.addNode({
            id: "n2",
            title: "Node 2",
            type: "default",
            weight: 1,
            position: { x: 100, y: 50 },
            size: { width: 20, height: 20 }
        });
        graph.addEdge({ id: "e1", from: "n1", to: "n2", type: "Relates To" });

        const layout = new NarrativeStrategyLayout(graph, 400, 400);
        const connectedIds = layout["getConnectedNodeIds"]();
        const centre = layout["getConnectedGraphCentre"](graph.getNodes(), connectedIds);

        expect(connectedIds).toEqual(new Set(["n1", "n2"]));
        expect(centre).toEqual({ x: 50, y: 25 });
    });

    it("moves connected nodes during stepSimulation and preserves stability after reset", () => {
        const graph = new Graph();
        graph.addNode({
            id: "n1",
            title: "Node 1",
            type: "default",
            weight: 1,
            position: { x: 0, y: 0 },
            size: { width: 20, height: 20 }
        });
        graph.addNode({
            id: "n2",
            title: "Node 2",
            type: "default",
            weight: 1,
            position: { x: 10, y: 10 },
            size: { width: 20, height: 20 }
        });
        graph.addEdge({ id: "e1", from: "n1", to: "n2", type: "Relates To" });

        const layout = new NarrativeStrategyLayout(graph, 400, 400);
        layout.resetSimulationStability();
        expect(layout.isSimulationStable()).toBe(false);

        const beforePositions = graph.getNodes().map((node) => ({ ...node.position }));
        const movement = layout.stepSimulation();
        const afterPositions = graph.getNodes().map((node) => ({ ...node.position }));

        expect(movement).toBeGreaterThan(0);
        expect(afterPositions[0]).not.toEqual(beforePositions[0]);
        expect(afterPositions[1]).not.toEqual(beforePositions[1]);
        expect(layout.isSimulationStable()).toBe(false);
    });
});
