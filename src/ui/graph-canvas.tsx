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

export default function GraphCanvas({ backgroundColor, layout, graph }: Props) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const dragStateRef = useRef<DragState>(null);
    const nodesRef = useRef<GraphNode[]>(layout.getNodes());
    const animationFrameRef = useRef<number | null>(null);
    const isSimulatingRef = useRef(false);

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
        context.moveTo(fromNode.position.x, fromNode.position.y);
        context.lineTo(toNode.position.x, toNode.position.y);
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
        context.arc(node.position.x, node.position.y, radius, 0, Math.PI * 2);

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

        const x = node.position.x + offsetX;
        const y = node.position.y - offsetY;

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

    const getCanvasCoordinates = (
        event: React.PointerEvent<HTMLCanvasElement>
    ) => {
        const canvas = canvasRef.current;
        if (!canvas) return null;

        const rect = canvas.getBoundingClientRect();

        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
        };
    };

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

        const hitNode = hitTestNode(point.x, point.y);

        if (hitNode) {
            setSelectedNodeId(hitNode.id);
            dragStateRef.current = {
                nodeId: hitNode.id,
                offsetX: point.x - hitNode.position.x,
                offsetY: point.y - hitNode.position.y,
            };
            event.currentTarget.setPointerCapture(event.pointerId);
        } else {
            setSelectedNodeId(null);
            dragStateRef.current = null;
        }
        draw();
    };

    const handlePointerMove = (
        event: React.PointerEvent<HTMLCanvasElement>
    ) => {
        const point = getCanvasCoordinates(event);
        if (!point) return;

        // 🔹 Hover detection (unchanged)
        const hovered = hitTestNode(point.x, point.y);
        setHoveredNodeId(hovered ? hovered.id : null);
        stopSimulation();


        const dragState = dragStateRef.current;
        if (!dragState) return;

        const nodes = nodesRef.current;

        for (let node of nodes) {
            if (node.id === dragState.nodeId) {
                node.position.x = point.x - dragState.offsetX;
                node.position.y = point.y - dragState.offsetY;
            }
        }

        // 🔹 Redraw immediately
        draw();

        // 🔹 (Optional for now) run simulation
        runSimulation();
    };

    const handlePointerUp = (event: React.PointerEvent<HTMLCanvasElement>) => {
        const dragState = dragStateRef.current;
        if (dragState) {
            event.currentTarget.releasePointerCapture(event.pointerId);
        }

        dragStateRef.current = null;
        runSimulation();
    };

    const handlePointerLeave = () => {
        dragStateRef.current = null;
        runSimulation();
    };

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
}