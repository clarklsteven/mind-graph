import React from "react";
import type { Mode } from "../../../app";
import type { GraphInterpretation } from "../../../core/model/graph-interpretation";
import { PanelSection, StretchyPanelSection } from "../panel-section";


type ThinkingGraphControlsProps = {
    mode: Mode;
    interpretation: GraphInterpretation | null;
    indicatorState: Record<string, boolean>;
    setIndicatorState: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
    setMode: (mode: Mode) => void;
};

export default function ThinkingGraphControls({
    mode,
    interpretation,
    indicatorState,
    setIndicatorState,
    setMode,
}: ThinkingGraphControlsProps) {
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
                <div className="indicator-list">
                    Missing Properties:
                    {[...requiredFields].map(field => (
                        <div className="indicator-item" key={field}>
                            <label className="indicator-option">
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

    const indicatorsSection: React.ReactNode = (
        <StretchyPanelSection title="Indicators">
            {indicatorComponents}
        </StretchyPanelSection>
    );

    const addNodes: React.ReactNode = (
        <button
            onClick={() => setMode("add")}
            className={`control-button${mode === "add" ? " control-button-active" : ""}`}
        >
            Add Node
        </button>
    );

    const linkNodes: React.ReactNode = (
        <button
            onClick={() => setMode("link")}
            className={`control-button${mode === "link" ? " control-button-active" : ""}`}
        >
            Link Nodes
        </button>
    );

    return (
        <div>
            <PanelSection>
                <button
                    onClick={() => setMode("select")}
                    className={`control-button${mode === "select" ? " control-button-active" : ""}`}
                >
                    Select
                </button>
                {addNodes}
                {linkNodes}
            </PanelSection>

            {indicatorsSection}
        </div>
    );
}