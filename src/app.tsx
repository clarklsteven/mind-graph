import GraphCanvas from "./ui/graph-canvas";
import ControlPanel from "./ui/control-panel";
import { Graph } from "./core/model/graph";
import { Layout } from "./core/layout/layout";
import savedGraphData from "../test-graph.json";
import { useRef, useState } from "react";

type Mode = "select" | "add" | "link";

export default function App() {
    const [mode, setMode] = useState<Mode>("select");

    let graph: Graph;
    if (savedGraphData) {
        graph = new Graph().import(savedGraphData);
    }
    let layout: Layout;
    if (graph) {
        layout = new Layout(graph, 1000, 1000);
    }

    const graphRef = useRef<Graph>(graph);
    const layoutRef = useRef<Layout>(layout);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [graphVersion, setGraphVersion] = useState(0);

    const handleSaveGraph = () => {
        const graphData = graphRef.current.export();
        const json = JSON.stringify(graphData, null, 2);

        const blob = new Blob([json], { type: "application/json" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = "mind-graph.json";
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


        // Reset the file input so the same file can be chosen again later
        event.target.value = "";
    };

    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: "220px 1fr",
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
                />
            </main>

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

function getButtonStyle(isActive: boolean): React.CSSProperties {
    return {
        padding: "10px 12px",
        textAlign: "center",
        border: "1px solid rgb(160, 150, 140)",
        borderRadius: "8px",
        backgroundColor: isActive
            ? "rgb(101, 26, 44)"
            : "rgb(255, 250, 231)",
        color: isActive ? "rgb(255, 250, 231)" : "rgb(70, 50, 60)",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: 500,
    };
}

function getSecondaryButtonStyle(): React.CSSProperties {
    return {
        width: "100%",
        padding: "10px 12px",
        textAlign: "center",
        border: "1px solid rgb(160, 150, 140)",
        borderRadius: "8px",
        backgroundColor: "rgb(255, 250, 231)",
        color: "rgb(70, 50, 60)",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: 500,
    };
}