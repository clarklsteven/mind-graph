import { Layout } from "../../core/layout/layout";
import { Colours } from "../../core/model/colours";
import { Edge } from "../../core/model/edge";
import { Graph } from "../../core/model/graph";
import { GraphInterpretation } from "../../core/model/graph-interpretation";
import { GraphNode } from "../../core/model/node";
import { GraphState } from "../graph-state";
import { GraphRenderer } from "./graph-renderer";
import { NodeIconLibrary } from "../../core/model/node-icon-library";

export class DefaultRenderer extends GraphRenderer {

    constructor(graph: Graph, layout: Layout, interpretation: GraphInterpretation) {
        super(graph, layout, interpretation);
    }

    protected getNodeById(nodeId: string): GraphNode | undefined {
        return this.graph.getNode(nodeId);
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

        const isSelected = edge.id === graphState.selectedEdgeId;
        const isDirectional = this.getRelationshipDefinition(edge)?.directed ?? false;
        const isDefaultEdgeType = this.getRelationshipDefinition(edge)?.isDefault ?? false;

        context.beginPath();
        context.moveTo(startX, startY);
        context.lineTo(endX, endY);
        context.strokeStyle = isSelected
            ? "rgb(101, 26, 44)"
            : isDefaultEdgeType
                ? "rgb(246, 7, 7)"
                : "rgb(200, 200, 200)";
        context.lineWidth = isSelected ? 4 : 2;
        context.stroke();

        if (isDirectional) {
            let arrowLength = 10;
            let arrowWidth = 5;
            // Make the arrows smaller as we zoom out, so they don't dominate the graph
            if (graphState.view.scale < 1) {
                arrowLength = Math.ceil(arrowLength * graphState.view.scale);
                arrowWidth = Math.ceil(arrowWidth * graphState.view.scale);
            }

            const px = -uy;
            const py = ux;

            const baseX = endX - ux * arrowLength;
            const baseY = endY - uy * arrowLength;

            const leftX = baseX + px * arrowWidth;
            const leftY = baseY + py * arrowWidth;

            const rightX = baseX - px * arrowWidth;
            const rightY = baseY - py * arrowWidth;

            context.beginPath();
            context.moveTo(endX, endY);
            context.lineTo(leftX, leftY);
            context.lineTo(rightX, rightY);
            context.closePath();
            context.fillStyle = isSelected
                ? "rgb(101, 26, 44)"
                : isDefaultEdgeType
                    ? "rgb(246, 7, 7)"
                    : "rgb(200, 200, 200)";
            context.fill();
        }

        const labelOpacity = this.getEdgeLabelOpacity(graphState.view.scale);

        if (labelOpacity <= 0.05) {
            return;
        }
        const label = this.getRelationshipDefinition(edge)?.label ?? edge.type;
        const { x, y, angle } = this.getEdgeLabelPlacement(fromScreen.x, fromScreen.y, toScreen.x, toScreen.y, 12);

        context.save();
        context.font = "12px sans-serif";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.translate(x, y);
        context.rotate(angle);

        // optional background so text is readable
        const metrics = context.measureText(label);
        const paddingX = 4;
        const paddingY = 2;
        const boxWidth = metrics.width + paddingX * 2;
        const boxHeight = 16;

        context.fillStyle = "rgba(128, 128, 128, 0.0)";
        context.fillRect(x - boxWidth / 2, y - boxHeight / 2, boxWidth, boxHeight);

        context.globalAlpha = labelOpacity;
        context.fillStyle = "#88af94";
        context.fillText(label, 0, 0);
        context.globalAlpha = 1.0;
        context.restore();
    }

