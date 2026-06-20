import { useState } from "react";
import type { ArtifactReference, ReferenceKind } from "../../core/model/artefact-reference";
import { asiguraPalette } from "../utils/asigura-palette";
import { NewReferenceModal } from "../modals/new-reference-modal";

interface ReferenceEditorProps {
    referenceList: ArtifactReference[];
    onChange: (referenceList: ArtifactReference[]) => void;
}

export default function ReferenceEditor({
    referenceList,
    onChange
}: ReferenceEditorProps
) {
    const [isNewReferenceModalOpen, setIsNewReferenceModalOpen] = useState<boolean>(false);

    const onNew = () => { console.log("onNew called"); setIsNewReferenceModalOpen(true); }
    const onClose = () => { setIsNewReferenceModalOpen(false); }
    const onCreate = (label: string, target: string, kind: ReferenceKind) => {
        const updatedReferences = [
            ...referenceList,
            {
                label: label,
                target: target,
                kind: kind
            }
        ];

        onChange(updatedReferences);
        setIsNewReferenceModalOpen(false);
    }

    function removeReference(label: string) {
        const updatedReferences = [
            ...referenceList
        ];
        const index = updatedReferences.findIndex((reference: ArtifactReference) => reference.label === label);
        updatedReferences.splice(index, 1);
        onChange(updatedReferences);
    }

    function getReferenceIcon(kind: string): string {
        switch (kind) {
            case "obsidian":
                return "📚";
            case "url":
                return "🔗";
            case "file":
                return "📄";
            case "graph":
                return "🧠";
            case "unknown":
            default:
                return "❓";
        }
    }

    function openReference(referenceLabel: string) {
        console.log("Asked to open the reference for: " + referenceLabel);
        const reference = referenceList.find((reference: ArtifactReference) => reference.label === referenceLabel);
        if (!reference) {
            console.warn("Reference not found for label: " + referenceLabel);
            return;
        };
        switch (reference.kind) {
            case "url":
                openUrl(reference);
                break;

            case "graph":
                openGraph(reference);
                break;

            case "obsidian":
                openObsidian(reference);
                break;

            case "file":
                openFile(reference);
                break;

            default:
                console.warn(
                    `Unknown reference type: ${reference.kind}`
                );
        }
    }

    function openUrl(reference: ArtifactReference) {
        window.open(reference.target, "_blank");
    }

    function openGraph(reference: ArtifactReference) {
        console.log(`The ability to open the graph: ${reference.label} will come soon...`);
    }

    function openObsidian(reference: ArtifactReference) {
        window.location.href = reference.target;
    }

    function openFile(reference: ArtifactReference) {
        console.log(`The ability to open the file: ${reference.label} will come soon...`);
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
            <div
                style={{ width: "100%" }}
            >
                <button
                    style={{
                        width: "100%",
                        padding: "4px 4px",
                        textAlign: "center",
                        border: "1px solid " + asiguraPalette["asigura-6"],
                        borderRadius: "8px",
                        backgroundColor: asiguraPalette["asigura-5"],
                        color: asiguraPalette["asigura-10"],
                        cursor: "pointer",
                        fontSize: "14px",
                        fontWeight: 500,
                    }}
                    onClick={onNew}
                >Add Reference</button>
            </div>
            {
                referenceList.map(item => (
                    <div key={item.label} className="reference-card"

                        style={{
                            width: "100%",
                            boxSizing: "border-box",
                            maxWidth: "100%",
                            overflow: "hidden",
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            gap: "4px",
                            backgroundColor: asiguraPalette["asigura-8"],
                            border: "1px solid " + asiguraPalette["asigura-6"],
                            borderRadius: "4px",
                            padding: "2px 2px 4px 4px"
                        }}>
                        {getReferenceIcon(item.kind)}
                        <span
                            style={{
                                flexGrow: 1,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                            }}>
                            {item.label}
                        </span>
                        <div
                            key={item.label}
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                flexShrink: 0,
                                alignItems: "center",
                                gap: "4px",
                                backgroundColor: asiguraPalette["asigura-8"],
                                boxSizing: "border-box",
                            }}
                        >
                            <button
                                style={{
                                    backgroundColor: asiguraPalette["asigura-8pt5"],
                                    border: "1px solid " + asiguraPalette["asigura-6"],
                                    borderRadius: "4px",
                                    width: "20px",
                                    height: "20px"
                                }}
                                onClick={() => openReference(item.label)}
                            >
                                ↗
                            </button>
                            <button
                                style={{
                                    backgroundColor: asiguraPalette["asigura-8pt5"],
                                    border: "1px solid " + asiguraPalette["asigura-6"],
                                    borderRadius: "4px",
                                    width: "20px",
                                    height: "20px"
                                }}
                                onClick={() => removeReference(item.label)}
                            >
                                x
                            </button>
                        </div>
                    </div>
                ))
            }
            <NewReferenceModal
                isOpen={isNewReferenceModalOpen}
                onClose={onClose}
                onCreate={onCreate}
            />
        </div >
    );

}