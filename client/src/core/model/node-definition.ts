export interface NodePropertyDefinition {
    id: string;
    label: string;
    valueType: "string" | "number" | "boolean" | "paragraph";
    required: boolean;
    defaultValue?: unknown;
}

export interface NodeDefinition {
    id: string;
    label: string;
    isDefault?: boolean;
    iconId?: string;
    properties?: NodePropertyDefinition[];
    completeness?: {
        requiredFields: string[];
    }
}