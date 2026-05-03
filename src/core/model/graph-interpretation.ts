import { NodeDefinition } from './node-definition';
import { InterpretationPalette } from './palette';
import { RelationshipDefinition } from './relationship-definition';

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
    relationship_definitions: RelationshipDefinition[];
    node_definitions?: NodeDefinition[];
    interpretation_palette?: InterpretationPalette;
    helpMarkdown?: string;
    capabilities?: InterpretationCapabilities;
}