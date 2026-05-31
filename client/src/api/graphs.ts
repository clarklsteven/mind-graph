import type { GraphData } from "../core/model/graph-data";

interface LoadGraphResponse {
    status: string;
    name: string;
    graph: GraphData;
}


export type GraphEntry = {
    name: string;
    interpretation: string;
    lastModified: string;
};

export function getGraphs(): Promise<GraphEntry[]> {
    return fetch("http://localhost:3000/graphs")
        .then(response => response.json())
        .then(data => data.graphs);
}

export async function loadGraph(name: string): Promise<GraphData> {
    const parsedName = name.replace(/\s+/g, "-").replace(/\.json$/, "");
    const response = await fetch(`http://localhost:3000/graphs/${parsedName}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });
    const data = await response.json() as LoadGraphResponse;
    return data.graph;
}

export async function saveGraph(name: string, graphData: GraphData): Promise<GraphEntry> {
    const parsedName = name.replace(/\s+/g, "-").replace(/\.json$/, "");
    await fetch(`http://localhost:3000/graphs`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ name: parsedName, graphData })
    });
    return {
        name: parsedName,
        interpretation: graphData.interpretation,
        lastModified: new Date().toISOString()
    };
}

export async function updateGraph(name: string, graphData: GraphData): Promise<GraphEntry> {
    const parsedName = name.replace(/\s+/g, "-").replace(/\.json$/, "");
    await fetch(`http://localhost:3000/graphs/${parsedName}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(graphData)
    });
    return {
        name: parsedName,
        interpretation: graphData.interpretation,
        lastModified: new Date().toISOString()
    };
}