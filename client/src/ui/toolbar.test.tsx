import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Toolbar from "./toolbar";

describe("Toolbar", () => {
    it("renders the toolbar title and button titles", () => {
        render(
            <Toolbar
                onSave={vi.fn()}
                onCreate={vi.fn()}
                onSettings={vi.fn()}
                onHelp={vi.fn()}
                onLoadGraph={vi.fn()}
                onCreateFlexibleSchema={vi.fn()}
            />
        );

        expect(screen.getByText("Mind Graph")).toBeInTheDocument();
        expect(screen.getByTitle("New Graph")).toBeInTheDocument();
        expect(screen.getByTitle("Load Graph")).toBeInTheDocument();
        expect(screen.getByTitle("Save Graph")).toBeInTheDocument();
        expect(screen.getByTitle("Settings")).toBeInTheDocument();
        expect(screen.getByTitle("Help")).toBeInTheDocument();
    });

    it("calls the provided handlers when buttons are clicked", () => {
        const onSave = vi.fn();
        const onCreate = vi.fn();
        const onSettings = vi.fn();
        const onHelp = vi.fn();
        const onLoadGraph = vi.fn();
        const onCreateFlexibleSchema = vi.fn();

        render(
            <Toolbar
                onSave={onSave}
                onCreate={onCreate}
                onSettings={onSettings}
                onHelp={onHelp}
                onLoadGraph={onLoadGraph}
                onCreateFlexibleSchema={onCreateFlexibleSchema}
            />
        );

        fireEvent.click(screen.getByTitle("New Graph"));
        fireEvent.click(screen.getByTitle("Load Graph"));
        fireEvent.click(screen.getByTitle("Save Graph"));
        fireEvent.click(screen.getByTitle("Settings"));
        fireEvent.click(screen.getByTitle("Help"));

        expect(onCreate).toHaveBeenCalledTimes(1);
        expect(onLoadGraph).toHaveBeenCalledTimes(1);
        expect(onSave).toHaveBeenCalledTimes(1);
        expect(onSettings).toHaveBeenCalledTimes(1);
        expect(onHelp).toHaveBeenCalledTimes(1);
    });
});
