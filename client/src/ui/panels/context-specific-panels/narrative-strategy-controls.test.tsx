import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import NarrativeStrategyControls from "./narrative-strategy-controls";
import type { GraphInterpretation } from "../../../core/model/graph-interpretation";
import type { GraphLookupSet } from "../../../core/model/graph-data";

describe("NarrativeStrategyControls", () => {
    it("renders create controls and switches to focus options", () => {
        const setFocusSet = vi.fn();

        render(
            <NarrativeStrategyControls
                graphLookupSets={[
                    { id: "project", values: ["Alpha", "Beta"] },
                    { id: "chapter", values: ["Intro"] },
                    { id: "tags", values: ["tag-1"] },
                ] as GraphLookupSet[]}
                mode="select"
                setMode={vi.fn()}
                interpretation={{
                    option_sets: [{ id: "status", values: ["Open", "Done"] }, { id: "dimension", values: ["Tactical"] }],
                } as GraphInterpretation}
                addNodeType=""
                setAddNodeType={vi.fn()}
                addEdgeType=""
                setAddEdgeType={vi.fn()}
                focusSet={{}}
                setFocusSet={setFocusSet}
            />
        );

        expect(screen.getByText("Goal")).toBeInTheDocument();
        expect(screen.queryByText("Leads to")).not.toBeInTheDocument();

        fireEvent.click(screen.getByRole("button", { name: "Focus" }));

        expect(screen.getByText("Project:")).toBeInTheDocument();
        expect(screen.getByText("Status:")).toBeInTheDocument();
        expect(screen.getByText("Alpha")).toBeInTheDocument();
    });

    it("updates the focus set when a checkbox is clicked", () => {
        const setFocusSet = vi.fn();

        render(
            <NarrativeStrategyControls
                graphLookupSets={[
                    { id: "project", values: ["Alpha"] },
                    { id: "chapter", values: ["Intro"] },
                    { id: "tags", values: ["tag-1"] },
                ] as GraphLookupSet[]}
                mode="select"
                setMode={vi.fn()}
                interpretation={{ option_sets: [] } as unknown as GraphInterpretation}
                addNodeType=""
                setAddNodeType={vi.fn()}
                addEdgeType=""
                setAddEdgeType={vi.fn()}
                focusSet={{}}
                setFocusSet={setFocusSet}
            />
        );

        fireEvent.click(screen.getByRole("button", { name: "Focus" }));
        fireEvent.click(screen.getByLabelText("Alpha"));

        expect(setFocusSet).toHaveBeenCalled();
        const updater = setFocusSet.mock.calls[0][0];
        expect(updater({})).toEqual({ project: ["Alpha"] });
    });
});
