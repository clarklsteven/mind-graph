import { describe, it, expect } from "vitest";
import { Layout } from "./layout";
import { Graph } from "../model/graph";

describe("Layout", () => {
    it("calculates node radius based on node weight", () => {
        const graph = new Graph();
        graph.addNode({
            id: "n1",
            title: "Node 1",
            type: "default",
            weight: 4,
            position: { x: 0, y: 0 },
            size: { width: 10, height: 10 }
        });

        const layout = new Layout(graph, 200, 200);

        expect(layout.getNodeRadius("n1")).toBe(16);
    });

    it("returns zero movement for a graph with a single node", () => {
        const graph = new Graph();
        graph.addNode({
            id: "n1",
            title: "Node 1",
            type: "default",
            weight: 1,
            position: { x: 100, y: 100 },
            size: { width: 50, height: 50 }
        });

        const layout = new Layout(graph, 300, 300);
        const movement = layout.stepSimulation();

        expect(movement).toBe(0);
        expect(layout.isSimulationStable()).toBe(false);
        layout.resetSimulationStability();
        expect(layout.isSimulationStable()).toBe(false);
    });

    it("moves connected nodes and returns a positive movement value", () => {
        const graph = new Graph();
        graph.addNode({
            id: "n1",
            title: "Node 1",
            type: "default",
            weight: 1,
            position: { x: 0, y: 0 },
            size: { width: 30, height: 30 }
        });
        graph.addNode({
            id: "n2",
            title: "Node 2",
            type: "default",
            weight: 1,
            position: { x: 100, y: 0 },
            size: { width: 30, height: 30 }
        });
        graph.addEdge({ id: "e1", from: "n1", to: "n2", type: "Relates To" });

        const layout = new Layout(graph, 300, 300);
        const beforePositions = graph.getNodes().map((node) => ({ ...node.position }));
        const movement = layout.stepSimulation();
        const afterPositions = graph.getNodes().map((node) => ({ ...node.position }));

        expect(movement).toBeGreaterThan(0);
        expect(afterPositions[0]).not.toEqual(beforePositions[0]);
        expect(afterPositions[1]).not.toEqual(beforePositions[1]);
        expect(layout.isSimulationStable()).toBe(false);
    });
});
