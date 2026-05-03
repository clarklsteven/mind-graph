import { Layout } from "../../core/layout/layout";
import { Colours } from "../../core/model/colours";
import { Edge } from "../../core/model/edge";
import { Graph } from "../../core/model/graph";
import { GraphInterpretation } from "../../core/model/graph-interpretation";
import { GraphNode } from "../../core/model/node";
import { GraphState } from "../graph-state";
import { GraphRenderer } from "./graph-renderer";
import { NodeIconLibrary } from "../../core/model/node-icon-library";

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

        const fromRadius = this.layout.getNodeRadius(fromNode.id) * graphState.view.scale;
        const toRadius = this.layout.getNodeRadius(toNode.id) * graphState.view.scale;

        const fromScreen = this.graphToScreen(graphState, fromNode.position.x, fromNode.position.y);
        const toScreen = this.graphToScreen(graphState, toNode.position.x, toNode.position.y);

        const dx = toScreen.x - fromScreen.x;
        const dy = toScreen.y - fromScreen.y;
        const length = Math.sqrt(dx * dx + dy * dy);

        if (length === 0) return;

        const ux = dx / length;
        const uy = dy / length;

        const startX = fromScreen.x + ux * fromRadius;
        const startY = fromScreen.y + uy * fromRadius;

        const endX = toScreen.x - ux * toRadius;
        const endY = toScreen.y - uy * toRadius;

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


        const paddingX = 16;
        const paddingY = 8;

        context.save();
        context.font = "12px sans-serif";
        context.textAlign = "center";
        context.textBaseline = "middle";

        const text = node.title || "Untitled";
        const textMetrics = context.measureText(text);

        const width = Math.max(80, textMetrics.width + paddingX * 2);
        const height = 32;

        const x = screen.x - width / 2;
        const y = screen.y - height / 2;
        const radius = height / 2;

        const nodeColour: string = Colours.getColourForNode(0, colourPalette);
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
};