import { Graph } from "./core/model/graph";
import { Layout } from "./core/layout/layout";
import { useEffect, useRef, useState } from "react";
import type { GraphInterpretation } from "./core/model/graph-interpretation";
import { Interpretation } from "./core/interpretation/interpretation";
import { NewGraphModal } from "./ui/modals/new-graph-modal";
import { InterpretationHelpModal } from "./ui/modals/interpretation-help-modal";
import { loadInterpretations } from "./core/utils/interpretations-loader";
import { GraphCoordinator } from "./core/graph-coordinator/graph-coordinator";
import type { GraphRenderer } from "./ui/renderers/graph-renderer";
import { DefaultRenderer } from "./ui/renderers/default-renderer";
import { MindMapRenderer } from "./ui/renderers/mind-map-renderer";
import { MindMapInteractionController } from "./ui/interactions/mind-map-interaction-controller";
import { DefaultInteractionController } from "./ui/interactions/default-interaction-controller";
import { MindMapLayout } from "./core/layout/mind-map-layout";
import Toolbar from "./ui/toolbar";
import MainArea from "./ui/main-area";
import { SettingsModal } from "./ui/modals/settings-modal";
import StatusBar from "./ui/statusbar";
import { LoadGraphModal } from "./ui/modals/load-graph-modal";

export type Mode = "select" | "add" | "link" | "delete";

const CANVASWIDTH = 1000;
const CANVASHEIGHT = 1000;

