import type { NodeDefinition } from './node-definition';
import type { InterpretationPalette } from './palette';
import type { RelationshipDefinition } from './relationship-definition';

export interface InterpretationOptionSet {
    id: string;
    label: string;
    values: string[];
}

export interface InterpretationCapabilities {
    manualNodeCreation?: boolean;
    manualEdgeCreation?: boolean;
    nodeTypeEditable?: boolean;
    nodePropertiesEditable?: boolean;
    edgePropertiesEditable?: boolean;
    missingPropertiesIndicators?: boolean;
}

export interface GraphInterpretation {
    id: string;
    interpretation_type: string;
    label: string;
    schema_type: string;
    relationship_definitions?: RelationshipDefinition[];
    node_definitions?: NodeDefinition[];
    interpretation_palette?: InterpretationPalette;
    helpMarkdown?: string;
    capabilities?: InterpretationCapabilities;
    option_sets?: InterpretationOptionSet[];
}