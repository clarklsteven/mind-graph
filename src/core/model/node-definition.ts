export interface NodePropertyDefinition {
    id: string;
    label: string;
    valueType: "string" | "number" | "boolean";
    required: boolean;
    defaultValue?: unknown;
}

export interface NodeDefinition {
    id: string;
    label: string;
    properties?: NodePropertyDefinition[];
}