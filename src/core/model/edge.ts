export type EdgeType = "Relates To" | "Theme Of" | "Contains";

export interface Edge {
  id: string;
  from: string;
  to: string;
  type: string;
}
