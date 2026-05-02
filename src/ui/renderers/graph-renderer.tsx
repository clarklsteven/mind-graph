import { Layout } from "../../core/layout/layout";
import { Edge } from "../../core/model/edge";
import { Graph } from "../../core/model/graph";
import { GraphInterpretation } from "../../core/model/graph-interpretation";
import { GraphNode } from "../../core/model/node";
import { NodeDefinition } from "../../core/model/node-definition";
import { ColourPalette } from "../../core/model/palette";
import { GraphState } from "../graph-state";

export interface EdgeLabelPlacement {
    x: number;
    y: number;
    angle: number;
}

export class GraphRenderer {
    protected graph: Graph;
    protected layout: Layout;
    protected interpretation: GraphInterpretation;

    constructor(graph: Graph, layout: Layout, interpretation: GraphInterpretation) {
        this.graph = graph;
        this.layout = layout;
        this.interpretation = interpretation;
    }

    drawEdge(canvas: HTMLCanvasElement, graphState: GraphState, edge: Edge): void { }
    drawNode(canvas: HTMLCanvasElement, graphState: GraphState, node: GraphNode): void { }
    drawLabel(canvas: HTMLCanvasElement, graphState: GraphState, node: GraphNode): void { }
    drawPreviewEdge(canvas: HTMLCanvasElement, graphState: GraphState): void { }

    graphToScreen(graphState: GraphState, x: number, y: number) {
        return {
            x: x * graphState.view.scale + graphState.view.offsetX,
            y: y * graphState.view.scale + graphState.view.offsetY,
        };
    }

    screenToGraph(graphState: GraphState, x: number, y: number) {
        return {
            x: (x - graphState.view.offsetX) / graphState.view.scale,
            y: (y - graphState.view.offsetY) / graphState.view.scale,
        };
    }

    getEdgeLabelOpacity(scale: number): number {
        const fadeStart = 0.7;
        const fadeEnd = 1.1;

        if (scale <= fadeStart) return 0;
        if (scale >= fadeEnd) return 1;

        return (scale - fadeStart) / (fadeEnd - fadeStart);
    }

    getNodeLabelOpacity(scale: number): number {
        const fadeStart = 0.6;
        const fadeEnd = 0.8;

        if (scale <= fadeStart) return 0;
        if (scale >= fadeEnd) return 1;

        return (scale - fadeStart) / (fadeEnd - fadeStart);
    }

    getEdgeLabelPlacement(
        x1: number,
        y1: number,
        x2: number,
        y2: number,
        offset = 12
    ): EdgeLabelPlacement {
        const mx = (x1 + x2) / 2;
        const my = (y1 + y2) / 2;

        const dx = x2 - x1;
        const dy = y2 - y1;
        const length = Math.hypot(dx, dy);

        if (length === 0) {
            return { x: mx, y: my, angle: 0 };
        }

        const nx = -dy / length;
        const ny = dx / length;

        let angle = Math.atan2(dy, dx);

        if (angle > Math.PI / 2 || angle < -Math.PI / 2) {
            angle += Math.PI;
        }

        return {
            x: mx + nx * offset,
            y: my + ny * offset,
            angle,
        };
    }

    getRelationshipDefinition(edge: Edge) {
        if (!this.interpretation) return null;

        return this.interpretation.relationship_definitions.find(
            def => def.id === edge.type
        ) || null;
    };

    getNodeDefinition = (node: GraphNode) => {
        if (!this.interpretation) return null;
        if (!this.interpretation.node_definitions) return null;

        return this.interpretation.node_definitions.find(
            def => def.id === node.type
        ) || null;
    };

    getInterpretationColourPalette(node: GraphNode): ColourPalette {
        const nodeDef = this.getNodeDefinition(node);
        let defaultPalette: ColourPalette = {
            baseDark: "#888",
            baseLight: "#ccc",
            selected: "#f50b9b",
            hovered: "#60a5fa",
            linkStart: "#34d399"
        };
        if (!nodeDef) return defaultPalette;
        if (!this.interpretation || !this.interpretation.interpretation_palette) return defaultPalette;

        return this.interpretation.interpretation_palette.nodePalettes[nodeDef.id] || defaultPalette;
    };

    isNodeIncomplete(node: GraphNode, definition: NodeDefinition, indicatorState: Record<string, boolean>): boolean {
        if (!definition.completeness?.requiredFields) return false;

        return definition.completeness.requiredFields.some(field => {
            if (!node.properties) return false;
            if (indicatorState[field] === false || indicatorState[field] === undefined) return false; // if field is marked as complete in the state, skip it
            const value = node.properties[field];
            return value === null || value === undefined || value === "";
        });
    }

    protected getNodeById(nodeId: string): GraphNode | undefined {
        return this.graph.getNode(nodeId);
    }
};
