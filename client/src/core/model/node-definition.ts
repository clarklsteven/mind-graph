export type PropertyOptionSource =
    | { type: "interpretationOptionSet"; optionSetId: string }
    | { type: "graphLookupSet"; lookupSetId: string };

export interface NodePropertyDefinition {
    id: string;
    label: string;
    valueType: "string" | "number" | "boolean" | "paragraph" | "option" | "list" | "reference";
    required: boolean;
    editable?: boolean;
    defaultValue?: unknown;
    optionSource?: PropertyOptionSource;
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