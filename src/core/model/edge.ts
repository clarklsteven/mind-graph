export type EdgeType = "Relates To" | "Theme Of" | "Contains";

export interface RelationshipDefinition {
  id: string;
  label: string;
  directed: boolean;
  hierarchical: boolean;
  parentEnd: "source" | "target" | null;
  childEnd: "source" | "target" | null;
  singleParent: boolean | null;
  allowsCycles: boolean | null;
}

export interface Edge {
  id: string;
  from: string;
  to: string;
  type: EdgeType;
}
