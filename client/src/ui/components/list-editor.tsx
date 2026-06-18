import React, { useEffect, useState } from "react";
import { getPropertyInputStyle } from "../utils/styles";
import { asiguraPalette } from "../utils/asigura-palette";

interface ListEditorProps {
    list: string[];
    availableListItems: string[];
    onChange: (list: string[]) => void;
    onBlur: (list: string[]) => void;
}

export default function ListEditor({
    list,
    availableListItems,
    onChange,
    onBlur
}: ListEditorProps) {
    const [text, setText] = useState(list.join(", "));
    const [draftText, setDraftText] = useState("");
    const matchingListItems = draftText === "" ? [] : availableListItems
        .filter(item => item.toLowerCase().includes(draftText.toLowerCase()))
        .filter(item => !list.includes(item));

    useEffect(() => {
        setText(list.join(", "));
    }, [list]);

    function commit() {
        addItem(draftText);
    }

    function addItem(item: string) {
        const cleanedItem = item.trim();
        if (cleanedItem === "") return;
        if (list.includes(cleanedItem)) return;

        const updatedList = [...list, cleanedItem];

        onChange(updatedList);
        onBlur(updatedList);
        setDraftText("");
    }

    function removeLastListItem() {
        list.pop();
        onChange(list);
        setText(text.slice(0, -1));
        setDraftText("");
    }

    function removeItem(item: string) {
        const updatedList = list.filter(element => element !== item);

        onChange(updatedList);
        onBlur(updatedList);
    }

    function processKeystroke(e: React.KeyboardEvent | null) {
        if (!e) return;

        if (e.key === "Backspace" && list[list.length - 1] === "") {
            removeLastListItem();
        }
        else if (e.key === "Backspace") {
            setDraftText(draftText.slice(0, -1));
        }
        else if (e.key === "Enter" || e.key === ",") {
            commit();
        }
        else {
            if (/^[A-Za-z0-9_]$/.test(e.key)) {
                setDraftText(draftText + e.key);
            }
        }
    }

    return (
        <div
            style={{
                width: "100%",
                padding: "8px 10px",
                border: "1px solid rgb(210, 205, 190)",
                borderRadius: "8px",
                backgroundColor: "rgb(255, 250, 231)",
                color: "rgb(70, 50, 60)",
                fontSize: "14px",
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                gap: "4px",
                position: "relative"
            }}
        >
            {list.map(item => (
                <span key={item} className="tag-pill"

                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "2px",
                        backgroundColor: asiguraPalette["asigura-8"],
                        border: "1px solid " + asiguraPalette["asigura-6"],
                        borderRadius: "4px",
                        paddingTop: "2px",
                        paddingBottom: "2px",
                        paddingLeft: "4px",
                        paddingRight: "4px"
                    }}>
                    {item}
                    <button
                        style={{
                            backgroundColor: asiguraPalette["asigura-8pt5"],
                            border: "1px solid " + asiguraPalette["asigura-6"],
                            borderRadius: "4px",
                        }}
                        onClick={() => removeItem(item)}>×</button>
                </span>
            ))}
            <input
                type="text"
                value={draftText}
                style={getPropertyInputStyle()}
                onChange={() => { }}
                onBlur={() => commit()}
                onKeyDown={(e) => {
                    processKeystroke(e);
                }}
            />
            {matchingListItems.length > 0 && (
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "2px",

                        position: "absolute",
                        top: "100%",
                        left: 0,
                        right: 0,
                        zIndex: 1000,
                        backgroundColor: asiguraPalette["asigura-9"],
                        border: "1px " + asiguraPalette["asigura-6"],
                        borderRadius: "4px",
                        boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
                    }}
                >
                    {matchingListItems.map(item => (
                        <button
                            key={item}
                            type="button"
                            style={{
                                backgroundColor: asiguraPalette["asigura-8pt5"],
                                border: "1px " + asiguraPalette["asigura-6"],
                                borderRadius: "6px",
                                paddingTop: "2px",
                                paddingBottom: "2px",
                                paddingLeft: "4px",
                                paddingRight: "4px"

                            }}
                            onMouseDown={(e) => {
                                e.preventDefault();
                                addItem(item);
                            }}
                        >
                            {item}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}