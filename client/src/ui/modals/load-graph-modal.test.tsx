import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LoadGraphModal } from "./load-graph-modal";
import * as graphsApi from "../../api/graphs";

describe("LoadGraphModal", () => {
    beforeEach(() => {
        vi.spyOn(graphsApi, "getGraphs").mockResolvedValue([
            {
                name: "my_graph.json",
                interpretation: "mind-map-graph",
                lastModified: "2026-01-01T00:00:00.000Z"
            }
        ]);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("loads available graphs and calls onLoad when selected graph is loaded", async () => {
        const onClose = vi.fn();
        const onLoad = vi.fn();

        render(<LoadGraphModal isOpen={true} onClose={onClose} onLoad={onLoad} />);

        expect(await screen.findByText(/my graph/i)).toBeInTheDocument();

        await userEvent.dblClick(screen.getByTestId("graph-card"));

        expect(onLoad).toHaveBeenCalledWith("my_graph.json");
        expect(onClose).toHaveBeenCalled();
    });

    it("calls onClose when cancel is clicked", async () => {
        const onClose = vi.fn();

        render(<LoadGraphModal isOpen={true} onClose={onClose} onLoad={vi.fn()} />);

        await screen.findByText(/my graph/i);
        await userEvent.click(screen.getByRole("button", { name: /cancel/i }));

        expect(onClose).toHaveBeenCalled();
    });
});
