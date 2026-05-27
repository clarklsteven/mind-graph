import { useEffect, useRef, useState } from "react";
import type { Graph } from "../../core/model/graph";
import type { Layout } from "../../core/layout/layout";
import type { Edge } from "../../core/model/edge";
import type { Size } from "../../core/model/node";
import type { Mode } from "../../app";
import type { GraphInterpretation } from "../../core/model/graph-interpretation";
import type { GraphRenderer } from "../renderers/graph-renderer";
import type { GraphState } from "../graph-state";
import type { GraphInteractionController } from "../interactions/graph-interaction-controller";
import type { NodeMeasurer } from "../../core/layout/node-measurer";
import { MindMapNodeMeasurer } from "../../core/layout/mind-map-node-measurer";

export type DragState = {
    nodeId: string;
    offsetX: number;
    offsetY: number;
} | null;

type Props = {
    renderer: GraphRenderer;
    backgroundColor: string;
    layout: Layout;
    graph: Graph;
    mode: Mode;
    graphVersion: number;
    setGraphVersion: (v: number) => void;
    selectedNodeId: string | null;
    setSelectedNodeId: (id: string | null) => void;
    selectedEdgeId: string | null;
    setSelectedEdgeId: (id: string | null) => void;
    interpretation: GraphInterpretation | null;
    interactionController: GraphInteractionController | undefined;
    indicatorState: Record<string, boolean>;
}

