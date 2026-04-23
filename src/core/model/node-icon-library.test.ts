import { describe, it, expect } from 'vitest';
import { NodeIconLibrary } from './node-icon-library';

describe('NodeIconLibrary', () => {
    describe('getIcon', () => {
        it('should return the correct icon for a valid iconId', () => {
            expect(NodeIconLibrary.getIcon('theory')).toBe('T');
            expect(NodeIconLibrary.getIcon('domain')).toBe('D');
            expect(NodeIconLibrary.getIcon('mechanism')).toBe('⚙');
            expect(NodeIconLibrary.getIcon('enabler')).toBe('E');
            expect(NodeIconLibrary.getIcon('constraint')).toBe('!');
            expect(NodeIconLibrary.getIcon('tool')).toBe('⌘');
            expect(NodeIconLibrary.getIcon('principle')).toBe('△');
            expect(NodeIconLibrary.getIcon('outcome')).toBe('◎');
            expect(NodeIconLibrary.getIcon('grouping')).toBe('□');
            expect(NodeIconLibrary.getIcon('graph_question')).toBe('?');
            expect(NodeIconLibrary.getIcon('graph_action')).toBe('→');
            expect(NodeIconLibrary.getIcon('untyped')).toBe('•');
        });

        it('should return the untyped icon for an invalid iconId', () => {
            expect(NodeIconLibrary.getIcon('invalid')).toBe('•');
            expect(NodeIconLibrary.getIcon('nonexistent')).toBe('•');
        });

        it('should return the untyped icon when iconId is undefined', () => {
            expect(NodeIconLibrary.getIcon(undefined)).toBe('•');
        });

        it('should return the untyped icon when iconId is null', () => {
            expect(NodeIconLibrary.getIcon(null as any)).toBe('•');
        });

        it('should return the untyped icon when iconId is an empty string', () => {
            expect(NodeIconLibrary.getIcon('')).toBe('•');
        });
    });
});