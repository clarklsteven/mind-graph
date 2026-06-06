import { useState } from "react";
import { getButtonStyle } from "../../utils/styles";
import { asiguraPalette } from "../../utils/asigura-palette";
import {
    MousePointer, Plus
} from "lucide-react";
import type { Mode } from "../../../app";
import NodePreviews from "./node-previews";
import EdgePreviews from "./edge-previews";
import type { GraphInterpretation } from "../../../core/model/graph-interpretation";
import { InterpretationPaletteManager } from "../../../core/model/palette";

type NarrativeStrategyControlsProps = {
    mode: string;
    setMode: (mode: Mode) => void;
    interpretation: GraphInterpretation | null;
    addNodeType: string;
    setAddNodeType: (type: string) => void;
    addEdgeType: string;
    setAddEdgeType: (type: string) => void;
};

const NarrativeStrategyNodes = {
    goal: {
        shape: 'circle',
        color: 'green'
    },
    mission: {
        shape: 'circle',
        color: 'blue'
    },
    objective: {
        shape: 'circle',
        color: 'purple'
    },
    action: {
        shape: 'circle',
        color: 'red'
    }
};

const NarrativeStrategyLinks = {
    leads_to: {
        shape: 'line',
        color: 'blue'
    },
};

export default function NarrativeStrategyControls({
    mode,
    setMode,
    interpretation,
    addNodeType,
    setAddNodeType,
    addEdgeType,
    setAddEdgeType
}: NarrativeStrategyControlsProps) {
    const [activeTab, setActiveTab] = useState('nodes');

    let palette: InterpretationPaletteManager | null = null;
    if (interpretation && interpretation.interpretation_palette) {
        palette = new InterpretationPaletteManager(interpretation.interpretation_palette);
    }

    const nodeIconPreview = (type: string, colour: string) => {
        switch (type) {
            case "goal":
                return <NodePreviews
                    nodeType={"goal"}
                    colour={palette?.getColourPaletteForNodeType("goal").baseLight || colour} />;
            case "mission":
                return <NodePreviews
                    nodeType={"mission"}
                    colour={palette?.getColourPaletteForNodeType("mission").baseLight || colour} />;
            case "objective":
                return <NodePreviews
                    nodeType={"objective"}
                    colour={palette?.getColourPaletteForNodeType("objective").baseLight || colour} />;
            case "action":
                return <NodePreviews
                    nodeType={"action"}
                    colour={palette?.getColourPaletteForNodeType("action").baseLight || colour} />;
            default:
                return null;
        }
    };

    const edgeIconPreview = (type: string) => {
        switch (type) {
            case "leads_to":
                return <EdgePreviews
                    edgeType={"leads_to"} />;
            default:
                return null;
        }
    }

    function renderNodesTab() {
        return (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", width: "100%" }}>
                {Object.entries(NarrativeStrategyNodes).map(([type, style]) => (
                    <div
                        key={type}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            backgroundColor: mode === "add" && type === addNodeType ? asiguraPalette["asigura-4"] : asiguraPalette["asigura-6"],
                            border: "1px solid " + asiguraPalette["asigura-3"],
                            padding: "0.5rem",
                            width: "100%",
                            boxSizing: "border-box",
                        }}
                        onClick={() => {
                            if (mode === "add") {
                                setAddNodeType(type);
                            }
                        }}
                    >
                        <div
                            style={{
                                width: "24px",
                                height: "24px",
                                backgroundColor: style.color,
                                borderRadius: style.shape === "circle" ? "50%" : "0",
                                border: "2px solid " + asiguraPalette["asigura-1"],
                                flex: "0 0 auto",
                            }}
                        >
                            {nodeIconPreview(type, style.color.toString())}
                        </div>
                        <span style={{ fontSize: "18px", color: asiguraPalette["asigura-1"] }}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                        </span>
                    </div>
                ))}
            </div>
        );
    }

    function renderLinksTab() {
        return (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", width: "100%" }}>
                {Object.entries(NarrativeStrategyLinks).map(([type]) => (
                    <div
                        key={type}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            backgroundColor: mode === "link" && type === addEdgeType ? asiguraPalette["asigura-4"] : asiguraPalette["asigura-6"],
                            border: "1px solid " + asiguraPalette["asigura-3"],
                            padding: "0.5rem",
                            width: "100%",
                            boxSizing: "border-box",
                        }}
                        onClick={() => {
                            if (mode === "link") {
                                setAddEdgeType(type);
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
                            {edgeIconPreview(type)}
                        </div>
                        <span style={{ fontSize: "18px", color: asiguraPalette["asigura-1"] }}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                        </span>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div>
            <div style={{ display: 'flex', gap: '1rem' }}>
                <button style={getButtonStyle(activeTab === 'nodes')} onClick={() => setActiveTab('nodes')}>
                    Nodes
                </button>
                <button style={getButtonStyle(activeTab === 'links')} onClick={() => setActiveTab('links')}>
                    Links
                </button>
            </div>
            <div style={{
                display: "flex",
                flexDirection: "row",
                border: "1px solid " + asiguraPalette["asigura-7"],
                padding: "8px", marginTop: "8px",
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
                    marginTop: "8px",
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