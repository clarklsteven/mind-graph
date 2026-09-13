import { getGraphs, loadGraph } from "../../client/src/api/graphs";
import type { GraphEntry } from "../../client/src/api/graphs";
import type { GraphData } from "../../client/src/core/model/graph-data";

export class GraphTestHelper {
    async graphExists(name: string): Promise<boolean> {
        const graphs = await getGraphs();
        const graph = graphs.find((g: GraphEntry) => g.name === name);
        return graph ? true : false;
    }

    async getGraph(name: string): Promise<GraphData | null> {
        const graphData = await loadGraph(name);
        if (graphData) return graphData;
        else return null;
    }

    async deleteGraph(name: string): Promise<void> {
        const parsedName = name.replace(/\s+/g, "-").replace(/\.json$/, "");
        await fetch(`http://localhost:3000/graphs/${parsedName}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        });
    }

    normaliseName(name: string): string {
        const normalisedName = name.replace(/ /g, "-");
        return normalisedName;
    }
}