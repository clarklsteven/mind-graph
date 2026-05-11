import { Layout } from "../../core/layout/layout";
import { Colours } from "../../core/model/colours";
import { Edge } from "../../core/model/edge";
import { Graph } from "../../core/model/graph";
import { GraphInterpretation } from "../../core/model/graph-interpretation";
import { GraphNode } from "../../core/model/node";
import { Point } from "../../core/model/point";
import { GraphState } from "../graph-state";
import { GraphRenderer } from "./graph-renderer";

export class MindMapRenderer extends GraphRenderer {

    constructor(graph: Graph, layout: Layout, interpretation: GraphInterpretation) {
        super(graph, layout, interpretation);
    }

    drawEdge(canvas: HTMLCanvasElement, graphState: GraphState, edge: Edge): void {
        if (!canvas) return;

        const context = canvas.getContext("2d");
        if (!context) return;

        const fromNode = this.getNodeById(edge.from);
        const toNode = this.getNodeById(edge.to);

        if (!fromNode || !toNode) return;

        const fromScreen = this.graphToScreen(graphState, fromNode.position.x, fromNode.position.y);
        const toScreen = this.graphToScreen(graphState, toNode.position.x, toNode.position.y);

        const dx = toScreen.x - fromScreen.x;
        const dy = toScreen.y - fromScreen.y;
        const length = Math.sqrt(dx * dx + dy * dy);

        if (length === 0) return;

        const ux = dx / length;
        const uy = dy / length;

        const startX = fromScreen.x + ux;
        const startY = fromScreen.y + uy;

        const endX = toScreen.x - ux;
        const endY = toScreen.y - uy;

        context.beginPath();
        context.moveTo(startX, startY);
        context.lineTo(endX, endY);
        context.strokeStyle = "rgb(200, 200, 200)";
        context.lineWidth = 2;
        context.stroke();
    }

    drawNode(canvas: HTMLCanvasElement, graphState: GraphState, node: GraphNode): void {

        const context = canvas.getContext("2d");
        if (!context) return;
        const screen = this.graphToScreen(graphState, node.position.x, node.position.y);
        const colourPalette = this.getInterpretationColourPalette(node);
        const isSelected = node.id === graphState.selectedNodeId;
        const isHovered = node.id === graphState.hoveredNodeId;

        const paddingX = 16;
        const paddingY = 8;

        context.save();
        const text = node.title || "Untitled";
        const weightFactor = 1 + Math.log10(Math.sqrt(node.weight)) / 3;
        const baseFontSize = 12 * weightFactor;
        context.font = `${baseFontSize}px sans-serif`;
        const baseTextMetrics = context.measureText(text);
        const baseWidth = Math.max(80, baseTextMetrics.width + paddingX * 2) * weightFactor;
        const baseHeight = 32 * weightFactor;

        const fontSize = 12 * graphState.view.scale * weightFactor;
        context.font = `${fontSize}px sans-serif`;
        context.textAlign = "center";
        context.textBaseline = "middle";

        const textMetrics = context.measureText(text);

        const width = Math.max(80, textMetrics.width + paddingX * 2) * graphState.view.scale * weightFactor;
        const height = 32 * graphState.view.scale * weightFactor;

        const x = screen.x - width / 2;
        const y = screen.y - height / 2;
        const radius = height / 2;

        const nodeColour: string = isSelected ? colourPalette.selected
            : isHovered ? colourPalette.hovered :
                Colours.getColourForNode(0, colourPalette);
        const borderColour: string = Colours.getColourForNode(1, colourPalette);
        context.beginPath();
        context.roundRect(x, y, width, height, radius);

        context.fillStyle = nodeColour;
        context.fill();

        context.lineWidth = 2;
        context.strokeStyle = borderColour;
        context.stroke();

        context.fillStyle = "#FFFFFF";
        context.fillText(text, screen.x, screen.y);

        context.restore();
    }

    hitTestNode(point: Point): GraphNode | null {
        const nodes = this.graph.getNodes();
        for (let i = nodes.length - 1; i >= 0; i--) {
            const node = nodes[i];
            const x = point.x;
            const y = point.y;

            const left = node.position.x - node.size.width / 2;
            const right = node.position.x + node.size.width / 2;
            const top = node.position.y - node.size.height / 2;
            const bottom = node.position.y + node.size.height / 2;

            if ((x > left && x < right) && (y > top && y < bottom)) {
                return node;
            }
        }

        return null;
    }
};