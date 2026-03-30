import { useEffect, useRef, useState } from "react";
import { Colours } from "../core/model/colours";
import { Graph } from "../core/model/graph";
import { Layout } from "../core/layout/layout";
import { Edge } from "../core/model/edge";
import { GraphNode } from "../core/model/node";

type DragState = {
    nodeId: string;
    offsetX: number;
    offsetY: number;
} | null;

type Props = {
    backgroundColor: string;
    layout: Layout;
    graph: Graph;
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

export default function GraphCanvas({ backgroundColor, layout, graph }: Props) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const dragStateRef = useRef<DragState>(null);
    const nodesRef = useRef<GraphNode[]>(layout.getNodes());
    const viewRef = useRef<ViewTransform>({ offsetX: 0, offsetY: 0, scale: 1 });
    const animationFrameRef = useRef<number | null>(null);
    const isSimulatingRef = useRef(false);
    const panStateRef = useRef<PanState>(null);

    const [nodes, setNodes] = useState<GraphNode[]>(layout.getNodes());
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
    const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

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

        for (const node of layout.getNodes()) {
            drawNode(node);
        }

        for (const node of layout.getNodes()) {
            drawLabel(node);
        };
    };

    const getNodeById = (id: string) => {
        return nodes.find((node) => node.id === id);
    };

    const drawEdge = (edge: Edge) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext("2d");
        if (!context) return;
        const fromNode = getNodeById(edge.from);
        const toNode = getNodeById(edge.to);

        if (!fromNode || !toNode) return;

        context.beginPath();
        const fromScreen = graphToScreen(fromNode.position.x, fromNode.position.y);
        const toScreen = graphToScreen(toNode.position.x, toNode.position.y);
        context.moveTo(fromScreen.x, fromScreen.y);
        context.lineTo(toScreen.x, toScreen.y);
        context.strokeStyle = "rgb(120, 120, 120)";
        context.lineWidth = 2;
        context.stroke();
    };

    const drawNode = (node: GraphNode) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext("2d");
        if (!context) return;
        const isSelected = node.id === selectedNodeId;
        const isHovered = node.id === hoveredNodeId;
        const radius = layout.getNodeRadius(node.id);


        context.beginPath();
        const screen = graphToScreen(node.position.x, node.position.y);
        context.arc(screen.x, screen.y, radius * viewRef.current.scale, 0, Math.PI * 2);

        context.fillStyle = isSelected
            ? "#f59e0b"
            : isHovered
                ? "#60a5fa"
                : Colours.getColourForNode(graph.getConnectionCount(node.id) / 10);

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
        context.fillStyle = "rgba(255, 250, 231, 0.7)";
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

    useEffect(() => {
        draw();
        runSimulation();
        window.addEventListener("resize", draw);

        return () => {
            window.removeEventListener("resize", draw);
        };
    }, [backgroundColor, nodes, selectedNodeId, hoveredNodeId]);

    const getCanvasCoordinates = (event: CanvasPointerLikeEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return null;

        const rect = canvas.getBoundingClientRect();

        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
        };
    };
    /*    const getCanvasCoordinates = (
            event: React.PointerEvent<HTMLCanvasElement>
        ) => {
            const canvas = canvasRef.current;
            if (!canvas) return null;
    
            const rect = canvas.getBoundingClientRect();
    
            return {
                x: event.clientX - rect.left,
                y: event.clientY - rect.top,
            };
        };*/

    const hitTestNode = (x: number, y: number): GraphNode | null => {
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

    const handlePointerDown = (
        event: React.PointerEvent<HTMLCanvasElement>
    ) => {
        stopSimulation();

        const point = getCanvasCoordinates(event);
        if (!point) return;

        const graphPoint = screenToGraph(point.x, point.y);
        const hitNode = hitTestNode(graphPoint.x, graphPoint.y);

        if (hitNode) {
            dragStateRef.current = {
                nodeId: hitNode.id,
                offsetX: graphPoint.x - hitNode.position.x,
                offsetY: graphPoint.y - hitNode.position.y,
            };

            panStateRef.current = null;
            setSelectedNodeId(hitNode.id);
        } else {
            dragStateRef.current = null;
            panStateRef.current = {
                startX: point.x,
                startY: point.y,
                startOffsetX: viewRef.current.offsetX,
                startOffsetY: viewRef.current.offsetY,
            };
            setSelectedNodeId(null);
        }
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

    const handleWheel = (event: React.WheelEvent<HTMLCanvasElement>) => {
        event.preventDefault();

        const point = getCanvasCoordinates(event);
        if (!point) return;

        const beforeZoom = screenToGraph(point.x, point.y);

        const zoomFactor = event.deltaY < 0 ? 1.1 : 0.9;
        const view = viewRef.current;

        view.scale = Math.max(0.2, Math.min(4, view.scale * zoomFactor));

        const afterZoomScreenX = beforeZoom.x * view.scale + view.offsetX;
        const afterZoomScreenY = beforeZoom.y * view.scale + view.offsetY;

        view.offsetX += point.x - afterZoomScreenX;
        view.offsetY += point.y - afterZoomScreenY;

        draw();
    };

    return (
        <canvas
            ref={canvasRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerLeave}
            onWheel={handleWheel}
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