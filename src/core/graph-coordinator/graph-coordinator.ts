import { GraphRenderer } from "../../ui/renderers/graph-renderer";
import { Interpretation } from "../interpretation/interpretation";
import { Layout } from "../layout/layout";
import { Graph } from "../model/graph";
import { GraphInterpretation } from "../model/graph-interpretation";

export class GraphCoordinator {
    private graph?: Graph;
    private interpretation: Interpretation;
    private layout?: Layout;
    private renderer?: GraphRenderer;

    constructor(interpretation: Interpretation) {
        this.interpretation = interpretation;
        this.setGraph(new Graph());
        this.setLayout(new Layout(this.graph!, 1000, 1000));
    }

    getGraph(): Graph | undefined {
        return this.graph;
    }

    setGraph(graph: Graph) {
        this.graph = graph;
    }

    getInterpretation(): Interpretation {
        return this.interpretation;
    }

    setInterpretation(interpretation: Interpretation) {
        this.interpretation = interpretation;
    }

    getLayout(): Layout | undefined {
        return this.layout;
    }

    setLayout(layout: Layout) {
        this.layout = layout;
    }

    getRenderer(): GraphRenderer | undefined {
        return this.renderer;
    }

    setRenderer(renderer: GraphRenderer) {
        this.renderer = renderer;
    }

    static createGraph(name: string, interpretation: Interpretation) {
        const graphCoordinator = new GraphCoordinator(interpretation);
        graphCoordinator.getGraph()?.setName(name);
        return graphCoordinator;
    }

    normaliseGraph(graph: Graph, interpretation: GraphInterpretation): Graph {
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

    saveGraph() {
        const graphData = this.graph?.export();
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
        if (!this.graph?.getName().includes("Untitled")) {
            outputname = this.graph?.getName().replace(/\s+/g, "-") + "-" + timestamp;
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

    async loadGraph(file: File, interpretationRegistry: Record<string, GraphInterpretation>) {
        if (!file) return;

        const text = await file.text();
        const data = JSON.parse(text);

        if (this.graph) {
            this.graph = this.graph.import(data);
        }
        this.layout = new Layout(this.graph!, 1000, 1000);

        // Import the graph interpretation if it exists
        if (data.interpretation) {
            const interpretation: GraphInterpretation = interpretationRegistry[data.interpretation];
            if (interpretation) {
                this.interpretation = new Interpretation(interpretation);
            } else {
                console.warn(`No specific configuration found for interpretation type: ${data.interpretation}`);
            }
            let normalisedGraph = this.normaliseGraph(
                this.graph!,
                this.interpretation?.getInterpretation()!
            );
            this.graph = normalisedGraph;
            this.layout = new Layout(this.graph!, 1000, 1000);
        }
    };
}