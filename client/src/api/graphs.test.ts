import { describe, it, expect, vi, afterEach } from "vitest";
import { getGraphs, loadGraph, saveGraph, updateGraph } from "./graphs";

afterEach(() => {
    vi.restoreAllMocks();
});

describe("client/api/graphs", () => {
    it("fetches the list of graphs and returns the graphs array", async () => {
        const expectedGraphs = [
            { name: "my-graph", interpretation: "mind-map-graph", lastModified: "2026-06-01T12:00:00.000Z" }
        ];
        const fetchMock = vi.fn().mockResolvedValue({
            json: vi.fn().mockResolvedValue({ graphs: expectedGraphs })
        });

        vi.stubGlobal("fetch", fetchMock);

        const actual = await getGraphs();

        expect(fetchMock).toHaveBeenCalledOnce();
        expect(fetchMock).toHaveBeenCalledWith("http://localhost:3000/graphs");
        expect(actual).toEqual(expectedGraphs);
    });

    it("loads a named graph and returns the graph payload", async () => {
        const responseGraph = {
            name: "my-graph",
            interpretation: "mind-map-graph",
            nodes: [],
            edges: []
        };
        const fetchMock = vi.fn().mockResolvedValue({
            json: vi.fn().mockResolvedValue({ status: "ok", name: "my-graph", graph: responseGraph })
        });

        vi.stubGlobal("fetch", fetchMock);

        const actual = await loadGraph("my graph.json");

        expect(fetchMock).toHaveBeenCalledOnce();
        expect(fetchMock).toHaveBeenCalledWith("http://localhost:3000/graphs/my-graph", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });
        expect(actual).toEqual(responseGraph);
    });

    it("saves a graph by posting to the graphs endpoint and returns a GraphEntry", async () => {
        const graphData = {
            name: "my-graph",
            interpretation: "mind-map-graph",
            nodes: [],
            edges: []
        };
        const fetchMock = vi.fn().mockResolvedValue({});

        vi.stubGlobal("fetch", fetchMock);

        const entry = await saveGraph("My Graph.json", graphData);

        expect(fetchMock).toHaveBeenCalledOnce();
        expect(fetchMock).toHaveBeenCalledWith("http://localhost:3000/graphs", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name: "My-Graph", graphData })
        });
        expect(entry).toEqual({
            name: "My-Graph",
            interpretation: "mind-map-graph",
            lastModified: expect.any(String)
        });
    });

    it("updates a graph by sending a PUT request and returns a GraphEntry", async () => {
        const graphData = {
            name: "sample-graph",
            interpretation: "mind-map-graph",
            nodes: [],
            edges: []
        };
        const fetchMock = vi.fn().mockResolvedValue({});

        vi.stubGlobal("fetch", fetchMock);

        const entry = await updateGraph("sample graph.json", graphData);

        expect(fetchMock).toHaveBeenCalledOnce();
        expect(fetchMock).toHaveBeenCalledWith("http://localhost:3000/graphs/sample-graph", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(graphData)
        });
        expect(entry).toEqual({
            name: "sample-graph",
            interpretation: "mind-map-graph",
            lastModified: expect.any(String)
        });
    });
});
