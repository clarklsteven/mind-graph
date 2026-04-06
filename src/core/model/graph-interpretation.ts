import { NodeDefinition } from './node-definition';
import { RelationshipDefinition } from './relationship-definition';

export interface GraphInterpretation {
    id: string;
    interpretation_type: string;
    relationship_definitions: RelationshipDefinition[];
    node_definitions?: NodeDefinition[];
}