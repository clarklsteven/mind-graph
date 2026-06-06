import React from "react";
import type { Mode } from "../../app";
import type { GraphInterpretation } from "../../core/model/graph-interpretation";
import { getControlPanelStyle, getGraphTitleStyle } from "../utils/styles";
import ThinkingGraphControls from "./context-specific-panels/thinking-graph-controls";
import DefaultControls from "./context-specific-panels/defaualt-controls";
import NarrativeStrategyControls from "./context-specific-panels/narrative-strategy-controls";
import { asiguraPalette } from "../utils/asigura-palette";

export type ControlPanelProps = {
    name: string;
    mode: Mode;
    interpretation: GraphInterpretation | null;
    indicatorState: Record<string, boolean>;
    setIndicatorState: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
    setMode: (mode: Mode) => void;
    addNodeType: string;
    setAddNodeType: (type: string) => void;
    addEdgeType: string;
    setAddEdgeType: (type: string) => void;
};

export default function ControlPanel({
    name,
    mode,
    interpretation,
    indicatorState,
    setIndicatorState,
    setMode,
    addNodeType,
    setAddNodeType,
    addEdgeType,
    setAddEdgeType
}: ControlPanelProps) {
    function contextSpecificControls(interpretationType: string | undefined): React.ReactNode {
        switch (interpretationType) {
            case "thinking-graph":
                return ThinkingGraphControls({
                    mode,
                    interpretation,
                    indicatorState,
                    setIndicatorState,
                    setMode,
                });
                break;
            case "mind-map-graph":
                return DefaultControls();
                break;
            case "narrative-strategy-graph":
                return NarrativeStrategyControls({
                    mode,
                    setMode,
                    interpretation,
                    addNodeType,
                    setAddNodeType,
                    addEdgeType,
                    setAddEdgeType
                });
                break;
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
        >
            <div style={getControlPanelStyle()}>
                <div style={getGraphTitleStyle()}
                >
                    {name || "Untitled Graph"}
                </div>
            </div>

            {contextSpecificControls(interpretation?.interpretation_type)}
        </aside >
    );
}