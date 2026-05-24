export interface RelationshipDefinition {
    id: string;
    label: string;
    isDefault?: boolean;
    directed: boolean;
    hierarchical: boolean;
    parentEnd: "source" | "target" | null;
    childEnd: "source" | "target" | null;
    singleParent: boolean | null;
    allowsCycles: boolean | null;
    sourceWeightConsidered?: boolean | null;
    targetWeightConsidered?: boolean | null;
    sourceWeightMultiplier?: number | null;
    targetWeightMultiplier?: number | null;
}