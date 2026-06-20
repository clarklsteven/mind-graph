import { useEffect, useState } from "react";
import { Modal } from "./modal";
import { getPropertyInputStyle, getPropertyLabelStyle } from "../utils/styles";
import type { ReferenceKind } from "../../core/model/artefact-reference";

type NewReferenceModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (label: string, target: string, kind: ReferenceKind) => void;
};

const referenceKindOptions = ["url", "file", "graph", "obsidian", "unknown"];

export function NewReferenceModal({
    isOpen,
    onClose,
    onCreate,
}: NewReferenceModalProps) {
    const [label, setLabel] = useState<string>("");
    const [target, setTarget] = useState<string>("");
    const [kind, setKind] = useState<ReferenceKind>("unknown");

    useEffect(() => {
        if (isOpen) {
            setLabel("New Reference");
            setTarget("");
            setKind("unknown");
        }
    }, [isOpen]);

    return (
        <Modal isOpen={isOpen} title="Create New Reference" onClose={onClose}>
            <div>
                <div style={getPropertyLabelStyle()}>Reference Label</div>
                <input
                    type="text"
                    role="textbox"
                    aria-label="Reference Label"
                    value={label}
                    style={getPropertyInputStyle()}
                    onChange={(e) => setLabel(e.target.value)}
                />
            </div>

            <div>
                <div style={getPropertyLabelStyle()}>Reference Target</div>
                <input
                    type="text"
                    role="textbox"
                    aria-label="Graph Name"
                    value={target}
                    style={getPropertyInputStyle()}
                    onChange={(e) => setTarget(e.target.value)}
                />
            </div>

            <div>
                <div style={getPropertyLabelStyle()}>Kind</div>
                <select
                    value={kind}
                    role="combobox"
                    aria-label="Kind"
                    style={getPropertyInputStyle()}
                    onChange={(e) => setKind(e.target.value as ReferenceKind)}
                >
                    {referenceKindOptions.map((kind) => (
                        <option
                            key={kind}
                            value={kind}
                        >
                            {kind.charAt(0).toUpperCase() + kind.slice(1)}
                        </option>
                    ))}
                </select>
            </div>

            <div style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-end",
                gap: "8px",
                marginTop: "12px"
            }}>
                <button
                    onClick={onClose}
                    style={{
                        padding: "6px 12px",
                        backgroundColor: "#e0d8c8",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer"
                    }}
                >
                    Cancel
                </button>
                <button
                    onClick={() => {
                        onCreate(label.trim() || "New Reference", target.trim(), kind);
                        onClose();
                    }}
                    style={{
                        padding: "6px 12px",
                        backgroundColor: "#00332a",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer"
                    }}

                >
                    Create
                </button>
            </div>
        </Modal>
    );
}