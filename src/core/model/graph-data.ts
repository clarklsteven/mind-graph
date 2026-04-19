import { GraphNode } from './node';
import { Edge } from './edge';
import { GraphInterpretation } from './graph-interpretation';

export interface GraphData {
  name: string;
  interpretation: string;
  nodes: GraphNode[];
  edges: Edge[];
  graphInterpretation?: GraphInterpretation;
}