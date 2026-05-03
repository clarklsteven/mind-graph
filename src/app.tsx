import GraphCanvas from "./ui/panels/graph-canvas";
import ControlPanel from "./ui/panels/control-panel";
import PropertiesPanel from "./ui/panels/properties-panel";
import { Graph } from "./core/model/graph";
import { GraphNode } from "./core/model/node";
import { Layout } from "./core/layout/layout";
import { useEffect, useRef, useState } from "react";
import { GraphInterpretation } from "./core/model/graph-interpretation";
import { Interpretation } from "./core/interpretation/interpretation";
import { NewGraphModal } from "./ui/modals/new-graph-modal";
import { InterpretationHelpModal } from "./ui/modals/interpretation-help-modal";
import { loadInterpretations } from "./core/utils/interpretations-loader";
import { GraphCoordinator } from "./core/graph-coordinator/graph-coordinator";
import { GraphRenderer } from "./ui/renderers/graph-renderer";
import { DefaultRenderer } from "./ui/renderers/default-renderer";
import { MindMapRenderer } from "./ui/renderers/mind-map-renderer";
import { MindMapInteractionController } from "./ui/interactions/mind-map-interaction-controller";
import { DefaultInteractionController } from "./ui/interactions/default-interaction-controller";

export type Mode = "select" | "add" | "link" | "delete";

export default function App() {
    const [mode, setMode] = useState<Mode>("select");
    const [isNewGraphModalOpen, setIsNewGraphModalOpen] = useState(false);
    const [isInterpretationHelpModalOpen, setIsInterpretationHelpModalOpen] = useState(false);
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

    let graphCoordinator: GraphCoordinator = new GraphCoordinator(new Interpretation({ interpretation_type: "none" } as GraphInterpretation));
    const fileInputRef = useRef<HTMLInputElement>(null);
    const graphCoordinatorRef = useRef<GraphCoordinator>(graphCoordinator);
    const [graphVersion, setGraphVersion] = useState(0);
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
    const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
    const rendererRef = useRef<GraphRenderer>(null);
    rendererRef.current = new DefaultRenderer(graphCoordinatorRef.current?.getGraph()!,
        graphCoordinatorRef.current?.getLayout()!,
        graphCoordinatorRef.current?.getInterpretation().getInterpretation()!);

    const notifyGraphChanged = () => {
        graphCoordinatorRef.current?.getInterpretation()?.calculateNodeWeights(graphCoordinatorRef.current?.getGraph()!);
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

    const handleConfirmCreateNewGraph = (name: string, interpretationType: string) => {
        graphCoordinatorRef.current = GraphCoordinator.createGraph(name, new Interpretation(interpretationRegistry[interpretationType]));
        setRendererForInterpretation(interpretationType);
        setInteractionControllerForInterpretation(interpretationType);
        if (interpretationType === "mind-map-graph") {
            graphCoordinatorRef.current.getGraph()?.addNode({
                id: crypto.randomUUID(),
                title: name,
                type: "level-0",
                weight: 1,
                position: { x: 500, y: 500 }
            });
        }
        setSelectedNodeId(null);
        setSelectedEdgeId(null);
        setGraphVersion((v) => v + 1);
        setIsNewGraphModalOpen(false);
    };

    const handleOpenNewGraphModal = () => {
        console.log(interpretationRegistry);
        setIsNewGraphModalOpen(true);
    }

    const handleSaveGraph = () => {
        graphCoordinatorRef.current?.saveGraph();
    };

    const handleLoadClick = () => {
        fileInputRef.current?.click();
    };

    const handleLoadGraph = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];
        await graphCoordinatorRef.current?.loadGraph(file!, interpretationRegistry);
        setRendererForInterpretation(graphCoordinatorRef.current.getGraph()?.getInterpretation()!)
        setInteractionControllerForInterpretation(graphCoordinatorRef.current.getGraph()?.getInterpretation()!)
        setGraphVersion((v) => v + 1);

        // Reset the file input so the same file can be chosen again later
        event.target.value = "";

        // Reset the indicator state since the new graph may have different indicators
        setIndicatorState({});
    };

    const handleDeleteSelectedNode = () => {
        if (!selectedNodeId) return;

        graphCoordinatorRef.current?.getGraph()?.deleteNode(selectedNodeId);
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
            const data = Graph.deserialise(saved);
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
                graphCoordinatorRef.current?.getGraph()!,
                graphCoordinatorRef.current?.getInterpretation().getInterpretation()!
            );

            graphCoordinatorRef.current?.setGraph(normalisedGraph);
            graphCoordinatorRef.current?.setLayout(new Layout(graphCoordinatorRef.current?.getGraph()!, 1000, 1000));

            setGraphVersion(v => v + 1);
        } catch (e) {
            console.error("Failed to restore autosave", e);
        } finally {
            setInitialLoadComplete(true);
        }
    }, [interpretationsLoaded, interpretationRegistry]);

    if (!interpretationsLoaded) {
        return <div>Loading interpretations...</div>;
    }

    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: "220px 1fr 260px",
                width: "100vw",
                height: "100vh",
            }}
        >
            <ControlPanel
                name={graphCoordinatorRef.current?.getGraph()?.getName() || "Untitled Graph"}
                mode={mode}
                interpretation={graphCoordinatorRef.current?.getInterpretation().getInterpretation() || null}
                indicatorState={indicatorState}
                setIndicatorState={setIndicatorState}
                setMode={setMode}
                onSave={handleSaveGraph}
                onLoad={handleLoadClick}
                onCreate={handleOpenNewGraphModal}
                onHelp={handleOpenHelpModal}
            />

            <main style={{ overflow: "hidden" }}>
                <GraphCanvas
                    renderer={graphCoordinatorRef.current.getRenderer() || rendererRef.current}
                    backgroundColor="rgb(255, 250, 231)"
                    mode={mode}
                    graph={graphCoordinatorRef.current?.getGraph() || new Graph()}
                    layout={graphCoordinatorRef.current?.getLayout() || new Layout(new Graph(), 1000, 1000)}
                    graphVersion={graphVersion}
                    setGraphVersion={setGraphVersion}
                    selectedNodeId={selectedNodeId}
                    setSelectedNodeId={setSelectedNodeId}
                    selectedEdgeId={selectedEdgeId}
                    setSelectedEdgeId={setSelectedEdgeId}
                    interpretation={graphCoordinatorRef.current?.getInterpretation().getInterpretation() || null}
                    indicatorState={indicatorState}
                    interactionController={graphCoordinatorRef.current.getInteractionController()}
                />
            </main>

            <PropertiesPanel
                graph={graphCoordinatorRef.current?.getGraph() || new Graph()}
                selectedNodeId={selectedNodeId}
                selectedEdgeId={selectedEdgeId}
                onGraphChanged={notifyGraphChanged}
                onDeleteSelectedNode={handleDeleteSelectedNode}
                onDeleteSelectedEdge={handleDeleteSelectedEdge}
                interpretation={graphCoordinatorRef.current?.getInterpretation().getInterpretation() || null}
            />

            <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                style={{ display: "none" }}
                onChange={handleLoadGraph}
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
                interpretation={graphCoordinatorRef.current?.getInterpretation().getInterpretation()!}
            />
        </div>
    );
}