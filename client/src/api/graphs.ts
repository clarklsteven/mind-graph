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

export function saveGraph(name: string, graphData: GraphData): Promise<{ success: boolean; error?: string }> {
    return fetch(`http://localhost:3000/graphs/save`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, graphData })
    })
        .then(response => response.json());
}