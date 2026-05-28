import type { GraphData } from "../../../client/src/core/model/graph-data";
import { UserSettings } from "../user/user-settings";
import type { UserSettingsInterface } from "../model/user-settings";
import fs from "fs";

export class Graphs {
    private userSettings: UserSettings;

    constructor() {
        this.userSettings = new UserSettings();
    }

    async getGraphs(): Promise<string[]> {
        let graphs: string[] = [];
        const settings: UserSettingsInterface = await this.userSettings.getSettings();
        if (!settings.vaultPath) {
            return [];
        }
        else {
            const graphsPath = `${settings.vaultPath}/Mind Graphs`;
            if (fs.existsSync(graphsPath) && fs.lstatSync(graphsPath).isDirectory()) {
                graphs = fs.readdirSync(graphsPath).filter(file => fs.lstatSync(`${graphsPath}/${file}`).isFile());
            }
        }
        return graphs;
    }

    async getGraph(name: string): Promise<GraphData | null> {
        const settings = await this.userSettings.getSettings();
        // Check for vault path and graph file existence, then read and parse the graph file to return a Graph object
        if (settings.vaultPath) {
            const graphPath = `${settings.vaultPath}/Mind Graphs/${name}.json`;
            if (fs.existsSync(graphPath) && fs.lstatSync(graphPath).isFile()) {
                const graphData = fs.readFileSync(graphPath, "utf-8");
                // Parse the graph data and return a Graph object
                let graph: GraphData;
                try {
                    graph = JSON.parse(graphData);
                    return graph;
                } catch (error) {
                    console.error(`Error parsing graph file ${graphPath}:`, error);
                    return null;
                }
            }
        }
        return null;
    }

    async createGraph(name: string, interpretationType: string): Promise<GraphData | null> {
        const settings = await this.userSettings.getSettings();
        // Check for vault path existence, and whether there is already a graph with the given name
        // If not, create a new graph file with the given name and return a Graph object
        if (settings.vaultPath) {
            const graphPath = `${settings.vaultPath}/Mind Graphs/${name}.json`;
            if (!fs.existsSync(graphPath)) {
                // Create a new graph file
                const graph: GraphData = {
                    name,
                    interpretation: interpretationType,
                    nodes: [],
                    edges: []
                };
                fs.writeFileSync(graphPath, JSON.stringify(graph));
                return graph;
            }
        }
        return null;
    }

    async updateGraph(name: string, graph: GraphData): Promise<GraphData | null> {
        const settings = await this.userSettings.getSettings();
        // Check for vault path and graph file existence, then overwrite the graph file with the new graph data and return the updated Graph object
        if (settings.vaultPath) {
            const graphPath = `${settings.vaultPath}/Mind Graphs/${name}.json`;
            if (fs.existsSync(graphPath) && fs.lstatSync(graphPath).isFile()) {
                // Check that the graph name and interpretation type are not being changed in the update, as these should be immutable properties of the graph
                const existingGraphData = fs.readFileSync(graphPath, "utf-8");
                let existingGraph: GraphData;
                try {
                    existingGraph = JSON.parse(existingGraphData);
                } catch (error) {
                    console.error(`Error parsing existing graph file ${graphPath}:`, error);
                    return null;
                }
                if (graph.name !== existingGraph.name || graph.interpretation !== existingGraph.interpretation) {
                    console.error(`Attempted to change immutable properties of graph ${name}`);
                    return null;
                }
                fs.writeFileSync(graphPath, JSON.stringify(graph));
                return graph;
            }
        }
        return null;
    }
}