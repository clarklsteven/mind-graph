import { useEffect } from "react";
import { Mode } from "../app";
import { Graph } from "../core/model/graph";
import { GraphInterpretation } from "../core/model/graph-interpretation";
import { PanelSection, StretchyPanelSection } from "./panel-section";
import { getButtonStyle, getSecondaryButtonStyle, getHelpButtonStyle, getControlPanelStyle, getGraphTitleStyle, getHelpContainerStyle, getMindGraphTitleStyle } from "./styles";


type ControlPanelProps = {
    name: string;
    mode: Mode;
    interpretation: GraphInterpretation | null;
    indicatorState: Record<string, boolean>;
    setIndicatorState: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
    setMode: (mode: Mode) => void;
    onSave: () => void;
    onLoad: () => void;
    onCreate: () => void;
    onHelp: () => void;
};

export default function ControlPanel({
    name,
    mode,
    interpretation,
    indicatorState,
    setIndicatorState,
    setMode,
    onSave,
    onLoad,
    onCreate,
    onHelp,
}: ControlPanelProps) {
    function formatIndicatorName(field: string): string {
        // Convert snake_case or camelCase to Title Case for display
        const withSpaces = field
            .replace(/([a-z])([A-Z])/g, "$1 $2") // camelCase to words
            .replace(/_/g, " "); // snake_case to words

        return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1);
    }

    let indicatorComponents: React.ReactNode = (<div>No indicators</div>);
    if (interpretation?.node_definitions) {
        // Find all node definitions that have completeness requirements and collate their required fields
        const requiredFields = new Set<string>();
        interpretation.node_definitions.forEach(def => {
            def.completeness?.requiredFields.forEach(field => requiredFields.add(field));
        });

        if (requiredFields.size > 0) {
            indicatorComponents = (
                <div>
                    Missing Properties:
                    {[...requiredFields].map(field => (
                        <div key={field}>
                            <label key={field}>
                                <input
                                    type="checkbox"
                                    checked={indicatorState[field] ?? false}
                                    onChange={(e) => {
                                        setIndicatorState((prev) => ({
                                            ...prev,
                                            [field]: e.target.checked,
                                        }));
                                    }}
                                />
                                {formatIndicatorName(field)}
                            </label>
                        </div>
                    ))}
                </div>
            );
        }
    }

    return (
        <aside
            style={{
                backgroundColor: "rgb(245, 239, 217)",
                borderRight: "1px solid rgb(210, 205, 190)",
                padding: "16px",
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
                width: "220px",
                minWidth: "220px",
                gap: "12px",
                height: "100vh",
            }}
        >
            <div style={getControlPanelStyle()}>
                <div style={getMindGraphTitleStyle()}>
                    Mind Graph
                </div>
                <div style={getGraphTitleStyle()}
                >
                    {name || "Untitled Graph"}
                </div>
            </div>

            <PanelSection>
                <button
                    onClick={() => setMode("select")}
                    style={getButtonStyle(mode === "select")}
                >
                    Select
                </button>

                <button
                    onClick={() => setMode("add")}
                    style={getButtonStyle(mode === "add")}
                >
                    Add Node
                </button>

                <button
                    onClick={() => setMode("link")}
                    style={getButtonStyle(mode === "link")}
                >
                    Link Nodes
                </button>
            </PanelSection>

            <StretchyPanelSection title="Indicators">
                {indicatorComponents}
            </StretchyPanelSection>
            <PanelSection>
                <button onClick={onCreate} style={getSecondaryButtonStyle()}>
                    New Graph
                </button>
                <button onClick={onLoad} style={getSecondaryButtonStyle()}>
                    Load Graph
                </button>

                <button onClick={onSave} style={getSecondaryButtonStyle()}>
                    Save Graph
                </button>
            </PanelSection>
            <div style={getHelpContainerStyle()}>
                <button
                    disabled={!name}
                    onClick={onHelp}
                    style={getHelpButtonStyle(!name)}
                    title={name ? "Show interpretation help" : "No graph loaded"}
                >
                    <span style={{ transform: "translateY(1px)" }}>?</span>
                </button>
            </div>
        </aside>
    );
}