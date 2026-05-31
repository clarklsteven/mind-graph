import { Router } from "express";
import { Graphs } from "../graphs/graphs";

const router = Router();
const graphs = new Graphs();

// Get a list of all graphs
router.get("/", async (_req, res) => {
    const graphList = await graphs.getGraphs();
    res.status(200).json({
        status: "ok",
        graphs: graphList
    });
});

// Get a specific graph by name
router.get("/:name", async (_req, res) => {
    const graphName = _req.params.name;
    const graph = await graphs.getGraph(graphName);

    if (!graph) {
        res.status(404).json({
            status: "error",
            message: "Graph not found"
        });
        return;
    }

    res.status(200).json({
        status: "ok",
        name: _req.params.name,
        graph: graph
    });
});

// Create a new graph
router.post("/", async (_req, res) => {
    const graphData = _req.body.graphData;
    if (!graphData || !graphData.name) {
        res.status(400).json({
            status: "error",
            message: "Graph data with a valid name is required"
        });
        return;
    }
    if (!graphs.validateGraphName(graphData.name)) {
        res.status(400).json({
            status: "error",
            message: "Invalid graph name"
        });
        return;
    }
    const newGraph = await graphs.createGraph(graphData);
    res.status(200).json({
        status: "ok",
        name: _req.body.name,
        graph: newGraph
    });
});

// Update a graph
router.put("/:name", async (_req, res) => {
    const graphName = _req.params.name;
    const graph = _req.body;
    const updatedGraph = await graphs.updateGraph(graphName, graph);
    res.status(200).json({
        status: "ok",
        name: _req.params.name,
        graph: updatedGraph
    });
});

export default router;