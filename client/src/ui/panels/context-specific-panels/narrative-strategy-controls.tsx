import { useState } from "react";
import { getButtonStyle } from "../../utils/styles";
import { asiguraPalette } from "../../utils/asigura-palette";
import {
    MousePointer, Plus
} from "lucide-react";
import type { Mode } from "../../../app";
import GoalNodePreview from "../../utils/node-previews";

type NarrativeStrategyControlsProps = {
    mode: string;
    setMode: (mode: Mode) => void;
    addNodeType: string;
    setAddNodeType: (type: string) => void;
    addEdgeType: string;
    setAddEdgeType: (type: string) => void;
};

const NarrativeStrategyNodes = {
    goal: {
        shape: 'circle',
        color: 'green'
    }
};

export default function NarrativeStrategyControls({
    mode,
    setMode,
    addNodeType,
    setAddNodeType,
    addEdgeType,
    setAddEdgeType
}: NarrativeStrategyControlsProps) {
    const [activeTab, setActiveTab] = useState('nodes');

    const nodeIconPreview = (type: string) => {
        switch (type) {
            case "goal":
                return <GoalNodePreview />;
            default:
                return null;
        }
    };

    function renderNodesTab() {
        console.log("NSC addEdgeType:", addEdgeType);
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
                            {nodeIconPreview(type)}
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
                    backgroundColor: mode === "add" ? asiguraPalette["asigura-5"] : asiguraPalette["asigura-7"],
                    color: mode === "add" ? asiguraPalette["asigura-10"] : asiguraPalette["asigura-3"],
                }}
                    onClick={() => setMode("add")}
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
                {activeTab === "links" && <div>Link styles coming soon...</div>}
            </div>
        </div>
    );
}