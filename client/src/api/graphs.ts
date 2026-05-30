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

export function loadGraph(name: string): Promise<any> {
    const parsedName = name.replace(/\s+/g, "-").replace(/\.json$/, "");
    return fetch(`http://localhost:3000/graphs/${parsedName}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(response => response.json());
}

export function saveGraph(name: string, graphData: any): Promise<{ success: boolean; error?: string }> {
    return fetch(`http://localhost:3000/graphs/save`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, graphData })
    })
        .then(response => response.json());
}