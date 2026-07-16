import { useState } from "react";
import { getButtonStyle } from "../../utils/styles";
import { asiguraPalette } from "../../utils/asigura-palette";
import {
    MousePointer, Plus
} from "lucide-react";
import type { Mode } from "../../../app";
import type { GraphInterpretation } from "../../../core/model/graph-interpretation";
import { InterpretationPaletteManager } from "../../../core/model/palette";
import type { GraphLookupSet } from "../../../core/model/graph-data";

type CreationControlsProps = {
    graphLookupSets: GraphLookupSet[];
    mode: string;
    setMode: (mode: Mode) => void;
    interpretation: GraphInterpretation | null;
    addNodeType: string;
    setAddNodeType: (type: string) => void;
    addEdgeType: string;
    setAddEdgeType: (type: string) => void;
};

export default function CreationControls({
    mode,
    setMode,
    interpretation,
    addNodeType,
    setAddNodeType,
    addEdgeType,
    setAddEdgeType,
}: CreationControlsProps) {
    const [activeTab, setActiveTab] = useState('nodes');
    const nodeDefinitions = interpretation?.node_definitions;
    const relationshipDefinitions = interpretation?.relationship_definitions;
    let palette: InterpretationPaletteManager | null = null;
    if (interpretation && interpretation.interpretation_palette) {
        palette = new InterpretationPaletteManager(interpretation.interpretation_palette);
    }

    const edgeIconPreview = () => {
        return null;
    }

    function renderNodesTab() {
        return (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", width: "100%" }}>
                {nodeDefinitions!.map((nodeDefinition) => (
                    <div
                        key={nodeDefinition.id}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            backgroundColor: mode === "add" && nodeDefinition.id === addNodeType ? asiguraPalette["asigura-4"] : asiguraPalette["asigura-6"],
                            border: "1px solid " + asiguraPalette["asigura-3"],
                            padding: "0.5rem",
                            width: "100%",
                            boxSizing: "border-box",
                        }}
                        onClick={() => {
                            if (mode === "add") {
                                setAddNodeType(nodeDefinition.id);
                            }
                        }}
                    >
                        <div
                            style={{
                                width: "24px",
                                height: "24px",
                                backgroundColor: palette?.getColourPaletteForNodeType(nodeDefinition.id).baseLight,
                                borderRadius: "50%",
                                border: "2px solid " + asiguraPalette["asigura-1"],
                                flex: "0 0 auto",
                            }}
                        >
                        </div>
                        <span style={{ fontSize: "18px", color: asiguraPalette["asigura-1"] }}>
                            {nodeDefinition.label}
                        </span>
                    </div>
                ))}
            </div>
        );
    }

    function renderLinksTab() {
        return (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", width: "100%" }}>
                {relationshipDefinitions!.map((relationshipDefinition) => (
                    <div
                        key={relationshipDefinition.id}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            backgroundColor: mode === "link" && relationshipDefinition.id === addEdgeType ? asiguraPalette["asigura-4"] : asiguraPalette["asigura-6"],
                            border: "1px solid " + asiguraPalette["asigura-3"],
                            padding: "0.5rem",
                            width: "100%",
                            boxSizing: "border-box",
                        }}
                        onClick={() => {
                            if (mode === "link") {
                                setAddEdgeType(relationshipDefinition.id);
                            }
                        }}
                    >
                        <div
                            style={{
                                width: "36px",
                                height: "24px",
                                flex: "0 0 auto",
                            }}
                        >
                            {edgeIconPreview()}
                        </div>
                        <span style={{ fontSize: "18px", color: asiguraPalette["asigura-1"] }}>
                            {relationshipDefinition.label}
                        </span>
                    </div>
                ))}
            </div>
        );
    }

    function renderCreatePanel() {
        return (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{
                    display: 'flex',
                    gap: '1rem',
                    padding: "8px",
                    border: "1px solid " + asiguraPalette["asigura-7"],
                }}>
                    <button style={getButtonStyle(activeTab === 'nodes')} onClick={() => { setActiveTab('nodes'); setMode("select"); }}>
                        Nodes
                    </button>
                    <button style={getButtonStyle(activeTab === 'links')} onClick={() => { setActiveTab('links'); setMode("select"); }}>
                        Links
                    </button>
                </div>
                <div style={{
                    display: "flex",
                    flexDirection: "row",
                    border: "1px solid " + asiguraPalette["asigura-7"],
                    padding: "8px",
                    boxSizing: "border-box",
                    width: "100%",
                    gap: "8px",
                    justifyContent: "center",
                }}
                >
                    <button style={{
                        border: "1px solid " + asiguraPalette["asigura-7"],
                        borderRadius: "8px",
                        padding: "8px",
                        backgroundColor: mode === "select" ? asiguraPalette["asigura-5"] : asiguraPalette["asigura-7"],
                        color: mode === "select" ? asiguraPalette["asigura-10"] : asiguraPalette["asigura-3"],
                    }}
                        onClick={() => {
                            setMode("select")
                            setAddNodeType("");
                            setAddEdgeType("");
                        }}
                    >
                        <MousePointer size={16} />
                    </button>
                    <button style={{
                        border: "1px solid " + asiguraPalette["asigura-7"],
                        borderRadius: "8px",
                        padding: "8px",
                        backgroundColor: mode !== "select" ? asiguraPalette["asigura-5"] : asiguraPalette["asigura-7"],
                        color: mode !== "select" ? asiguraPalette["asigura-10"] : asiguraPalette["asigura-3"],
                    }}
                        onClick={() => {
                            if (activeTab === "links") {
                                setMode("link");
                            } else {
                                setMode("add");
                            }
                        }}
                    >
                        <Plus size={16} />
                    </button>
                </div>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        border: "1px solid " + asiguraPalette["asigura-7"],
                        padding: "8px",
                        boxSizing: "border-box",
                        width: "100%",
                    }}
                >
                    {activeTab === "nodes" && renderNodesTab()}
                    {activeTab === "links" && renderLinksTab()}
                </div>
            </div>
        );
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div style={{
                display: 'flex',
                gap: '1rem',
                padding: "8px",
                border: "1px solid " + asiguraPalette["asigura-7"],
            }}>
            </div>
            {renderCreatePanel()}
        </div>
    );
}