export type ViewTransform = {
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

export default function GraphCanvas({ backgroundColor, layout, graph, mode, graphVersion, setGraphVersion, renderer,
    selectedNodeId, setSelectedNodeId, selectedEdgeId, setSelectedEdgeId, interactionController,
    indicatorState }: Props) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const dragStateRef = useRef<DragState>(null);
    const viewRef = useRef<ViewTransform>({ offsetX: 0, offsetY: 0, scale: 1 });
    const animationFrameRef = useRef<number | null>(null);
    const isSimulatingRef = useRef(false);
    const panStateRef = useRef<PanState>(null);
    const indicatorStateRef = useRef<Record<string, boolean>>(indicatorState);
    const graphStateRef = useRef<GraphState>({
        view: viewRef.current,
        selectedNodeId,
        selectedEdgeId,
        hoveredNodeId: null,
        linkStartNodeId: null,
        drag: null,
        mode,
        indicatorState: indicatorStateRef.current,
    });
    graphStateRef.current.mode = mode;
    const nodeMeasurerRef = useRef<NodeMeasurer | null>(null);
    setNodeMeasurerBasedOnInterpretation(graph.getInterpretation());

    function setNodeMeasurerBasedOnInterpretation(interpretationType: string) {
        if (!canvasRef.current) return;

        switch (interpretationType) {
            case "mind-map-graph":
                nodeMeasurerRef.current = new MindMapNodeMeasurer(canvasRef.current.getContext("2d") as CanvasRenderingContext2D);
                break;
        }
    }

    const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
    const [linkStartNodeId, setLinkStartNodeId] = useState<string | null>(null);

    function runSimulation() {
        stopSimulation();
        isSimulatingRef.current = true;
        layout.resetSimulationStability();

        const quietFramesNeeded = 8;
        let quietFrames = 0;

        const step = () => {
            layout.stepSimulation();
            draw();

            if (layout.isSimulationStable()) {
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
            renderer.drawEdge(canvas, graphStateRef.current, edge);
        }

        renderer.drawPreviewEdge(canvas, graphStateRef.current);

        for (const node of layout.getNodes()) {
            renderer.drawNode(canvas, graphStateRef.current, node);
        }

        for (const node of layout.getNodes()) {
            renderer.drawLabel(canvas, graphStateRef.current, node);
        };
    };

    useEffect(() => {
        indicatorStateRef.current = indicatorState;
        graphStateRef.current.indicatorState = indicatorState;
        draw();
    }, [indicatorState]);

    useEffect(() => {
        graph.getNodes().forEach(node => node.size = nodeMeasurerRef.current?.measure(node) as Size);
        draw();
        runSimulation();
    }, [graphVersion]);

    useEffect(() => {
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

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            const selectedNodeId = graphStateRef.current.selectedNodeId ? graphStateRef.current.selectedNodeId : "";
            const handled = interactionController?.onKeyDown?.(event, {
                graph,
                selectedNodeId,
                setSelectedNodeId,
                graphVersion,
                setGraphVersion
            });

            if (handled) {
                event.preventDefault();
                event.stopPropagation();
            }
        };

        window.addEventListener("keydown", handleKeyDown, { capture: true });

        return () => {
            window.removeEventListener("keydown", handleKeyDown, { capture: true });
        };
    }, [interactionController, graph, selectedNodeId]);

    const getCanvasCoordinates = (event: CanvasPointerLikeEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return null;

        const rect = canvas.getBoundingClientRect();

        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
        };
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
        const hitNode = renderer.hitTestNode(graphPoint);
        const hitEdge = hitNode ? null : hitTestEdge(graphPoint.x, graphPoint.y);

        if (hitEdge) {
            setSelectedEdgeId(hitEdge.id);
            graphStateRef.current.selectedEdgeId = hitEdge.id;
            setSelectedNodeId(null);
            graphStateRef.current.selectedNodeId = null;
            draw();
            return;
        }

        if (mode === "link") {
            stopSimulation();

            if (!hitNode) {
                setLinkStartNodeId(null);
                graphStateRef.current.linkStartNodeId = null;
                draw();
                setSelectedNodeId(null);
                graphStateRef.current.selectedNodeId = null;
                setSelectedEdgeId(null);
                graphStateRef.current.selectedEdgeId = null;
                return;
            }

            if (!linkStartNodeId) {
                setLinkStartNodeId(hitNode.id);
                graphStateRef.current.linkStartNodeId = hitNode.id;
                draw();
                return;
            }

            if (linkStartNodeId === hitNode.id) {
                setLinkStartNodeId(null);
                graphStateRef.current.linkStartNodeId = null;
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
            graphStateRef.current.linkStartNodeId = null;
        }

        if (hitNode) {
            dragStateRef.current = {
                nodeId: hitNode.id,
                offsetX: graphPoint.x - hitNode.position.x,
                offsetY: graphPoint.y - hitNode.position.y,
            };

            panStateRef.current = null;
            setSelectedNodeId(hitNode.id);
            graphStateRef.current.selectedNodeId = hitNode.id;
            setSelectedEdgeId(null);
            graphStateRef.current.selectedEdgeId = null;
        } else {
            dragStateRef.current = null;
            panStateRef.current = {
                startX: point.x,
                startY: point.y,
                startOffsetX: viewRef.current.offsetX,
                startOffsetY: viewRef.current.offsetY,
            };
            setSelectedNodeId(null);
            graphStateRef.current.selectedNodeId = null;
            setSelectedEdgeId(null);
            graphStateRef.current.selectedEdgeId = null;

            if (mode === "add" && !hitNode) {
                const id = crypto.randomUUID();
                graph.addNode({
                    id: id,
                    title: "New Node",
                    type: "Default",
                    weight: 1,
                    position: {
                        x: graphPoint.x,
                        y: graphPoint.y,
                    },
                    velocity: {
                        vx: 0,
                        vy: 0,
                    },
                    size: { width: 8, height: 8 }
                });
                setSelectedNodeId(id);
                graphStateRef.current.selectedNodeId = id;
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
        const hovered = renderer.hitTestNode(graphPoint);
        setHoveredNodeId(hovered ? hovered.id : null);
        graphStateRef.current.hoveredNodeId = hovered ? hovered.id : null;

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

    return (
        <canvas
            ref={canvasRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerLeave}

            style={{
                width: "100vw",
                display: "block",
                cursor: dragStateRef.current ? "grabbing" : "default",
            }}
        />
    );

    function screenToGraph(x: number, y: number) {
        const view = viewRef.current;

        return {
            x: (x - view.offsetX) / view.scale,
            y: (y - view.offsetY) / view.scale,
        };
    }
}