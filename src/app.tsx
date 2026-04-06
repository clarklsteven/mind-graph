import GraphCanvas from "./ui/graph-canvas";
import ControlPanel from "./ui/control-panel";
import PropertiesPanel from "./ui/properties-panel";
import { Graph } from "./core/model/graph";
import { Layout } from "./core/layout/layout";
import { useRef, useState } from "react";

export type Mode = "select" | "add" | "link" | "delete";

export default function App() {
    const [mode, setMode] = useState<Mode>("select");

    let graph: Graph = new Graph();
    let layout: Layout = new Layout(graph, 1000, 1000);
    if (graph) {
        layout = new Layout(graph, 1000, 1000);
    }

    const graphRef = useRef<Graph>(graph);
    const layoutRef = useRef<Layout>(layout);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [graphVersion, setGraphVersion] = useState(0);
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
    const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);

    const notifyGraphChanged = () => {
        setGraphVersion((v) => v + 1);
    };

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

        const filename = `mind-graph-${timestamp}.json`;

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
            // Load any specific interpretation data from the appropriate configuration file.
            let interpretationConfig = null;
            try {
                interpretationConfig = await import(`../config/${data.interpretationType}.json`);
            } catch (error) {
                console.warn(`No specific configuration found for interpretation type: ${data.interpretationType}`);
            }
        }

        // Reset the file input so the same file can be chosen again later
        event.target.value = "";
    };

    const handleDeleteSelectedNode = () => {
        if (!selectedNodeId) return;

        graphRef.current.deleteNode(selectedNodeId);
        setSelectedNodeId(null);
        notifyGraphChanged();
    };

    const handleDeleteSelectedEdge = () => {
        console.log("Deleting edge", selectedEdgeId);
        if (!selectedEdgeId) return;

        graphRef.current.deleteEdge(selectedEdgeId);
        setSelectedEdgeId(null);
        notifyGraphChanged();
    };

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
                mode={mode}
                setMode={setMode}
                onSave={handleSaveGraph}
                onLoad={handleLoadClick}
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
                />
            </main>

            <PropertiesPanel
                graph={graphRef.current}
                selectedNodeId={selectedNodeId}
                selectedEdgeId={selectedEdgeId}
                onGraphChanged={notifyGraphChanged}
                onDeleteSelectedNode={handleDeleteSelectedNode}
                onDeleteSelectedEdge={handleDeleteSelectedEdge}
            />

            <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                style={{ display: "none" }}
                onChange={handleLoadGraph}
            />
        </div>
    );
}