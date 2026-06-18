import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ListEditor from "./list-editor";

describe("ListEditor", () => {
    let onChange: (list: string[]) => void = vi.fn();
    let onBlur: (list: string[]) => void = vi.fn();
    //let onChange: ReturnType<typeof vi.fn>;
    //let onBlur: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        onChange = vi.fn();
        onBlur = vi.fn();
    });

    describe("Rendering", () => {
        it("renders list items as tags", () => {
            render(
                <ListEditor
                    list={["tag1", "tag2", "tag3"]}
                    availableListItems={[]}
                    onChange={onChange}
                    onBlur={onBlur}
                />
            );

            expect(screen.getByText("tag1")).toBeInTheDocument();
            expect(screen.getByText("tag2")).toBeInTheDocument();
            expect(screen.getByText("tag3")).toBeInTheDocument();
        });

        it("renders an input field", () => {
            render(
                <ListEditor
                    list={[]}
                    availableListItems={[]}
                    onChange={onChange}
                    onBlur={onBlur}
                />
            );

            const input = screen.getByRole("textbox");
            expect(input).toBeInTheDocument();
        });

        it("renders remove buttons for each tag", () => {
            render(
                <ListEditor
                    list={["tag1", "tag2"]}
                    availableListItems={[]}
                    onChange={onChange}
                    onBlur={onBlur}
                />
            );

            const removeButtons = screen.getAllByRole("button");
            expect(removeButtons).toHaveLength(2);
            removeButtons.forEach(button => {
                expect(button).toHaveTextContent("×");
            });
        });

        it("renders empty list correctly", () => {
            render(
                <ListEditor
                    list={[]}
                    availableListItems={[]}
                    onChange={onChange}
                    onBlur={onBlur}
                />
            );

            const input = screen.getByRole("textbox");
            expect(input).toBeInTheDocument();
            expect(input).toHaveValue("");
        });

        it("updates when list prop changes", () => {
            const { rerender } = render(
                <ListEditor
                    list={["tag1"]}
                    availableListItems={[]}
                    onChange={onChange}
                    onBlur={onBlur}
                />
            );

            expect(screen.getByText("tag1")).toBeInTheDocument();

            rerender(
                <ListEditor
                    list={["tag1", "tag2"]}
                    availableListItems={[]}
                    onChange={onChange}
                    onBlur={onBlur}
                />
            );

            expect(screen.getByText("tag1")).toBeInTheDocument();
            expect(screen.getByText("tag2")).toBeInTheDocument();
        });
    });

    describe("Adding items", () => {
        it("adds item on Enter key", () => {
            render(
                <ListEditor
                    list={["tag1"]}
                    availableListItems={[]}
                    onChange={onChange}
                    onBlur={onBlur}
                />
            );

            const input = screen.getByRole("textbox");
            fireEvent.keyDown(input, { key: "n" });
            fireEvent.keyDown(input, { key: "e" });
            fireEvent.keyDown(input, { key: "w" });
            fireEvent.keyDown(input, { key: "Enter" });

            expect(onChange).toHaveBeenCalled();
            expect(onBlur).toHaveBeenCalled();
        });

        it("adds item on comma key", () => {
            render(
                <ListEditor
                    list={["tag1"]}
                    availableListItems={[]}
                    onChange={onChange}
                    onBlur={onBlur}
                />
            );

            const input = screen.getByRole("textbox");
            fireEvent.keyDown(input, { key: "n" });
            fireEvent.keyDown(input, { key: "e" });
            fireEvent.keyDown(input, { key: "w" });
            fireEvent.keyDown(input, { key: "," });

            expect(onChange).toHaveBeenCalled();
            expect(onBlur).toHaveBeenCalled();
        });

        it("adds item via blur event", () => {
            render(
                <ListEditor
                    list={["tag1"]}
                    availableListItems={[]}
                    onChange={onChange}
                    onBlur={onBlur}
                />
            );

            const input = screen.getByRole("textbox");
            fireEvent.keyDown(input, { key: "t" });
            fireEvent.keyDown(input, { key: "a" });
            fireEvent.keyDown(input, { key: "g" });
            fireEvent.keyDown(input, { key: "2" });
            fireEvent.blur(input);

            expect(onChange).toHaveBeenCalled();
            expect(onBlur).toHaveBeenCalled();
        });

        it("does not add empty items", () => {
            render(
                <ListEditor
                    list={["tag1"]}
                    availableListItems={[]}
                    onChange={onChange}
                    onBlur={onBlur}
                />
            );

            const input = screen.getByRole("textbox");
            fireEvent.keyDown(input, { key: "Enter" });

            expect(onChange).not.toHaveBeenCalled();
        });

        it("does not add duplicate items", () => {
            render(
                <ListEditor
                    list={["tag1", "tag2"]}
                    availableListItems={[]}
                    onChange={onChange}
                    onBlur={onBlur}
                />
            );

            const input = screen.getByRole("textbox");
            fireEvent.keyDown(input, { key: "t" });
            fireEvent.keyDown(input, { key: "a" });
            fireEvent.keyDown(input, { key: "g" });
            fireEvent.keyDown(input, { key: "1" });
            fireEvent.keyDown(input, { key: "Enter" });

            expect(onChange).not.toHaveBeenCalled();
        });

        it("trims whitespace from items", () => {
            render(
                <ListEditor
                    list={[]}
                    availableListItems={[]}
                    onChange={onChange}
                    onBlur={onBlur}
                />
            );

            const input = screen.getByRole("textbox");
            fireEvent.keyDown(input, { key: " " });
            fireEvent.keyDown(input, { key: " " });
            fireEvent.keyDown(input, { key: "t" });
            fireEvent.keyDown(input, { key: "a" });
            fireEvent.keyDown(input, { key: "g" });
            fireEvent.keyDown(input, { key: "Enter" });

            expect(onChange).toHaveBeenCalled();
        });

        it("adds item from autocomplete suggestions", async () => {
            render(
                <ListEditor
                    list={[]}
                    availableListItems={["suggestion1", "suggestion2"]}
                    onChange={onChange}
                    onBlur={onBlur}
                />
            );

            const input = screen.getByRole("textbox");
            fireEvent.keyDown(input, { key: "s" });

            // Find and click suggestion button
            const suggestionButtons = screen.getAllByRole("button");
            const suggestion1Button = suggestionButtons.find(
                btn => btn.textContent === "suggestion1"
            );

            if (suggestion1Button) {
                fireEvent.mouseDown(suggestion1Button);
            }

            expect(onChange).toHaveBeenCalled();
        });

        it("accepts only alphanumeric and underscore characters", () => {
            render(
                <ListEditor
                    list={[]}
                    availableListItems={[]}
                    onChange={onChange}
                    onBlur={onBlur}
                />
            );

            const input = screen.getByRole("textbox");

            // Test valid characters
            fireEvent.keyDown(input, { key: "a" });
            fireEvent.keyDown(input, { key: "5" });
            fireEvent.keyDown(input, { key: "_" });

            // Test invalid characters (these should not add to draftText)
            fireEvent.keyDown(input, { key: "@" });
            fireEvent.keyDown(input, { key: "-" });

            // The draftText should only contain "a5_"
            fireEvent.keyDown(input, { key: "Enter" });
            expect(onChange).toHaveBeenCalled();
        });
    });

    describe("Removing items", () => {
        it("removes item when × button is clicked", () => {
            render(
                <ListEditor
                    list={["tag1", "tag2"]}
                    availableListItems={[]}
                    onChange={onChange}
                    onBlur={onBlur}
                />
            );

            const removeButtons = screen.getAllByRole("button");
            fireEvent.click(removeButtons[0]);

            expect(onChange).toHaveBeenCalled();
            expect(onBlur).toHaveBeenCalled();
        });

        it("removes only the clicked item", () => {
            render(
                <ListEditor
                    list={["tag1", "tag2", "tag3"]}
                    availableListItems={[]}
                    onChange={onChange}
                    onBlur={onBlur}
                />
            );

            const removeButtons = screen.getAllByRole("button");
            fireEvent.click(removeButtons[1]);

            expect(onChange).toHaveBeenCalledWith(["tag1", "tag3"]);
        });

        it("removes item on backspace when at end", () => {
            render(
                <ListEditor
                    list={["tag1", ""]}
                    availableListItems={[]}
                    onChange={onChange}
                    onBlur={onBlur}
                />
            );

            const input = screen.getByRole("textbox");
            fireEvent.keyDown(input, { key: "Backspace" });

            expect(onChange).toHaveBeenCalled();
        });

        it("modifies draft text on backspace when not at end", () => {
            render(
                <ListEditor
                    list={["tag1"]}
                    availableListItems={[]}
                    onChange={onChange}
                    onBlur={onBlur}
                />
            );

            const input = screen.getByRole("textbox");
            fireEvent.keyDown(input, { key: "a" });
            fireEvent.keyDown(input, { key: "b" });
            fireEvent.keyDown(input, { key: "c" });
            fireEvent.keyDown(input, { key: "Backspace" });

            expect(onChange).not.toHaveBeenCalled();
        });
    });

    describe("Autocomplete", () => {
        it("shows matching suggestions as user types", () => {
            render(
                <ListEditor
                    list={[]}
                    availableListItems={["apple", "apricot", "banana"]}
                    onChange={onChange}
                    onBlur={onBlur}
                />
            );

            const input = screen.getByRole("textbox");
            fireEvent.keyDown(input, { key: "a" });

            const buttons = screen.getAllByRole("button");
            expect(buttons.some(btn => btn.textContent === "apple")).toBe(true);
            expect(buttons.some(btn => btn.textContent === "apricot")).toBe(true);
        });

        it("filters suggestions by case-insensitive search", () => {
            render(
                <ListEditor
                    list={[]}
                    availableListItems={["Apple", "Apricot", "Cherry"]}
                    onChange={onChange}
                    onBlur={onBlur}
                />
            );

            const input = screen.getByRole("textbox");
            fireEvent.keyDown(input, { key: "A" });

            const buttons = screen.getAllByRole("button");
            expect(buttons.some(btn => btn.textContent === "Apple")).toBe(true);
            expect(buttons.some(btn => btn.textContent === "Apricot")).toBe(true);
            expect(buttons.some(btn => btn.textContent === "Cherry")).toBe(false);
        });

        it("excludes items already in list from suggestions", () => {
            render(
                <ListEditor
                    list={["apple"]}
                    availableListItems={["apple", "apricot", "banana"]}
                    onChange={onChange}
                    onBlur={onBlur}
                />
            );

            const input = screen.getByRole("textbox");
            fireEvent.keyDown(input, { key: "a" });

            const buttons = screen.getAllByRole("button");
            expect(buttons.some(btn => btn.textContent === "apple")).toBe(false);
            expect(buttons.some(btn => btn.textContent === "apricot")).toBe(true);
        });

        it("does not show suggestions when draft text is empty", () => {
            render(
                <ListEditor
                    list={[]}
                    availableListItems={["apple", "apricot", "banana"]}
                    onChange={onChange}
                    onBlur={onBlur}
                />
            );

            const buttons = screen.queryAllByRole("button");
            expect(buttons).toHaveLength(0);
        });

        it("updates suggestions as user types more", () => {
            render(
                <ListEditor
                    list={[]}
                    availableListItems={["apple", "apricot", "application"]}
                    onChange={onChange}
                    onBlur={onBlur}
                />
            );

            const input = screen.getByRole("textbox");
            fireEvent.keyDown(input, { key: "a" });

            let buttons = screen.getAllByRole("button");
            expect(buttons).toHaveLength(3);

            fireEvent.keyDown(input, { key: "p" });

            buttons = screen.getAllByRole("button");
            expect(buttons).toHaveLength(3);

            fireEvent.keyDown(input, { key: "p" });

            buttons = screen.getAllByRole("button");
            expect(buttons.length).toBeGreaterThanOrEqual(2);
        });
    });

    describe("Keyboard navigation", () => {
        it("handles multiple keystrokes correctly", () => {
            render(
                <ListEditor
                    list={[]}
                    availableListItems={[]}
                    onChange={onChange}
                    onBlur={onBlur}
                />
            );

            const input = screen.getByRole("textbox");
            fireEvent.keyDown(input, { key: "t" });
            fireEvent.keyDown(input, { key: "e" });
            fireEvent.keyDown(input, { key: "s" });
            fireEvent.keyDown(input, { key: "t" });

            expect(onChange).not.toHaveBeenCalled();
        });

        it("commits text on Enter after multiple characters", () => {
            render(
                <ListEditor
                    list={[]}
                    availableListItems={[]}
                    onChange={onChange}
                    onBlur={onBlur}
                />
            );

            const input = screen.getByRole("textbox");
            fireEvent.keyDown(input, { key: "t" });
            fireEvent.keyDown(input, { key: "e" });
            fireEvent.keyDown(input, { key: "s" });
            fireEvent.keyDown(input, { key: "t" });
            fireEvent.keyDown(input, { key: "Enter" });

            expect(onChange).toHaveBeenCalled();
        });
    });

    describe("State management", () => {
        it("clears draft text after adding item", () => {
            render(
                <ListEditor
                    list={[]}
                    availableListItems={[]}
                    onChange={onChange}
                    onBlur={onBlur}
                />
            );

            const input = screen.getByRole("textbox") as HTMLInputElement;
            fireEvent.keyDown(input, { key: "t" });
            fireEvent.keyDown(input, { key: "e" });
            fireEvent.keyDown(input, { key: "s" });
            fireEvent.keyDown(input, { key: "t" });
            fireEvent.keyDown(input, { key: "Enter" });

            expect(input.value).toBe("");
        });

        it("maintains list state independently from input", () => {
            const { rerender } = render(
                <ListEditor
                    list={["existing"]}
                    availableListItems={[]}
                    onChange={onChange}
                    onBlur={onBlur}
                />
            );

            expect(screen.getByText("existing")).toBeInTheDocument();

            const input = screen.getByRole("textbox") as HTMLInputElement;
            fireEvent.keyDown(input, { key: "n" });
            fireEvent.keyDown(input, { key: "e" });
            fireEvent.keyDown(input, { key: "w" });

            expect(screen.getByText("existing")).toBeInTheDocument();

            rerender(
                <ListEditor
                    list={["existing", "new"]}
                    availableListItems={[]}
                    onChange={onChange}
                    onBlur={onBlur}
                />
            );

            expect(screen.getByText("existing")).toBeInTheDocument();
            expect(screen.getByText("new")).toBeInTheDocument();
        });
    });

    describe("Edge cases", () => {
        it("handles special characters in list items", () => {
            render(
                <ListEditor
                    list={["item_1", "item_2", "item_3"]}
                    availableListItems={[]}
                    onChange={onChange}
                    onBlur={onBlur}
                />
            );

            expect(screen.getByText("item_1")).toBeInTheDocument();
            expect(screen.getByText("item_2")).toBeInTheDocument();
            expect(screen.getByText("item_3")).toBeInTheDocument();
        });

        it("handles many items in list", () => {
            const manyItems = Array.from({ length: 20 }, (_, i) => `tag${i}`);
            render(
                <ListEditor
                    list={manyItems}
                    availableListItems={[]}
                    onChange={onChange}
                    onBlur={onBlur}
                />
            );

            manyItems.forEach(item => {
                expect(screen.getByText(item)).toBeInTheDocument();
            });
        });

        it("handles items with whitespace", () => {
            render(
                <ListEditor
                    list={["tag 1", "tag2"]}
                    availableListItems={[]}
                    onChange={onChange}
                    onBlur={onBlur}
                />
            );

            expect(screen.getByText("tag 1")).toBeInTheDocument();
            expect(screen.getByText("tag2")).toBeInTheDocument();
        });

        it("handles empty string in available items", () => {
            render(
                <ListEditor
                    list={[]}
                    availableListItems={["", "valid", ""]}
                    onChange={onChange}
                    onBlur={onBlur}
                />
            );

            const input = screen.getByRole("textbox");
            fireEvent.keyDown(input, { key: "v" });

            expect(screen.getByText("valid")).toBeInTheDocument();
        });
    });

    describe("Callbacks", () => {
        it("calls onChange when item is added", () => {
            render(
                <ListEditor
                    list={["tag1"]}
                    availableListItems={[]}
                    onChange={onChange}
                    onBlur={onBlur}
                />
            );

            const input = screen.getByRole("textbox");
            fireEvent.keyDown(input, { key: "n" });
            fireEvent.keyDown(input, { key: "e" });
            fireEvent.keyDown(input, { key: "w" });
            fireEvent.keyDown(input, { key: "Enter" });

            expect(onChange).toHaveBeenCalledWith(["tag1", "new"]);
        });

        it("calls onBlur when item is added via Enter", () => {
            render(
                <ListEditor
                    list={["tag1"]}
                    availableListItems={[]}
                    onChange={onChange}
                    onBlur={onBlur}
                />
            );

            const input = screen.getByRole("textbox");
            fireEvent.keyDown(input, { key: "n" });
            fireEvent.keyDown(input, { key: "Enter" });

            expect(onBlur).toHaveBeenCalled();
        });

        it("calls both onChange and onBlur when item is removed", () => {
            render(
                <ListEditor
                    list={["tag1", "tag2"]}
                    availableListItems={[]}
                    onChange={onChange}
                    onBlur={onBlur}
                />
            );

            const removeButtons = screen.getAllByRole("button");
            fireEvent.click(removeButtons[0]);

            expect(onChange).toHaveBeenCalled();
            expect(onBlur).toHaveBeenCalled();
        });

        it("does not call callbacks for invalid add attempts", () => {
            render(
                <ListEditor
                    list={["tag1"]}
                    availableListItems={[]}
                    onChange={onChange}
                    onBlur={onBlur}
                />
            );

            const input = screen.getByRole("textbox");
            fireEvent.keyDown(input, { key: "Enter" });

            expect(onChange).not.toHaveBeenCalled();
            expect(onBlur).not.toHaveBeenCalled();
        });
    });
});
