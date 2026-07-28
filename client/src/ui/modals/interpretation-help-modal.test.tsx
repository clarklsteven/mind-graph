import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { InterpretationHelpModal } from "./interpretation-help-modal";
import type { GraphInterpretation } from "../../core/model/graph-interpretation";

describe("InterpretationHelpModal", () => {
    beforeEach(() => {
        vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
            text: vi.fn().mockResolvedValue("# Help Content\n\nThis is rendered markdown.")
        }));
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("renders loading state and then help content when opened", async () => {
        const interpretation: GraphInterpretation = {
            id: "mind-map",
            interpretation_type: "mind-map",
            label: "Mind Map",
            schema_type: "application",
            helpMarkdown: "mind-map-help.md"
        };

        render(
            <InterpretationHelpModal
                isOpen={true}
                onClose={vi.fn()}
                interpretation={interpretation}
            />
        );

        expect(screen.getByText(/loading help/i)).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByText(/help content/i)).toBeInTheDocument();
        });
        expect(screen.getByText(/this is rendered markdown/i)).toBeInTheDocument();
    });

    it("returns null when no help markdown is provided", () => {
        const interpretation: GraphInterpretation = {
            id: "mind-map",
            interpretation_type: "mind-map",
            label: "Mind Map",
            schema_type: "application"
        };

        const { container } = render(
            <InterpretationHelpModal
                isOpen={true}
                onClose={vi.fn()}
                interpretation={interpretation}
            />
        );

        expect(container).toBeEmptyDOMElement();
    });
});
