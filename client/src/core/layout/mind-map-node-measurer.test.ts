import { describe, it, expect, vi, afterEach } from "vitest";
import { MindMapNodeMeasurer } from "./mind-map-node-measurer";
import type { GraphNode } from "../model/node";

afterEach(() => {
    vi.restoreAllMocks();
});

describe("MindMapNodeMeasurer", () => {
    it("sets the canvas font before measuring text and returns padded dimensions", () => {
        const measureText = vi.fn().mockReturnValue({ width: 100 });
        const ctx = {
            font: "",
            measureText
        } as unknown as CanvasRenderingContext2D;

        const measurer = new MindMapNodeMeasurer(ctx);
        const node: GraphNode = {
            id: "node-1",
            title: "Test Node",
            type: "default",
            weight: 1,
            position: { x: 0, y: 0 },
            size: { width: 0, height: 0 }
        };

        const size = measurer.measure(node);

        expect(ctx.font).toBe("14px sans-serif");
        expect(measureText).toHaveBeenCalledWith("Test Node");
        expect(size).toEqual({ width: 140, height: 38 });
    });

    it("uses the text width from the canvas context to compute width dynamically", () => {
        const measureText = vi.fn().mockReturnValue({ width: 50 });
        const ctx = {
            font: "",
            measureText
        } as unknown as CanvasRenderingContext2D;

        const measurer = new MindMapNodeMeasurer(ctx);
        const node: GraphNode = {
            id: "node-2",
            title: "Short",
            type: "default",
            weight: 1,
            position: { x: 0, y: 0 },
            size: { width: 0, height: 0 }
        };

        const size = measurer.measure(node);

        expect(size.width).toBe(90);
        expect(size.height).toBe(38);
    });
});
