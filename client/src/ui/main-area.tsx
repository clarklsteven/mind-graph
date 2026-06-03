import React from "react";
import type { Mode } from "../app";
import type { Layout } from "../core/layout/layout";
import type { Graph } from "../core/model/graph";
import type { GraphInterpretation } from "../core/model/graph-interpretation";
import type { GraphInteractionController } from "./interactions/graph-interaction-controller";
import ControlPanel from "./panels/control-panel";
import GraphCanvas from "./panels/graph-canvas";
import PropertiesPanel from "./panels/properties-panel";
import type { GraphRenderer } from "./renderers/graph-renderer";

type MainAreaProps = {
    name: string;
    mode: Mode;
    interpretation: GraphInterpretation | null;
    indicatorState: Record<string, boolean>;
    setIndicatorState: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
    setMode: (mode: Mode) => void;
    renderer: GraphRenderer;
    backgroundColor: string;
    layout: Layout;
    graph: Graph;
    graphVersion: number;
    setGraphVersion: (v: number) => void;
    selectedNodeId: string | null;
    setSelectedNodeId: (id: string | null) => void;
    selectedEdgeId: string | null;
    setSelectedEdgeId: (id: string | null) => void;
    interactionController: GraphInteractionController | undefined;
    onGraphChanged: () => void;
    onDeleteSelectedNode: () => void;
    onDeleteSelectedEdge: () => void;
};


export default function MainArea({
    name,
    mode,
    interpretation,
    indicatorState,
    setIndicatorState,
    setMode,
    renderer,
    backgroundColor,
    layout,
    graph,
    graphVersion,
    setGraphVersion,
    selectedNodeId,
    setSelectedNodeId,
    selectedEdgeId,
    setSelectedEdgeId,
    interactionController,
    onGraphChanged,
    onDeleteSelectedNode,
    onDeleteSelectedEdge
}: MainAreaProps) {
    const [addNodeType, setAddNodeType] = React.useState<string>("default");
    const [addEdgeType, setAddEdgeType] = React.useState<string>("default");

    return (
        <div className="main-area">
            <ControlPanel
                name={name}
                mode={mode}
                interpretation={interpretation}
                indicatorState={indicatorState}
                setIndicatorState={setIndicatorState}
                setMode={setMode}
                addNodeType={addNodeType}
                setAddNodeType={setAddNodeType}
                addEdgeType={addEdgeType}
                setAddEdgeType={setAddEdgeType}
            />
            <GraphCanvas
                renderer={renderer}
                backgroundColor={backgroundColor}
                layout={layout}
                graph={graph}
                graphVersion={graphVersion}
                mode={mode}
                interpretation={interpretation}
                indicatorState={indicatorState}
                setGraphVersion={setGraphVersion}
                selectedNodeId={selectedNodeId}
                setSelectedNodeId={setSelectedNodeId}
                selectedEdgeId={selectedEdgeId}
                setSelectedEdgeId={setSelectedEdgeId}
                interactionController={interactionController}
                addNodeType={addNodeType}
                addEdgeType={addEdgeType}
            />
            <PropertiesPanel
                graph={graph}
                interpretation={interpretation}
                selectedNodeId={selectedNodeId}
                selectedEdgeId={selectedEdgeId}
                onGraphChanged={onGraphChanged}
                onDeleteSelectedNode={onDeleteSelectedNode}
                onDeleteSelectedEdge={onDeleteSelectedEdge}
            />
        </div>
    );
}