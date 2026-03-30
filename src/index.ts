import { Graph } from "./core/model/graph";
import { GraphNode } from "./core/model/node";
import { Edge } from "./core/model/edge";
import fs from "node:fs";

const graph = new Graph();

const nodeA: GraphNode = { id: "1", title: "Quality" };
const nodeB: GraphNode = { id: "2", title: "Process" };

graph.addNode(nodeA);
graph.addNode(nodeB);

const edge: Edge = {
  id: "e1",
  from: "1",
  to: "2",
  type: "influences"
};

graph.addEdge(edge);

let graphData = graph.export();
fs.writeFileSync("graph-data.json", JSON.stringify(graphData, null, 2));