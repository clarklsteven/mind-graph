import { useState } from "react";
import { Modal } from "./modal";
import { getButtonStyle, getPropertyInputStyle, getPropertyLabelStyle } from "../utils/styles";
import { asiguraPalette } from "../utils/asigura-palette";

type CreateFlexibleSchemaModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (schemaName: string) => void;
};

export default function CreateFlexibleSchemaModal({ isOpen, onClose, onCreate }: CreateFlexibleSchemaModalProps) {
    const [schemaName, setSchemaName] = useState("");

    const handleCreate = () => {
        if (schemaName.trim() !== "") {
            onCreate(schemaName);
            onClose();
        }
    };

    return (
        <Modal isOpen={isOpen} title="Create Flexible Schema" onClose={onClose} width="1200px">
            <div
                style={{ display: "flex", flexDirection: "row", gap: "8px" }}
            >
                <div style={getPropertyLabelStyle()}>Schema Name</div>
                <input
                    id="schemaName"
                    type="text"
                    value={schemaName}
                    onChange={(e) => setSchemaName(e.target.value)}
                    style={getPropertyInputStyle()}
                />
            </div>
            <div style={{
                display: "flex",
                flexDirection: "row",
                gap: "4px",
                marginTop: "12px",
                border: "1px solid " + asiguraPalette["asigura-6"],
                borderRadius: "6px",
                padding: "6px",
                minHeight: "400px",
                minWidth: "600px",
                backgroundColor: asiguraPalette["asigura-10"],
            }}
            >
                <div
                    style={{
                        flex: 0.25,
                        border: "1px solid " + asiguraPalette["asigura-6"],
                        borderRadius: "4px",
                        padding: "6px",
                        backgroundColor: asiguraPalette["asigura-10"],
                        display: "flex",
                        flexDirection: "column",
                        gap: "4px",
                    }}
                >
                    <span style={getPropertyLabelStyle()}>Building Blocks</span>
                    <div
                        style={{
                            flex: 1,
                            border: "1px solid " + asiguraPalette["asigura-6"],
                            borderRadius: "4px",
                            padding: "6px",
                            backgroundColor: asiguraPalette["asigura-9"],
                            display: "flex",
                            flexDirection: "column",
                            gap: "4px",
                        }}
                    >
                        <span style={getPropertyLabelStyle()}>Collections</span>
                        <div style={{
                            flex: 1,
                            border: "1px solid " + asiguraPalette["asigura-6"],
                            borderRadius: "4px",
                            padding: "6px",
                            backgroundColor: asiguraPalette["asigura-8pt5"],
                            display: "flex",
                            flexDirection: "column",
                            gap: "4px",
                            minHeight: "150px",
                        }}>Collection list</div>
                    </div>
                    <div
                        style={{
                            flex: 1,
                            border: "1px solid " + asiguraPalette["asigura-6"],
                            borderRadius: "4px",
                            padding: "6px",
                            backgroundColor: asiguraPalette["asigura-9"],
                        }}
                    >
                        <div
                            style={{
                                flex: 1,
                                borderRadius: "4px",
                                padding: "6px",
                                backgroundColor: asiguraPalette["asigura-9"],
                                display: "flex",
                                flexDirection: "row",
                                gap: "4px",
                            }}
                        >
                            <button
                                style={getButtonStyle(true)}>Nodes</button>
                            <button style={getButtonStyle(false)}>Edges</button>
                        </div>
                        <div style={{
                            flex: 1,
                            border: "1px solid " + asiguraPalette["asigura-6"],
                            borderRadius: "4px",
                            padding: "6px",
                            backgroundColor: asiguraPalette["asigura-8pt5"],
                            display: "flex",
                            flexDirection: "column",
                            gap: "4px",
                            minHeight: "200px",
                        }}>Node/Edge list</div>

                    </div>
                </div>
                <div
                    style={{
                        flex: 1,
                        border: "1px solid " + asiguraPalette["asigura-6"],
                        borderRadius: "4px",
                        padding: "6px",
                        backgroundColor: asiguraPalette["asigura-10"],
                        display: "flex",
                        flexDirection: "column",
                        gap: "4px",
                    }}
                >
                    <span style={getPropertyLabelStyle()}>New Schema</span>
                    <div
                        style={{
                            flex: 1,
                            border: "1px solid " + asiguraPalette["asigura-6"],
                            borderRadius: "4px",
                            padding: "6px",
                            backgroundColor: asiguraPalette["asigura-9"],
                            display: "flex",
                            flexDirection: "column",
                            gap: "4px",
                        }}
                    >
                        <span style={getPropertyLabelStyle()}>Nodes</span>
                        <div style={{
                            flex: 1,
                            border: "1px solid " + asiguraPalette["asigura-6"],
                            borderRadius: "4px",
                            padding: "6px",
                            backgroundColor: asiguraPalette["asigura-8pt5"],
                            display: "flex",
                            flexDirection: "column",
                            gap: "4px",
                        }}>Node list</div>
                    </div>
                    <div
                        style={{
                            flex: 0.5,
                            border: "1px solid " + asiguraPalette["asigura-6"],
                            borderRadius: "4px",
                            padding: "6px",
                            backgroundColor: asiguraPalette["asigura-9"],
                            display: "flex",
                            flexDirection: "column",
                            gap: "4px",
                        }}
                    >
                        <span style={getPropertyLabelStyle()}>Edges</span>
                        <div style={{
                            flex: 1,
                            border: "1px solid " + asiguraPalette["asigura-6"],
                            borderRadius: "4px",
                            padding: "6px",
                            backgroundColor: asiguraPalette["asigura-8pt5"],
                            display: "flex",
                            flexDirection: "column",
                            gap: "4px",
                        }}>Edge list</div>
                    </div>
                </div>
                <div
                    style={{
                        flex: 0.4,
                        border: "1px solid " + asiguraPalette["asigura-6"],
                        borderRadius: "4px",
                        padding: "6px",
                        backgroundColor: asiguraPalette["asigura-10"],
                        display: "flex",
                        flexDirection: "column",
                        gap: "4px",
                    }}
                >
                    <span style={getPropertyLabelStyle()}>Properties</span>
                    <div style={{
                        flex: 1,
                        border: "1px solid " + asiguraPalette["asigura-6"],
                        borderRadius: "4px",
                        padding: "6px",
                        backgroundColor: asiguraPalette["asigura-9"],
                        display: "flex",
                        flexDirection: "column",
                        gap: "4px",
                    }}>Property list</div>
                </div>
            </div>
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "flex-end", gap: "8px", marginTop: "12px" }}>
                <button
                    onClick={onClose}
                    style={{
                        padding: "6px 12px",
                        backgroundColor: "#e0d8c8",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer"
                    }}
                >Cancel</button>
                <button
                    onClick={handleCreate}
                    style={{
                        padding: "6px 12px",
                        backgroundColor: "#00332a",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer"
                    }}
                >Create</button>
            </div>
        </Modal>
    );
}