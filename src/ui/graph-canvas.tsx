import { useEffect, useRef, useState } from "react";
import { Colours } from "../core/model/colours";
import { Graph } from "../core/model/graph";
import { Layout } from "../core/layout/layout";
import { Edge } from "../core/model/edge";
import { GraphNode } from "../core/model/node";
import { Mode } from "../app";

type DragState = {
    nodeId: string;
    offsetX: number;
    offsetY: number;
} | null;

type Props = {
    backgroundColor: string;
    layout: Layout;
    graph: Graph;
    mode: Mode;
    graphVersion: number;
    selectedNodeId: string | null;
    setSelectedNodeId: (id: string | null) => void;
    selectedEdgeId: string | null;
    setSelectedEdgeId: (id: string | null) => void;
};

type ViewTransform = {
    offsetX: number;
    offsetY: number;
    scale: number;
};

type PanState = {
    startX: number;
    startY: number;
    startOffsetX: number;
    startOffsetY: number;
} | null;

type CanvasPointerLikeEvent = {
    clientX: number;
    clientY: number;
};

export default function GraphCanvas({ backgroundColor, layout, graph, mode, graphVersion,
    selectedNodeId, setSelectedNodeId, selectedEdgeId, setSelectedEdgeId }: Props) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const dragStateRef = useRef<DragState>(null);
    const viewRef = useRef<ViewTransform>({ offsetX: 0, offsetY: 0, scale: 1 });
    const animationFrameRef = useRef<number | null>(null);
    const isSimulatingRef = useRef(false);
    const panStateRef = useRef<PanState>(null);

    const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
    const [linkStartNodeId, setLinkStartNodeId] = useState<string | null>(null);

    const getNodeHitRadius = (nodeId: string): number => {
        return Math.max(layout.getNodeRadius(nodeId), 10);
    };

    function runSimulation() {
        stopSimulation();
        isSimulatingRef.current = true;

        const movementThreshold = 0.3;
        const quietFramesNeeded = 8;
        let quietFrames = 0;

        const step = () => {
            const movement = layout.stepSimulation();
            const averageMovement = movement / layout.getNodes().length;
            draw();

            if (averageMovement < movementThreshold) {
                quietFrames++;
            } else {
                quietFrames = 0;
            }

            if (quietFrames >= quietFramesNeeded) {
                animationFrameRef.current = null;
                isSimulatingRef.current = false;
                return;
            }

            animationFrameRef.current = requestAnimationFrame(step);
        }

        animationFrameRef.current = requestAnimationFrame(step);
    }

    function stopSimulation() {
        if (animationFrameRef.current !== null) {
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = null;
        }

        isSimulatingRef.current = false;
    }

    const draw = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext("2d");
        if (!context) return;
        const dpr = window.devicePixelRatio || 1;
        const width = window.innerWidth;
        const height = window.innerHeight;

        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;

        context.setTransform(dpr, 0, 0, dpr, 0, 0);

        context.fillStyle = backgroundColor;
        context.fillRect(0, 0, width, height);

        for (const edge of layout.getEdges()) {
            drawEdge(edge);
        }

        drawPreviewEdge();

        for (const node of layout.getNodes()) {
            drawNode(node);
        }

        for (const node of layout.getNodes()) {
            drawLabel(node);
        };
    };

    const getNodeById = (id: string) => {
        return graph.getNodes().find((node) => node.id === id);
    };

    const drawEdge = (edge: Edge) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext("2d");
        if (!context) return;

        const fromNode = getNodeById(edge.from);
        const toNode = getNodeById(edge.to);

        if (!fromNode || !toNode) return;

        const fromRadius = layout.getNodeRadius(fromNode.id) * viewRef.current.scale;
        const toRadius = layout.getNodeRadius(toNode.id) * viewRef.current.scale;

        const fromScreen = graphToScreen(fromNode.position.x, fromNode.position.y);
        const toScreen = graphToScreen(toNode.position.x, toNode.position.y);

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

        const isSelected = edge.id === selectedEdgeId;
        const isDirectional = edge.type !== "Relates To";

        context.beginPath();
        context.moveTo(startX, startY);
        context.lineTo(endX, endY);
        context.strokeStyle = isSelected
            ? "rgb(101, 26, 44)"
            : "rgb(120, 120, 120)";
        context.lineWidth = isSelected ? 4 : 2;
        context.stroke();

        if (isDirectional) {
            const arrowLength = 10;
            const arrowWidth = 5;

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
                : "rgb(120, 120, 120)";
            context.fill();
        }

        const label = getEdgeLabel(edge);
        const { x, y, angle } = getEdgeLabelPlacement(fromScreen.x, fromScreen.y, toScreen.x, toScreen.y, 12);

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

        context.fillStyle = "#88af94";
        context.fillText(label, 0, 0);
        context.restore();
    };

    const drawNode = (node: GraphNode) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext("2d");
        if (!context) return;
        const isSelected = node.id === selectedNodeId;
        const isBeingDragged = dragStateRef.current?.nodeId === node.id;
        const isHovered = node.id === hoveredNodeId;
        const isLinkStart = node.id === linkStartNodeId;
        const radius = layout.getNodeRadius(node.id);

        context.beginPath();
        const screen = graphToScreen(node.position.x, node.position.y);
        context.arc(screen.x, screen.y, radius * viewRef.current.scale, 0, Math.PI * 2);

        context.fillStyle = isBeingDragged
            ? "#f59e0b" : isLinkStart
                ? "#34d399" : isSelected
                    ? "#f59e0b"
                    : isHovered
                        ? "#60a5fa"
                        : Colours.getColourForNode((node.weight - 1) / 10);

        context.fill();

        if (isSelected) {
            context.lineWidth = 2;
            context.strokeStyle = "#000";
            context.stroke();
        }
    };

    const drawLabel = (node: GraphNode) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext("2d");
        if (!context) return;
        const radius = layout.getNodeRadius(node.id);
        const padding = 4;
        const offsetX = radius + 4;
        const offsetY = radius + 4;

        context.font = "12px sans-serif";

        const textWidth = context.measureText(node.title).width;
        const textHeight = 12;

        const screen = graphToScreen(node.position.x, node.position.y);
        const x = screen.x + offsetX;
        const y = screen.y - offsetY;

        // Background
        context.fillStyle = "rgba(255, 250, 231, 0.0)";
        context.fillRect(
            x - padding,
            y - textHeight,
            textWidth + padding * 2,
            textHeight + padding * 2
        );

        // Text
        context.fillStyle = "#651A2C";
        context.fillText(node.title, x, y);
    };

    const drawPreviewEdge = () => {
        if (mode !== "link") return;
        if (!linkStartNodeId) return;
        if (!hoveredNodeId) return;
        if (linkStartNodeId === hoveredNodeId) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext("2d");
        if (!context) return;

        const fromNode = graph.getNode(linkStartNodeId);
        const toNode = graph.getNode(hoveredNodeId);

        if (!fromNode || !toNode) return;

        const fromScreen = graphToScreen(fromNode.position.x, fromNode.position.y);
        const toScreen = graphToScreen(toNode.position.x, toNode.position.y);

        const edgeExists = graph.getEdges().some(
            (edge) =>
                (edge.from === linkStartNodeId && edge.to === hoveredNodeId) ||
                (edge.from === hoveredNodeId && edge.to === linkStartNodeId)
        );

        if (edgeExists) return;

        context.beginPath();
        context.moveTo(fromScreen.x, fromScreen.y);
        context.lineTo(toScreen.x, toScreen.y);
        context.strokeStyle = "rgba(141, 66, 84, 0.45)";
        context.lineWidth = 2;
        context.stroke();
    };

    useEffect(() => {
        draw();
        runSimulation();
    }, [graphVersion]);

    useEffect(() => {
        const handleResize = () => {
            draw();
        };

        window.addEventListener("resize", draw);

        return () => {
            window.removeEventListener("resize", draw);
        };
    }, []);

    useEffect(() => {
        draw();
    }, [backgroundColor, selectedNodeId, hoveredNodeId, linkStartNodeId, graphVersion]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const wheelHandler = (event: WheelEvent) => {
            event.preventDefault();

            const point = getCanvasCoordinates(event);
            if (!point) return;

            const beforeZoom = screenToGraph(point.x, point.y);
            const view = viewRef.current;

            const zoomFactor = event.deltaY < 0 ? 1.03 : 0.97;
            view.scale = Math.max(0.2, Math.min(4, view.scale * zoomFactor));

            const afterZoomScreenX = beforeZoom.x * view.scale + view.offsetX;
            const afterZoomScreenY = beforeZoom.y * view.scale + view.offsetY;

            view.offsetX += point.x - afterZoomScreenX;
            view.offsetY += point.y - afterZoomScreenY;

            draw();
        };

        canvas.addEventListener("wheel", wheelHandler, { passive: false });

        return () => {
            canvas.removeEventListener("wheel", wheelHandler);
        };
    }, []);

    const getCanvasCoordinates = (event: CanvasPointerLikeEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return null;

        const rect = canvas.getBoundingClientRect();

        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
        };
    };

    const hitTestNode = (x: number, y: number): GraphNode | null => {
        const nodes = graph.getNodes();
        for (let i = nodes.length - 1; i >= 0; i--) {
            const node = nodes[i];
            const dx = x - node.position.x;
            const dy = y - node.position.y;
            const distanceSquared = dx * dx + dy * dy;
            const hitRadius = getNodeHitRadius(node.id);

            if (distanceSquared <= hitRadius * hitRadius) {
                return node;
            }
        }

        return null;
    };

    const hitTestEdge = (x: number, y: number): Edge | null => {
        const edges = graph.getEdges();

        for (let i = edges.length - 1; i >= 0; i--) {
            const edge = edges[i];
            const fromNode = graph.getNode(edge.from);
            const toNode = graph.getNode(edge.to);

            if (!fromNode || !toNode) continue;

            const distance = distanceToSegment(
                x,
                y,
                fromNode.position.x,
                fromNode.position.y,
                toNode.position.x,
                toNode.position.y
            );

            if (distance <= 8 / viewRef.current.scale) {
                return edge;
            }
        }

        return null;
    };

    const handlePointerDown = (
        event: React.PointerEvent<HTMLCanvasElement>
    ) => {
        stopSimulation();

        const point = getCanvasCoordinates(event);
        if (!point) return;

        const graphPoint = screenToGraph(point.x, point.y);
        const hitNode = hitTestNode(graphPoint.x, graphPoint.y);
        const hitEdge = hitNode ? null : hitTestEdge(graphPoint.x, graphPoint.y);

        if (hitEdge) {
            setSelectedEdgeId(hitEdge.id);
            setSelectedNodeId(null);
            draw();
            return;
        }

        if (mode === "link") {
            stopSimulation();

            if (!hitNode) {
                setLinkStartNodeId(null);
                draw();
                setSelectedNodeId(null);
                setSelectedEdgeId(null);
                return;
            }

            if (!linkStartNodeId) {
                setLinkStartNodeId(hitNode.id);
                draw();
                return;
            }

            if (linkStartNodeId === hitNode.id) {
                setLinkStartNodeId(null);
                draw();
                return;
            }

            graph.addEdge({
                id: crypto.randomUUID(),
                from: linkStartNodeId,
                to: hitNode.id,
                type: "Relates To",
            });
            setLinkStartNodeId(null);
        }

        if (hitNode) {
            dragStateRef.current = {
                nodeId: hitNode.id,
                offsetX: graphPoint.x - hitNode.position.x,
                offsetY: graphPoint.y - hitNode.position.y,
            };

            panStateRef.current = null;
            setSelectedNodeId(hitNode.id);
            setSelectedEdgeId(null);
        } else if (hitEdge) {
            setSelectedEdgeId(hitEdge.id);
            setSelectedNodeId(null);
        } else {
            dragStateRef.current = null;
            panStateRef.current = {
                startX: point.x,
                startY: point.y,
                startOffsetX: viewRef.current.offsetX,
                startOffsetY: viewRef.current.offsetY,
            };
            setSelectedNodeId(null);
            setSelectedEdgeId(null);

            if (mode === "add" && !hitNode) {
                let id = crypto.randomUUID();
                graph.addNode({
                    id: id,
                    title: "New Node",
                    weight: 1,
                    position: {
                        x: graphPoint.x,
                        y: graphPoint.y,
                    },
                    velocity: {
                        vx: 0,
                        vy: 0,
                    },
                });
                setSelectedNodeId(id);
            }
        }
        runSimulation();
        draw();
    };

    const handlePointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
        const point = getCanvasCoordinates(event);
        if (!point) return;

        // Convert once
        const graphPoint = screenToGraph(point.x, point.y);

        // --- Node drag ---
        const dragState = dragStateRef.current;
        if (dragState) {
            const node = graph.getNode(dragState.nodeId);
            if (node) {
                node.position.x = graphPoint.x - dragState.offsetX;
                node.position.y = graphPoint.y - dragState.offsetY;
            }

            draw();
            return;
        }

        // --- Pan drag ---
        const panState = panStateRef.current;
        if (panState) {
            viewRef.current.offsetX =
                panState.startOffsetX + (point.x - panState.startX);

            viewRef.current.offsetY =
                panState.startOffsetY + (point.y - panState.startY);

            draw();
            return;
        }

        // --- Hover only ---
        const hovered = hitTestNode(graphPoint.x, graphPoint.y);
        setHoveredNodeId(hovered ? hovered.id : null);

        draw();
    };

    const handlePointerUp = (event: React.PointerEvent<HTMLCanvasElement>) => {
        dragStateRef.current = null;
        panStateRef.current = null;

        event.currentTarget.releasePointerCapture(event.pointerId);

        runSimulation(); // optional: settle after drag
    };

    const handlePointerLeave = () => {
        dragStateRef.current = null;
        runSimulation();
    };

    const handleSaveGraph = () => {
        const graphData = graph.export();
        const json = JSON.stringify(graphData, null, 2);

        const blob = new Blob([json], { type: "application/json" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = "mind-graph.json";
        link.click();

        URL.revokeObjectURL(url);
    };

    function distanceToSegment(
        px: number,
        py: number,
        x1: number,
        y1: number,
        x2: number,
        y2: number
    ): number {
        const dx = x2 - x1;
        const dy = y2 - y1;

        if (dx === 0 && dy === 0) {
            const ddx = px - x1;
            const ddy = py - y1;
            return Math.sqrt(ddx * ddx + ddy * ddy);
        }

        const t = Math.max(
            0,
            Math.min(1, ((px - x1) * dx + (py - y1) * dy) / (dx * dx + dy * dy))
        );

        const cx = x1 + t * dx;
        const cy = y1 + t * dy;

        const ddx = px - cx;
        const ddy = py - cy;

        return Math.sqrt(ddx * ddx + ddy * ddy);
    }

    function getEdgeLabel(edge: Edge): string {
        switch (edge.type) {
            case "Theme Of":
                return "Theme Of";
            case "Relates To":
            default:
                return "Relates To";
        }
    }

    interface EdgeLabelPlacement {
        x: number;
        y: number;
        angle: number;
    }

    function getEdgeLabelPlacement(
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

    return (
        <canvas
            ref={canvasRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerLeave}

            style={{
                width: "100vw",
                height: "100vh",
                display: "block",
                cursor: dragStateRef.current ? "grabbing" : "default",
            }}
        />
    );

    function graphToScreen(x: number, y: number) {
        const view = viewRef.current;

        return {
            x: x * view.scale + view.offsetX,
            y: y * view.scale + view.offsetY,
        };
    }

    function screenToGraph(x: number, y: number) {
        const view = viewRef.current;

        return {
            x: (x - view.offsetX) / view.scale,
            y: (y - view.offsetY) / view.scale,
        };
    }
}