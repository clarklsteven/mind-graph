import type { GraphNode } from './node';
import type { Edge } from './edge';
import type { GraphInterpretation } from './graph-interpretation';

export interface GraphLookupSet {
  id: string;
  label: string;
  values: string[];
}

export interface GraphData {
  name: string;
  interpretation: string;
  nodes: GraphNode[];
  edges: Edge[];
  graphInterpretation?: GraphInterpretation;
  lookupSets?: GraphLookupSet[];
}