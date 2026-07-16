import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import FlexibleControls from "./flexible-controls";

describe("FlexibleControls", () => {
    it("renders the creation controls with interpretation content", () => {
        render(
            <FlexibleControls
                graphLookupSets={[]}
                mode="select"
                setMode={vi.fn()}
                interpretation={{
                    node_definitions: [{ id: "idea", label: "Idea" }],
                    relationship_definitions: [{ id: "connects", label: "Connects" }],
                } as any}
                addNodeType=""
                setAddNodeType={vi.fn()}
                addEdgeType=""
                setAddEdgeType={vi.fn()}
            />
        );

        expect(screen.getByText("Idea")).toBeInTheDocument();
        expect(screen.queryByText("Connects")).not.toBeInTheDocument();
    });
});
