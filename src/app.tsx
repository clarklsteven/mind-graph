import GraphCanvas from "./ui/graph-canvas";
import { Graph } from "./core/model/graph";
import { Layout } from "./core/layout/layout";
import savedGraphData from "../test-graph.json";

export default function App() {
    let graph: Graph;
    if (savedGraphData) {
        graph = Graph.import(savedGraphData);
    }
    let layout: Layout;
    if (graph) {
        layout = new Layout(graph, 1000, 1000);
    }
    // Read in graph data from local storage
    return <GraphCanvas
        backgroundColor="rgb(255, 250, 231)"
        layout={layout}
        graph={graph}
    />;
}