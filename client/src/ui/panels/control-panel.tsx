import React from "react";
import type { Mode } from "../../app";
import type { GraphInterpretation } from "../../core/model/graph-interpretation";
import { getControlPanelStyle, getGraphTitleStyle } from "../utils/styles";
import ThinkingGraphControls from "./context-specific-panels/thinking-graph-controls";
import DefaultControls from "./context-specific-panels/defaualt-controls";
import NarrativeStrategyControls from "./context-specific-panels/narrative-strategy-controls";
import { asiguraPalette } from "../utils/asigura-palette";
import type { GraphLookupSet } from "../../core/model/graph-data";
import type { FocusSet } from "../main-area";
import FlexibleControls from "./context-specific-panels/flexible-controls";

export type ControlPanelProps = {
    name: string;
    graphLookupSets: GraphLookupSet[];
    mode: Mode;
    interpretation: GraphInterpretation | null;
    indicatorState: Record<string, boolean>;
    setIndicatorState: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
    setMode: (mode: Mode) => void;
    addNodeType: string;
    setAddNodeType: (type: string) => void;
    addEdgeType: string;
    setAddEdgeType: (type: string) => void;
    focusSet: FocusSet;
    setFocusSet: React.Dispatch<React.SetStateAction<FocusSet>>;
};

export default function ControlPanel({
    name,
    graphLookupSets,
    mode,
    interpretation,
    indicatorState,
    setIndicatorState,
    setMode,
    addNodeType,
    setAddNodeType,
    addEdgeType,
    setAddEdgeType,
    focusSet,
    setFocusSet
}: ControlPanelProps) {
    function contextSpecificControls(interpretationType: string | undefined): React.ReactNode {
        const schemaType = interpretation?.schema_type;
        if (schemaType === "flexible") {
            interpretationType = "flexible";
        }

        switch (interpretationType) {
            case "thinking-graph":
                return ThinkingGraphControls({
                    mode,
                    interpretation,
                    indicatorState,
                    setIndicatorState,
                    setMode,
                });
            case "mind-map-graph":
                return DefaultControls();
            case "narrative-strategy-graph":
                return NarrativeStrategyControls({
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
                });
            case "flexible":
                return FlexibleControls({
                    graphLookupSets,
                    mode,
                    setMode,
                    interpretation,
                    addNodeType,
                    setAddNodeType,
                    addEdgeType,
                    setAddEdgeType
                });
            default:
                return null;
        }
    }

    return (
        <aside
            style={{
                backgroundColor: asiguraPalette["asigura-8"],
                borderRight: "1px solid " + asiguraPalette["asigura-7"],
                padding: "16px",
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
                width: "220px",
                minWidth: "220px",
                gap: "12px",
            }}
            data-testid="control-panel"
        >
            <div style={getControlPanelStyle()}>
                <div
                    style={getGraphTitleStyle()}
                    data-testid="graph-name"
                >
                    {name || "Untitled Graph"}
                </div>
            </div>

            {contextSpecificControls(interpretation?.interpretation_type)}
        </aside >
    );
}