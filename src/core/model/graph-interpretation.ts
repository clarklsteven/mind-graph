import { NodeDefinition } from './node-definition';
import { RelationshipDefinition } from './relationship-definition';

export interface GraphInterpretation {
    id: string;
    label: string;
    relationshipDefinitions: RelationshipDefinition[];
    nodeDefinitions?: NodeDefinition[];
}