import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CreateFlexibleSchemaModal from "./create-flexible-schema-modal";
import type { GraphInterpretation } from "../../core/model/graph-interpretation";

describe("CreateFlexibleSchemaModal", () => {
    const schemas: GraphInterpretation[] = [
        {
            id: "mind-map",
            interpretation_type: "mind-map",
            label: "Mind Map",
            schema_type: "flexible",
            node_definitions: [{ label: "Idea", color: "#000000" } as any],
            relationship_definitions: [{ label: "Related" } as any]
        }
    ];

    it("renders the modal and allows creating a schema with a name", async () => {
        const onClose = vi.fn();
        const onCreate = vi.fn();

        render(
            <CreateFlexibleSchemaModal
                schemas={schemas}
                isOpen={true}
                onClose={onClose}
                onCreate={onCreate}
            />
        );

        expect(screen.getByRole("dialog", { name: /create flexible schema/i })).toBeInTheDocument();
        const nameInput = screen.getByRole("textbox");
        await userEvent.type(nameInput, "My Schema");
        await userEvent.click(screen.getByRole("button", { name: /create/i }));

        expect(onCreate).toHaveBeenCalledWith(expect.objectContaining({
            label: "My Schema",
            schema_type: "flexible"
        }));
        expect(onClose).toHaveBeenCalled();
    });

    it("adds node and edge definitions from the selected library schema", async () => {
        const onCreate = vi.fn();

        render(
            <CreateFlexibleSchemaModal
                schemas={schemas}
                isOpen={true}
                onClose={vi.fn()}
                onCreate={onCreate}
            />
        );

        await userEvent.click(screen.getByText("Mind Map"));
        await userEvent.click(screen.getByRole("button", { name: /nodes/i }));
        await userEvent.click(screen.getByRole("button", { name: /\+/i }));
        await userEvent.click(screen.getByRole("button", { name: /edges/i }));
        await userEvent.click(screen.getAllByRole("button", { name: /\+/i })[1]);

        expect(onCreate).not.toHaveBeenCalled();
        expect(screen.getByText("Idea")).toBeInTheDocument();
        expect(screen.getByText("Related")).toBeInTheDocument();
    });
});
