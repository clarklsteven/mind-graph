import { useEffect, useState } from "react";
import { GraphInterpretation } from "../../core/model/graph-interpretation";
import { Modal } from "./modal";
import { getPropertyInputStyle, getPropertyLabelStyle } from "../utils/styles";

type NewGraphModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (name: string, interpretationType: string) => void;
    interpretations: GraphInterpretation[];
};

export function NewGraphModal({
    isOpen,
    onClose,
    onCreate,
    interpretations,
}: NewGraphModalProps) {
    const [name, setName] = useState("Untitled Graph");
    const [interpretationType, setInterpretationType] = useState(
        interpretations[0]?.interpretation_type ?? "thinking-graph"
    );

    useEffect(() => {
        if (isOpen) {
            setName("Untitled Graph");
            setInterpretationType(
                interpretations[0]?.interpretation_type ?? "thinking-graph"
            );
        }
    }, [isOpen, interpretations]);

    return (
        <Modal isOpen={isOpen} title="Create New Graph" onClose={onClose}>
            <div>
                <div style={getPropertyLabelStyle()}>Graph Name</div>
                <input
                    type="text"
                    value={name}
                    style={getPropertyInputStyle()}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>

            <div>
                <div style={getPropertyLabelStyle()}>Interpretation</div>
                <select
                    value={interpretationType}
                    style={getPropertyInputStyle()}
                    onChange={(e) => setInterpretationType(e.target.value)}
                >
                    {interpretations.map((interpretation) => (
                        <option
                            key={interpretation.id}
                            value={interpretation.interpretation_type}
                        >
                            {interpretation.label}
                        </option>
                    ))}
                </select>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                <button onClick={onClose}>Cancel</button>
                <button
                    onClick={() => {
                        onCreate(name.trim() || "Untitled Graph", interpretationType);
                        onClose();
                    }}
                >
                    Create
                </button>
            </div>
        </Modal>
    );
}