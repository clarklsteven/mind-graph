import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import CreationControls from "./creation-controls";
import type { GraphInterpretation } from "../../../core/model/graph-interpretation";

describe("CreationControls", () => {
    it("renders node and relationship options and updates the selected type", () => {
        const setAddNodeType = vi.fn();
        const setAddEdgeType = vi.fn();

        render(
            <CreationControls
                graphLookupSets={[]}
                mode="add"
                setMode={vi.fn()}
                interpretation={{
                    node_definitions: [{ id: "idea", label: "Idea" }],
                    relationship_definitions: [{ id: "connects", label: "Connects" }],
                } as GraphInterpretation}
                addNodeType=""
                setAddNodeType={setAddNodeType}
                addEdgeType=""
                setAddEdgeType={setAddEdgeType}
            />
        );

        fireEvent.click(screen.getByText("Idea"));
        fireEvent.click(screen.getByRole("button", { name: "Links" }));
        fireEvent.click(screen.getByText("Connects"));

        expect(screen.queryByText("Idea")).not.toBeInTheDocument();
        expect(screen.getByText("Connects")).toBeInTheDocument();
        expect(setAddNodeType).toHaveBeenCalledWith("idea");
        expect(setAddEdgeType).not.toHaveBeenCalled();
    });

    it("updates the edge type when link mode is active", () => {
        const setAddEdgeType = vi.fn();

        render(
            <CreationControls
                graphLookupSets={[]}
                mode="link"
                setMode={vi.fn()}
                interpretation={{
                    node_definitions: [],
                    relationship_definitions: [{ id: "connects", label: "Connects" }],
                } as unknown as GraphInterpretation}
                addNodeType=""
                setAddNodeType={vi.fn()}
                addEdgeType=""
                setAddEdgeType={setAddEdgeType}
            />
        );

        fireEvent.click(screen.getByRole("button", { name: "Links" }));
        fireEvent.click(screen.getByText("Connects"));

        expect(setAddEdgeType).toHaveBeenCalledWith("connects");
    });
});
