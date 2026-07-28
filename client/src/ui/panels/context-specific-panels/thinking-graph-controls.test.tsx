import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ThinkingGraphControls from "./thinking-graph-controls";
import type { GraphInterpretation } from "../../../core/model/graph-interpretation";

describe("ThinkingGraphControls", () => {
    it("renders mode buttons and indicator checkboxes when completeness requirements exist", () => {
        const setIndicatorState = vi.fn();
        const setMode = vi.fn();

        render(
            <ThinkingGraphControls
                mode="select"
                interpretation={{
                    node_definitions: [{ completeness: { requiredFields: ["theme"] } }],
                } as GraphInterpretation}
                indicatorState={{}}
                setIndicatorState={setIndicatorState}
                setMode={setMode}
            />
        );

        expect(screen.getByText("Select")).toBeInTheDocument();
        expect(screen.getByText("Add Node")).toBeInTheDocument();
        expect(screen.getByText("Link Nodes")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Select" })).toHaveClass("control-button");
        expect(screen.getByText("Missing Properties:")).toBeInTheDocument();
        expect(screen.getByText("Theme")).toBeInTheDocument();
    });

    it("updates indicator state when a checkbox is toggled", () => {
        const setIndicatorState = vi.fn();

        render(
            <ThinkingGraphControls
                mode="select"
                interpretation={{
                    node_definitions: [{ completeness: { requiredFields: ["theme"] } }],
                } as GraphInterpretation}
                indicatorState={{}}
                setIndicatorState={setIndicatorState}
                setMode={vi.fn()}
            />
        );

        fireEvent.click(screen.getByLabelText("Theme"));

        expect(setIndicatorState).toHaveBeenCalled();
    });
});