export default function App() {
    const [mode, setMode] = useState<Mode>("select");
    const [isNewGraphModalOpen, setIsNewGraphModalOpen] = useState(false);
    const [isInterpretationHelpModalOpen, setIsInterpretationHelpModalOpen] = useState(false);
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
    const [isLoadGraphModalOpen, setIsLoadGraphModalOpen] = useState(false);
    const [indicatorState, setIndicatorState] = useState<Record<string, boolean>>({});
    const [interpretationRegistry, setInterpretationRegistry] = useState<Record<string, GraphInterpretation>>({});
    const [interpretationsLoaded, setInterpretationsLoaded] = useState(false);
    const [initialLoadComplete, setInitialLoadComplete] = useState(false);

    useEffect(() => {
        const loadInterpretationsAsync = async () => {
            const result = await loadInterpretations();
            setInterpretationRegistry(result);
            setInterpretationsLoaded(true);
        };

        loadInterpretationsAsync();
    }, [interpretationsLoaded]);

    const graphCoordinator: GraphCoordinator = new GraphCoordinator(new Interpretation({ interpretation_type: "none" } as GraphInterpretation));
    const fileInputRef = useRef<HTMLInputElement>(null);
    const graphCoordinatorRef = useRef<GraphCoordinator>(graphCoordinator);
    const [graphVersion, setGraphVersion] = useState(0);
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
    const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
    const rendererRef = useRef<GraphRenderer>(null);
    const coordinator = graphCoordinatorRef.current;
    if (!coordinator) {
        throw new Error("GraphCoordinator has not been initialised");
    }
    rendererRef.current = new DefaultRenderer(coordinator.getGraph()!,
        coordinator.getLayout()!,
        coordinator.getInterpretation().getInterpretation()!);

    const notifyGraphChanged = () => {
        graphCoordinatorRef.current?.getInterpretation()?.calculateNodeWeights(coordinator.getGraph()!);
        setGraphVersion((v) => v + 1);
    };

    const setRendererForInterpretation = (interpretationType: string) => {
        switch (interpretationType) {
            case "mind-map-graph":
                graphCoordinatorRef.current.setRenderer(
                    new MindMapRenderer(
                        graphCoordinatorRef.current.getGraph()!,
                        graphCoordinatorRef.current.getLayout()!,
                        graphCoordinatorRef.current.getInterpretation()!.getInterpretation())
                );
                break;
            default:
                graphCoordinatorRef.current.setRenderer(
                    new DefaultRenderer(
                        graphCoordinatorRef.current.getGraph()!,
                        graphCoordinatorRef.current.getLayout()!,
                        graphCoordinatorRef.current.getInterpretation()!.getInterpretation())
                );
                break;
        }
    }

    const setInteractionControllerForInterpretation = (interpretationType: string) => {
        switch (interpretationType) {
            case "mind-map-graph":
                graphCoordinatorRef.current.setInteractionController(
                    new MindMapInteractionController()
                );
                break;
            default:
                graphCoordinatorRef.current.setInteractionController(
                    new DefaultInteractionController()
                );
                break;
        }
    }

    const setLayoutForInterpretation = (interpretationType: string) => {
        switch (interpretationType) {
            case "mind-map-graph":
                graphCoordinatorRef.current.setLayout(
                    new MindMapLayout(graphCoordinatorRef.current.getGraph()!, CANVASWIDTH, CANVASHEIGHT)
                );
                break;
            default:
                graphCoordinatorRef.current.setLayout(
                    new Layout(graphCoordinatorRef.current.getGraph()!, CANVASWIDTH, CANVASHEIGHT)
                );
                break;
        }
    }

    const handleConfirmCreateNewGraph = (name: string, interpretationType: string) => {
        graphCoordinatorRef.current = GraphCoordinator.createGraph(name, new Interpretation(interpretationRegistry[interpretationType]));
        setRendererForInterpretation(interpretationType);
        setInteractionControllerForInterpretation(interpretationType);
        setLayoutForInterpretation(interpretationType);
        if (interpretationType === "mind-map-graph") {
            graphCoordinatorRef.current.getGraph()?.addNode({
                id: crypto.randomUUID(),
                title: name,
                type: "level-0",
                weight: 1,
                position: { x: 500, y: 500 },
                size: { width: 8, height: 8 }
            });
        }
        setSelectedNodeId(null);
        setSelectedEdgeId(null);
        setGraphVersion((v) => v + 1);
        setIsNewGraphModalOpen(false);
    };

    const handleOpenNewGraphModal = () => {
        setIsNewGraphModalOpen(true);
    }

    const handleSaveGraph = () => {
        graphCoordinatorRef.current?.saveGraph();
    };

    const handleLoadGraph = async (
        name: string
    ) => {
        await graphCoordinatorRef.current?.loadGraph(name, interpretationRegistry);
        setRendererForInterpretation(coordinator.getGraph()!.getInterpretation()!)
        setInteractionControllerForInterpretation(coordinator.getGraph()!.getInterpretation()!)
        setLayoutForInterpretation(coordinator.getGraph()!.getInterpretation()!);
        setGraphVersion((v) => v + 1);

        // Reset the indicator state since the new graph may have different indicators
        setIndicatorState({});
    };

    const handleDeleteSelectedNode = () => {
        if (!selectedNodeId) return;

        //graphCoordinatorRef.current?.getGraph()?.deleteNode(selectedNodeId);
        graphCoordinatorRef.current.getInteractionController()?.deleteNode(selectedNodeId, graphCoordinatorRef.current.getGraph()!);
        setSelectedNodeId(null);
        notifyGraphChanged();
    };

    const handleDeleteSelectedEdge = () => {
        if (!selectedEdgeId) return;

        graphCoordinatorRef.current?.getGraph()?.deleteEdge(selectedEdgeId);
        setSelectedEdgeId(null);
        notifyGraphChanged();
    };

    const handleOpenHelpModal = () => {
        setIsInterpretationHelpModalOpen(true);
    };

    const handleOpenSettingsModal = () => {
        setIsSettingsModalOpen(true);
    };

    const handleOpenLoadGraphModal = () => {
        setIsLoadGraphModalOpen(true);
    }

    // Autosave graph to local storage on changes, with debouncing
    useEffect(() => {
        if (!initialLoadComplete) return;
        if (!graphCoordinatorRef.current?.getGraph()) return;

        const timeout = setTimeout(() => {
            const data: string = graphCoordinatorRef.current?.getGraph()?.serialise() || "";
            localStorage.setItem("mindgraph_autosave", data);
        }, 500); // half a second

        return () => clearTimeout(timeout);
    }, [graphVersion]);

    /// On initial load, check for an autosave in local storage and load it if it exists
    useEffect(() => {
        if (!interpretationsLoaded) return;

        const saved = localStorage.getItem("mindgraph_autosave");
        if (!saved) return;

        try {
            const data: Graph = Graph.deserialise(saved);
            const interpretation = interpretationRegistry[data.getInterpretation()];

            if (!interpretation) {
                console.warn(`No interpretation found for ${data.getInterpretation()} whilst restoring autosave`);
                return;
            }

            graphCoordinatorRef.current = new GraphCoordinator(new Interpretation(interpretation));

            graphCoordinatorRef.current?.setGraph(data);
            if (!graphCoordinatorRef.current?.getGraph()) {
                console.error("Failed to import graph from autosave");
                return;
            }
            const normalisedGraph = graphCoordinatorRef.current?.normaliseGraph(
                coordinator.getGraph()!,
                coordinator.getInterpretation().getInterpretation()!
            );

            graphCoordinatorRef.current?.setGraph(normalisedGraph);
            setRendererForInterpretation(interpretation.id)
            setInteractionControllerForInterpretation(interpretation.id)
            setLayoutForInterpretation(interpretation.id);

            setGraphVersion(v => v + 1);
        } catch (e) {
            console.error("Failed to restore autosave", e);
        } finally {
            setInitialLoadComplete(true);
        }
    }, [interpretationsLoaded, interpretationRegistry]);

    // If the graph version changes then the node weights may need recalculating
    useEffect(() => {
        if (graphCoordinatorRef.current.getGraph()) {
            graphCoordinatorRef.current.getInterpretation().calculateNodeWeights(graphCoordinatorRef.current.getGraph()!);
        }
    }, [graphVersion]);

    if (!interpretationsLoaded) {
        return <div>Loading interpretations...</div>;
    }

    return (
        <div className="app-shell"
        >
            <Toolbar
                onSave={handleSaveGraph}
                onCreate={handleOpenNewGraphModal}
                onHelp={handleOpenHelpModal}
                onSettings={handleOpenSettingsModal}
                onLoadGraph={handleOpenLoadGraphModal}
            />
            <MainArea
                name={graphCoordinatorRef.current?.getGraph()?.getName() || "Untitled Graph"}
                mode={mode}
                interpretation={graphCoordinatorRef.current?.getInterpretation().getInterpretation() || null}
                indicatorState={indicatorState}
                setIndicatorState={setIndicatorState}
                setMode={setMode}
                renderer={graphCoordinatorRef.current.getRenderer() || rendererRef.current}
                backgroundColor="rgb(255, 250, 231)"
                layout={graphCoordinatorRef.current?.getLayout() || new Layout(new Graph(), 1000, 1000)}
                graph={graphCoordinatorRef.current?.getGraph() || new Graph()}
                graphVersion={graphVersion}
                setGraphVersion={setGraphVersion}
                selectedNodeId={selectedNodeId}
                setSelectedNodeId={setSelectedNodeId}
                selectedEdgeId={selectedEdgeId}
                setSelectedEdgeId={setSelectedEdgeId}
                interactionController={graphCoordinatorRef.current.getInteractionController()}
                onGraphChanged={notifyGraphChanged}
                onDeleteSelectedNode={handleDeleteSelectedNode}
                onDeleteSelectedEdge={handleDeleteSelectedEdge}
            />

            <StatusBar />

            <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                style={{ display: "none" }}
            //onChange={handleLoadGraph}
            />

            <NewGraphModal
                isOpen={isNewGraphModalOpen}
                onClose={() => setIsNewGraphModalOpen(false)}
                onCreate={handleConfirmCreateNewGraph}
                interpretations={Object.values(interpretationRegistry)}
            />

            <InterpretationHelpModal
                isOpen={isInterpretationHelpModalOpen}
                onClose={() => setIsInterpretationHelpModalOpen(false)}
                interpretation={coordinator.getInterpretation().getInterpretation()!}
            />

            <SettingsModal
                isOpen={isSettingsModalOpen}
                onClose={() => setIsSettingsModalOpen(false)}
            />

            <LoadGraphModal
                isOpen={isLoadGraphModalOpen}
                onClose={() => setIsLoadGraphModalOpen(false)}
                onLoad={(name) => handleLoadGraph(name)}
            />
        </div>
    );
}