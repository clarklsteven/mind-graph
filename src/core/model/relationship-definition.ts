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