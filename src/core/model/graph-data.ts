import type { GraphNode } from './node';
import type { Edge } from './edge';
import type { GraphInterpretation } from './graph-interpretation';

export interface GraphData {
  name: string;
  interpretation: string;
  nodes: GraphNode[];
  edges: Edge[];
  graphInterpretation?: GraphInterpretation;
}