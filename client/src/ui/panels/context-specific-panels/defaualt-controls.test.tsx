import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import DefaultControls from "./defaualt-controls";

describe("DefaultControls", () => {
    it("renders the fallback help text", () => {
        render(<DefaultControls />);

        expect(screen.getByText("Default controls for unrecognized graph types.")).toBeInTheDocument();
    });
});
