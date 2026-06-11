import { useState } from "react";
import { getButtonStyle, getPropertyLabelStyle } from "../../utils/styles";
import { asiguraPalette } from "../../utils/asigura-palette";
import {
    MousePointer, Plus
} from "lucide-react";
import type { Mode } from "../../../app";
import NodePreviews from "./node-previews";
import EdgePreviews from "./edge-previews";
import type { GraphInterpretation, InterpretationOptionSet } from "../../../core/model/graph-interpretation";
import { InterpretationPaletteManager } from "../../../core/model/palette";
import type { GraphLookupSet } from "../../../core/model/graph-data";
import type { FocusSet } from "../../main-area";

type ControlView = "create" | "focus";

type NarrativeStrategyControlsProps = {
    graphLookupSets: GraphLookupSet[];
    mode: string;
    setMode: (mode: Mode) => void;
    interpretation: GraphInterpretation | null;
    addNodeType: string;
    setAddNodeType: (type: string) => void;
    addEdgeType: string;
    setAddEdgeType: (type: string) => void;
    focusSet: FocusSet;
    setFocusSet: React.Dispatch<React.SetStateAction<FocusSet>>;
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
    graphLookupSets,
    mode,
    setMode,
    interpretation,
    addNodeType,
    setAddNodeType,
    addEdgeType,
    setAddEdgeType,
    focusSet,
    setFocusSet
}: NarrativeStrategyControlsProps) {
    const [activeTab, setActiveTab] = useState('nodes');
    const [controlView, setControlView] = useState<ControlView>("create");


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

    function toggleFocusValue(
        category: string,
        value: string
    ): void {
        setFocusSet((current: FocusSet) => {
            const values = current[category] ?? [];

            return {
                ...current,
                [category]: values.includes(value)
                    ? values.filter(v => v !== value)
                    : [...values, value]
            };
        });
    }

    function isFocused(
        category: string,
        value: string
    ): boolean {
        const values = focusSet[category];

        if (!values) {
            return false;
        }

        return values.includes(value);
    }

    function renderProjectOptions() {
        const projects = graphLookupSets.filter((lookup: GraphLookupSet) => lookup.id === "project")[0].values;
        return (
            <div style={{ display: "flex", flexDirection: "column" }}>
                {projects.map((project: string) => (
                    <div key={project}>
                        <input
                            type="checkbox"
                            id={project}
                            name="project"
                            value={project}
                            style={{ accentColor: asiguraPalette["asigura-1"] }}
                            onClick={() => toggleFocusValue("project", project)}
                            checked={isFocused("project", project)}

                        />
                        <label htmlFor={project}>{project}</label>
                    </div>
                ))}
            </div>
        );
    }

    function renderStatusOptions() {
        const optionSet: InterpretationOptionSet | undefined = interpretation?.option_sets?.filter((lookup: InterpretationOptionSet) => lookup.id === "status")[0];
        const statuses: string[] = optionSet ? optionSet.values : [];
        return (
            <div style={{ display: "flex", flexDirection: "column" }}>
                {statuses.map((status: string) => (
                    <div key={status}>
                        <input
                            type="checkbox"
                            id={status}
                            name="status"
                            value={status}
                            style={{ accentColor: asiguraPalette["asigura-1"] }}
                            onClick={() => toggleFocusValue("status", status)}
                            checked={isFocused("status", status)}
                        />
                        <label htmlFor={status}>{status}</label>
                    </div>
                ))}
            </div>
        );
    }

    function renderDimensionOptions() {
        const optionSet: InterpretationOptionSet | undefined = interpretation?.option_sets?.filter((lookup: InterpretationOptionSet) => lookup.id === "dimension")[0];
        const dimensions: string[] = optionSet ? optionSet.values : [];
        return (
            <div style={{ display: "flex", flexDirection: "column" }}>
                {dimensions.map((dimension: string) => (
                    <div key={dimension}>
                        <input
                            type="checkbox"
                            id={dimension}
                            name="dimension"
                            value={dimension}
                            style={{ accentColor: asiguraPalette["asigura-1"] }}
                            onClick={() => toggleFocusValue("dimension", dimension)}
                            checked={isFocused("dimension", dimension)}
                        />
                        <label htmlFor={dimension}>{dimension}</label>
                    </div>
                ))}
            </div>
        );
    }

    function renderFocusControls() {
        return (
            <div>
                <div style={{
                    border: "1px solid " + asiguraPalette["asigura-7"],
                    display: "flex",
                    flexDirection: "column",
                    padding: "8px",
                    gap: "8px"
                }}>
                    <div style={{
                        border: "1px solid " + asiguraPalette["asigura-7"],
                        display: "flex",
                        flexDirection: "column",
                        padding: "4px"
                    }}>
                        <div style={getPropertyLabelStyle()}>
                            Project:
                        </div>
                        {renderProjectOptions()}
                    </div>
                    <div style={{
                        border: "1px solid " + asiguraPalette["asigura-7"],
                        display: "flex",
                        flexDirection: "column",
                        padding: "4px"
                    }}>
                        <div style={getPropertyLabelStyle()}>
                            Status:
                        </div>
                        {renderStatusOptions()}
                    </div>
                    <div style={{
                        border: "1px solid " + asiguraPalette["asigura-7"],
                        display: "flex",
                        flexDirection: "column",
                        padding: "4px"
                    }}>
                        <div style={getPropertyLabelStyle()}>
                            Dimension:
                        </div>
                        {renderDimensionOptions()}
                    </div>
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
                <button style={getButtonStyle(controlView === 'create')} onClick={() => setControlView('create')}>
                    Create
                </button>
                <button style={getButtonStyle(controlView === 'focus')} onClick={() => setControlView('focus')}>
                    Focus
                </button>
            </div>
            {controlView === "create" ? renderCreatePanel() : renderFocusControls()}
        </div>
    );
}