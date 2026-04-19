import GraphCanvas from "./ui/graph-canvas";
import ControlPanel from "./ui/control-panel";
import PropertiesPanel from "./ui/properties-panel";
import { Graph } from "./core/model/graph";
import { Layout } from "./core/layout/layout";
import { useEffect, useRef, useState } from "react";
import { GraphInterpretation } from "./core/model/graph-interpretation";
import { Interpretation } from "./core/interpretation/interpretation";
import { NewGraphModal } from "./ui/new-graph-modal";
import { InterpretationHelpModal } from "./ui/interpretation-help-modal";
import { loadInterpretations } from "./core/utils/interpretations-loader";

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
            console.log("Loaded interpretations:", result);
            setInterpretationRegistry(result);
            setInterpretationsLoaded(true);
        };

        loadInterpretationsAsync();
        console.log("Started loading interpretations");
    }, [interpretationsLoaded]);

    let graph: Graph = new Graph();
    let layout: Layout = new Layout(graph, 1000, 1000);
    if (graph) {
        layout = new Layout(graph, 1000, 1000);
    }

    const graphRef = useRef<Graph>(graph);
    const layoutRef = useRef<Layout>(layout);
    const interpretationRef = useRef<Interpretation>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [graphVersion, setGraphVersion] = useState(0);
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
    const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);

    // const interpretationRegistry: Record<string, GraphInterpretation> = {};
    //    interpretationRegistry[conceptGraph.interpretation_type] = conceptGraph as GraphInterpretation;
    //    interpretationRegistry[narrativeStrategyGraph.interpretation_type] = narrativeStrategyGraph as GraphInterpretation;
    //    interpretationRegistry[releaseAssuranceGraph.interpretation_type] = releaseAssuranceGraph as GraphInterpretation;
    //    interpretationRegistry[rootCauseAnalysisGraph.interpretation_type] = rootCauseAnalysisGraph as GraphInterpretation;
    //    interpretationRegistry[thinkingGraph.interpretation_type] = thinkingGraph as GraphInterpretation;

    const serialiseGraph = (graph: Graph) => {
        return JSON.stringify({
            name: graph.getName(),
            interpretation: graph.getInterpretation(),
            nodes: graph.getNodes(),
            edges: graph.getEdges(),
        });
    }

    const deserialiseGraph = (json: string) => {
        return JSON.parse(json);
    }

    const notifyGraphChanged = () => {
        interpretationRef.current?.calculateNodeWeights(graphRef.current);
        console.log("Graph changed, updated node weights:");
        graphRef.current.getNodes().forEach(node => {
            console.log(`Node ${node.id} (${node.title}): weight = ${node.weight}`);
        });
        setGraphVersion((v) => v + 1);
    };

    const handleConfirmCreateNewGraph = (name: string, interpretationType: string) => {
        createGraph(name, interpretationType);
        setIsNewGraphModalOpen(false);
    };

    const createGraph = (name: string, interpretationType: string) => {
        graphRef.current = new Graph();
        graphRef.current.setName(name);
        layoutRef.current = new Layout(graphRef.current, 1000, 1000);
        interpretationRef.current = new Interpretation(interpretationRegistry[interpretationType]);
        setSelectedNodeId(null);
        setSelectedEdgeId(null);
        setGraphVersion((v) => v + 1);
    };

    const handleOpenNewGraphModal = () => {
        setIsNewGraphModalOpen(true);
    }
    const handleSaveGraph = () => {
        const graphData = graphRef.current.export();
        const json = JSON.stringify(graphData, null, 2);

        const now = new Date();
        const timestamp = [
            now.getFullYear(),
            String(now.getMonth() + 1).padStart(2, "0"),
            String(now.getDate()).padStart(2, "0"),
        ].join("-") + "-" + [
            String(now.getHours()).padStart(2, "0"),
            String(now.getMinutes()).padStart(2, "0"),
        ].join("");

        let outputname = "";
        if (!graphRef.current.getName().includes("Untitled")) {
            outputname = graphRef.current.getName().replace(/\s+/g, "-") + "-" + timestamp;
        } else {
            outputname = `mind-graph-${timestamp}`;
        }
        const filename = `${outputname}.json`;

        const blob = new Blob([json], { type: "application/json" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        link.click();

        URL.revokeObjectURL(url);
    };

    const handleLoadClick = () => {
        fileInputRef.current?.click();
    };

    const handleLoadGraph = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const text = await file.text();
        const data = JSON.parse(text);

        graphRef.current = graphRef.current.import(data);
        layoutRef.current = new Layout(graphRef.current, 1000, 1000);
        setGraphVersion((v) => v + 1);

        // Import the graph interpretation if it exists
        if (data.interpretationType) {
            const interpretation: GraphInterpretation = interpretationRegistry[data.interpretation];
            if (interpretation) {
                interpretationRef.current = new Interpretation(interpretation);
            } else {
                console.warn(`No specific configuration found for interpretation type: ${data.interpretation}`);
            }
            let normalisedGraph = normaliseGraph(graphRef.current, interpretationRef.current?.getInterpretation()!);
            graphRef.current = normalisedGraph;
            layoutRef.current = new Layout(graphRef.current, 1000, 1000);
        }

        // Reset the file input so the same file can be chosen again later
        event.target.value = "";

        // Reset the indicator state since the new graph may have different indicators
        setIndicatorState({});
    };

    const normaliseGraph = (graph: Graph, interpretation: GraphInterpretation): Graph => {
        const normalisedGraph = new Graph();
        normalisedGraph.setName(graph.getName());
        normalisedGraph.setInterpretation(interpretation.interpretation_type);

        // Find the default node type from the interpretation
        const defaultNodeDef = interpretation.node_definitions?.find(def => def.isDefault);

        // Add all nodes, ensuring they have valid types and properties
        for (const node of graph.getNodes()) {
            let nodeDef = interpretation.node_definitions?.find(def => def.id === node.type);
            if (!nodeDef) {
                console.warn(`Node ${node.id} has unknown type ${node.type}, using default type`);
                nodeDef = defaultNodeDef;
            }

            const normalisedNode = {
                ...node,
                type: nodeDef ? nodeDef.id : "unknown",
                properties: nodeDef?.properties?.reduce((props, propDef) => {
                    props[propDef.id] = node.properties?.[propDef.id] ?? "";
                    return props;
                }, {} as Record<string, any>)
            };

            normalisedGraph.addNode(normalisedNode);
        }

        // Find the default relationship type from the interpretation
        const defaultRelDef = interpretation.relationship_definitions?.find(def => def.isDefault);

        // Add all edges, ensuring they have valid types and properties
        for (const edge of graph.getEdges()) {
            let edgeDef = interpretation.relationship_definitions?.find(def => def.id === edge.type);
            if (!edgeDef) {
                console.warn(`Edge ${edge.id} has unknown type ${edge.type}, using default type`);
                edgeDef = defaultRelDef;
            }

            // Ensure the from and to nodes still exist after normalisation
            if (!normalisedGraph.getNode(edge.from) || !normalisedGraph.getNode(edge.to)) {
                console.warn(`Edge ${edge.id} references missing nodes, skipping`);
                continue;
            }

            const normalisedEdge = {
                ...edge,
                type: edgeDef!.id
            };

            normalisedGraph.addEdge(normalisedEdge);
        }

        return normalisedGraph;
    }

    const handleDeleteSelectedNode = () => {
        if (!selectedNodeId) return;

        graphRef.current.deleteNode(selectedNodeId);
        setSelectedNodeId(null);
        notifyGraphChanged();
    };

    const handleDeleteSelectedEdge = () => {
        if (!selectedEdgeId) return;

        graphRef.current.deleteEdge(selectedEdgeId);
        setSelectedEdgeId(null);
        notifyGraphChanged();
    };

    const handleOpenHelpModal = () => {
        setIsInterpretationHelpModalOpen(true);
    };

    useEffect(() => {
        if (!initialLoadComplete) return;
        if (!graphRef.current) return;

        const timeout = setTimeout(() => {
            const data = serialiseGraph(graphRef.current);
            console.log("Autosaving graph:", data);
            localStorage.setItem("mindgraph_autosave", data);
            console.log("Autosaved");
        }, 500); // half a second

        return () => clearTimeout(timeout);
    }, [graphVersion]);

    useEffect(() => {
        if (!interpretationsLoaded) return;

        const saved = localStorage.getItem("mindgraph_autosave");
        if (!saved) return;

        try {
            const data = deserialiseGraph(saved);
            const interpretation = interpretationRegistry[data.interpretation];

            if (!interpretation) {
                console.warn(`No interpretation found for ${data.interpretation} whilst restoring autosave`);
                return;
            }
            console.log(`Restoring autosave with interpretation ${data.interpretation}`);

            interpretationRef.current = new Interpretation(interpretation);

            const importedGraph = graphRef.current.import(data);
            const normalisedGraph = normaliseGraph(
                importedGraph,
                interpretationRef.current.getInterpretation()
            );

            graphRef.current = normalisedGraph;
            layoutRef.current = new Layout(graphRef.current, 1000, 1000);

            if (data.name) {
                graphRef.current.setName(data.name);
            }

            setGraphVersion(v => v + 1);
            console.log("Autosave restored");
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
                name={graphRef.current.getName()}
                mode={mode}
                interpretation={interpretationRef.current?.getInterpretation() || null}
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
                    backgroundColor="rgb(255, 250, 231)"
                    mode={mode}
                    graph={graphRef.current}
                    layout={layoutRef.current}
                    graphVersion={graphVersion}
                    selectedNodeId={selectedNodeId}
                    setSelectedNodeId={setSelectedNodeId}
                    selectedEdgeId={selectedEdgeId}
                    setSelectedEdgeId={setSelectedEdgeId}
                    interpretation={interpretationRef.current?.getInterpretation() || null}
                    indicatorState={indicatorState}
                />
            </main>

            <PropertiesPanel
                graph={graphRef.current}
                selectedNodeId={selectedNodeId}
                selectedEdgeId={selectedEdgeId}
                onGraphChanged={notifyGraphChanged}
                onDeleteSelectedNode={handleDeleteSelectedNode}
                onDeleteSelectedEdge={handleDeleteSelectedEdge}
                interpretation={interpretationRef.current?.getInterpretation() || null}
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
                interpretation={interpretationRef.current?.getInterpretation()!}
            />
        </div>
    );
}