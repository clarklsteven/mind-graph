import { NodeDefinition } from './node-definition';
import { InterpretationPalette } from './palette';
import { RelationshipDefinition } from './relationship-definition';

export interface GraphInterpretation {
    id: string;
    interpretation_type: string;
    relationship_definitions: RelationshipDefinition[];
    node_definitions?: NodeDefinition[];
    interpretation_palette?: InterpretationPalette;
}