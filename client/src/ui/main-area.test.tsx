import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import MainArea from "./main-area";
import type { ControlPanelProps } from "./panels/control-panel";
import type { GraphCanvasProps } from "./panels/graph-canvas";
import type { PropertiesPanelProps } from "./panels/properties-panel";
import type { GraphRenderer } from "./renderers/graph-renderer";
import type { Layout } from "../core/layout/layout";
import { Graph } from "../core/model/graph";

vi.mock("./panels/control-panel", () => ({
    default: ({ name, mode, addNodeType, addEdgeType }: ControlPanelProps) => (
        <div data-testid="control-panel" data-name={name} data-mode={mode} data-add-node-type={addNodeType} data-add-edge-type={addEdgeType} />
    )
}));

vi.mock("./panels/graph-canvas", () => ({
    default: ({ graphVersion, mode, selectedNodeId }: GraphCanvasProps) => (
        <div data-testid="graph-canvas" data-graph-version={graphVersion} data-mode={mode} data-selected-node-id={selectedNodeId} />
    )
}));

vi.mock("./panels/properties-panel", () => ({
    default: ({ selectedNodeId, selectedEdgeId }: PropertiesPanelProps) => (
        <div data-testid="properties-panel" data-selected-node-id={selectedNodeId} data-selected-edge-id={selectedEdgeId} />
    )
}));

describe("MainArea", () => {
    it("renders child panels and forwards key props", () => {
        const setIndicatorState = vi.fn();
        const setMode = vi.fn();
        const setGraphVersion = vi.fn();
        const setSelectedNodeId = vi.fn();
        const setSelectedEdgeId = vi.fn();
        const graph: Graph = new Graph();

        render(
            <MainArea
                name="Test Graph"
                mode="select"
                interpretation={null}
                indicatorState={{}}
                setIndicatorState={setIndicatorState}
                setMode={setMode}
                renderer={{} as GraphRenderer}
                backgroundColor="#fff"
                layout={{} as Layout}
                graph={graph}
                graphVersion={1}
                setGraphVersion={setGraphVersion}
                selectedNodeId="node-1"
                setSelectedNodeId={setSelectedNodeId}
                selectedEdgeId="edge-1"
                setSelectedEdgeId={setSelectedEdgeId}
                interactionController={undefined}
                onGraphChanged={vi.fn()}
                onDeleteSelectedNode={vi.fn()}
                onDeleteSelectedEdge={vi.fn()}
            />
        );

        expect(screen.getByTestId("control-panel")).toBeInTheDocument();
        expect(screen.getByTestId("control-panel")).toHaveAttribute("data-name", "Test Graph");
        expect(screen.getByTestId("control-panel")).toHaveAttribute("data-mode", "select");
        expect(screen.getByTestId("graph-canvas")).toBeInTheDocument();
        expect(screen.getByTestId("graph-canvas")).toHaveAttribute("data-graph-version", "1");
        expect(screen.getByTestId("properties-panel")).toBeInTheDocument();
        expect(screen.getByTestId("properties-panel")).toHaveAttribute("data-selected-node-id", "node-1");
        expect(screen.getByTestId("properties-panel")).toHaveAttribute("data-selected-edge-id", "edge-1");
    });
});
