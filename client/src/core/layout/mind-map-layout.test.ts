import { describe, it, expect } from "vitest";
import { MindMapLayout } from "./mind-map-layout";
import { Graph } from "../model/graph";

describe("MindMapLayout", () => {
    it("applies repulsion and returns positive movement for two non-level-0 nodes", () => {
        const graph = new Graph();
        graph.addNode({
            id: "n1",
            title: "Node 1",
            type: "default",
            weight: 1,
            position: { x: 0, y: 0 },
            size: { width: 40, height: 40 }
        });
        graph.addNode({
            id: "n2",
            title: "Node 2",
            type: "default",
            weight: 1,
            position: { x: 10, y: 0 },
            size: { width: 40, height: 40 }
        });
        graph.addEdge({ id: "e1", from: "n1", to: "n2", type: "Relates To" });

        const layout = new MindMapLayout(graph, 300, 300);
        const beforePositions = graph.getNodes().map((node) => ({ ...node.position }));
        const movement = layout.stepSimulation();
        const afterPositions = graph.getNodes().map((node) => ({ ...node.position }));

        expect(movement).toBeGreaterThan(0);
        expect(afterPositions[0]).not.toEqual(beforePositions[0]);
        expect(afterPositions[1]).not.toEqual(beforePositions[1]);
    });

    it("still produces a valid movement result when a node is level-0", () => {
        const graph = new Graph();
        graph.addNode({
            id: "root",
            title: "Root",
            type: "level-0",
            weight: 2,
            position: { x: 0, y: 0 },
            size: { width: 60, height: 40 }
        });
        graph.addNode({
            id: "child",
            title: "Child",
            type: "default",
            weight: 1,
            position: { x: 20, y: 0 },
            size: { width: 40, height: 40 }
        });
        graph.addEdge({ id: "e1", from: "root", to: "child", type: "Relates To" });

        const layout = new MindMapLayout(graph, 300, 300);
        const movement = layout.stepSimulation();

        expect(movement).toBeGreaterThanOrEqual(0);
        expect(graph.getNode("child")?.velocity).toBeDefined();
    });
});
