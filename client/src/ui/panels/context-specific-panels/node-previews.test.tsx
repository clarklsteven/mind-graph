import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import NodePreviews from "./node-previews";

describe("NodePreviews", () => {
    beforeEach(() => {
        const mockContext = {
            clearRect: vi.fn(),
            beginPath: vi.fn(),
            arc: vi.fn(),
            fill: vi.fn(),
            moveTo: vi.fn(),
            lineTo: vi.fn(),
            stroke: vi.fn(),
            closePath: vi.fn(),
            save: vi.fn(),
            restore: vi.fn(),
            strokeStyle: "",
            fillStyle: "",
            lineWidth: 1,
        };

        vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(mockContext as any);
    });

    it("renders a canvas for the requested node type", () => {
        render(<NodePreviews nodeType="goal" colour="#123456" />);

        const canvas = document.querySelector("canvas");
        expect(canvas).toBeInTheDocument();
        expect(canvas).toHaveAttribute("width", "24");
        expect(canvas).toHaveAttribute("height", "24");
    });
});
