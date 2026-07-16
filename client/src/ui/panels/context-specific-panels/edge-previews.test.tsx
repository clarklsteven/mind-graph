import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import EdgePreviews from "./edge-previews";

describe("EdgePreviews", () => {
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

    it("renders a canvas for the requested edge type", () => {
        render(<EdgePreviews edgeType="leads_to" />);

        const canvas = document.querySelector("canvas");
        expect(canvas).toBeInTheDocument();
        expect(canvas).toHaveAttribute("width", "36");
        expect(canvas).toHaveAttribute("height", "24");
    });
});