    drawNode(canvas: HTMLCanvasElement, graphState: GraphState, node: GraphNode): void {
        if (!canvas) return;

        const context = canvas.getContext("2d");
        if (!context) return;
        const isSelected = node.id === graphState.selectedNodeId;
        const isBeingDragged = graphState.drag?.nodeId === node.id;
        const isHovered = node.id === graphState.hoveredNodeId;
        const isLinkStart = node.id === graphState.linkStartNodeId;
        const radius = this.layout.getNodeRadius(node.id);
        const isDefaultNodeType = this.getNodeDefinition(node)?.isDefault ?? false;
        const colourPalette = this.getInterpretationColourPalette(node);

        context.beginPath();
        const screen = this.graphToScreen(graphState, node.position.x, node.position.y);
        context.arc(screen.x, screen.y, radius * graphState.view.scale, 0, Math.PI * 2);

        context.fillStyle = isBeingDragged
            ? colourPalette.baseDark : isLinkStart
                ? colourPalette.linkStart : isSelected
                    ? colourPalette.selected
                    : isHovered
                        ? colourPalette.hovered : isDefaultNodeType
                            ? "#f87171" : Colours.getColourForNode((node.weight - 1) / 10, colourPalette);

        context.fill();

        const nodeDefinition = this.getNodeDefinition(node);

        const iconId = nodeDefinition?.iconId;
        const icon = iconId ? NodeIconLibrary.getIcon(iconId) : null;

        if (icon) {
            this.drawNodeIcon(context, Math.floor(screen.x), Math.floor(screen.y), radius * graphState.view.scale, icon);
        }

        if (isSelected) {
            context.lineWidth = 2;
            context.strokeStyle = "#000";
            context.stroke();
        }

        // Incomplete indicator - a small red dot to the top-left of the node
        if (nodeDefinition && this.isNodeIncomplete(node, nodeDefinition, graphState.indicatorState)) {
            context.beginPath();
            const dotX = screen.x - 1.5 * radius * graphState.view.scale * 0.6;
            const dotY = screen.y - 1.5 * radius * graphState.view.scale * 0.6;
            context.arc(dotX, dotY, radius * graphState.view.scale * 0.2, 0, Math.PI * 2);
            context.fillStyle = "rgba(255, 0, 0, 0.6)";
            context.fill();
        }
    }

    drawLabel(canvas: HTMLCanvasElement, graphState: GraphState, node: GraphNode): void {
        if (!canvas) return;

        const context = canvas.getContext("2d");
        if (!context) return;
        const radius = this.layout.getNodeRadius(node.id);
        const padding = 4;
        //        const padding = 4 * graphState.view.scale;
        const offsetX = (radius + padding) * graphState.view.scale;
        const offsetY = (radius + padding) * graphState.view.scale;

        context.font = "12px sans-serif";

        const textWidth = context.measureText(node.title).width;
        const textHeight = 12;

        const screen = this.graphToScreen(graphState, node.position.x, node.position.y);
        const x = Math.floor(screen.x + offsetX);
        const y = Math.floor(screen.y - offsetY);

        // Background
        context.fillStyle = "rgba(255, 250, 231, 0.0)";
        context.fillRect(
            x - padding,
            y - textHeight,
            textWidth + padding * 2,
            textHeight + padding * 2
        );

        // Text
        let labelOpacity = this.getNodeLabelOpacity(graphState.view.scale);

        if (labelOpacity <= 0.05) {
            return;
        }
        context.globalAlpha = labelOpacity;
        context.fillStyle = "#651A2C";
        context.fillText(node.title, x, y);
        context.globalAlpha = 1.0;
    }

    drawNodeIcon(
        context: CanvasRenderingContext2D,
        x: number,
        y: number,
        radius: number,
        icon: string
    ) {
        context.save();

        context.fillStyle = "#ffffff";
        context.font = `${Math.max(12, radius * 0.9)}px sans-serif`;
        context.textAlign = "center";
        context.textBaseline = "middle";

        context.fillText(icon, x, y);

        context.restore();
    }

    drawPreviewEdge(canvas: HTMLCanvasElement, graphState: GraphState): void {
        if (graphState.mode !== "link") return;
        if (!graphState.linkStartNodeId) return;
        if (!graphState.hoveredNodeId) return;
        if (graphState.linkStartNodeId === graphState.hoveredNodeId) return;

        if (!canvas) return;

        const context = canvas.getContext("2d");
        if (!context) return;

        const fromNode = this.graph.getNode(graphState.linkStartNodeId);
        const toNode = this.graph.getNode(graphState.hoveredNodeId);

        if (!fromNode || !toNode) return;

        const fromScreen = this.graphToScreen(graphState, fromNode.position.x, fromNode.position.y);
        const toScreen = this.graphToScreen(graphState, toNode.position.x, toNode.position.y);

        const edgeExists = this.graph.getEdges().some(
            (edge) =>
                (edge.from === graphState.linkStartNodeId && edge.to === graphState.hoveredNodeId) ||
                (edge.from === graphState.hoveredNodeId && edge.to === graphState.linkStartNodeId)
        );

        if (edgeExists) return;

        context.beginPath();
        context.moveTo(fromScreen.x, fromScreen.y);
        context.lineTo(toScreen.x, toScreen.y);
        context.strokeStyle = "rgba(141, 66, 84, 0.45)";
        context.lineWidth = 2;
        context.stroke();
    };

};