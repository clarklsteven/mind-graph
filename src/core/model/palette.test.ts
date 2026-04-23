import { describe, it, expect } from 'vitest';
import { InterpretationPaletteManager, ColourPalette, InterpretationPalette } from './palette';

describe('InterpretationPaletteManager', () => {
    const mockPalette: InterpretationPalette = {
        nodePalettes: {
            'nodeType1': {
                baseDark: '#000',
                baseLight: '#fff',
                selected: '#00f',
                hovered: '#0f0',
                linkStart: '#f0f'
            },
            'nodeType2': {
                baseDark: '#111',
                baseLight: '#ddd',
                selected: '#ff0',
                hovered: '#0ff',
                linkStart: '#f00'
            }
        }
    };

    const manager = new InterpretationPaletteManager(mockPalette);

    describe('constructor', () => {
        it('should initialize with the provided interpretationPalette', () => {
            const newManager = new InterpretationPaletteManager(mockPalette);
            expect(newManager).toBeInstanceOf(InterpretationPaletteManager);
        });
    });

    describe('getColourPaletteForNodeType', () => {
        it('should return the correct palette for an existing nodeType', () => {
            const result = manager.getColourPaletteForNodeType('nodeType1');
            expect(result).toEqual(mockPalette.nodePalettes['nodeType1']);
        });

        it('should return the default palette for a non-existing nodeType', () => {
            const result = manager.getColourPaletteForNodeType('nonExistingType');
            const expectedDefault: ColourPalette = {
                baseDark: '#333',
                baseLight: '#eee',
                selected: '#ff0',
                hovered: '#0ff',
                linkStart: '#f00'
            };
            expect(result).toEqual(expectedDefault);
        });

        it('should return the default palette when nodePalettes is empty', () => {
            const emptyPalette: InterpretationPalette = { nodePalettes: {} };
            const emptyManager = new InterpretationPaletteManager(emptyPalette);
            const result = emptyManager.getColourPaletteForNodeType('anyType');
            const expectedDefault: ColourPalette = {
                baseDark: '#333',
                baseLight: '#eee',
                selected: '#ff0',
                hovered: '#0ff',
                linkStart: '#f00'
            };
            expect(result).toEqual(expectedDefault);
        });

        it('should handle undefined nodeType gracefully', () => {
            const result = manager.getColourPaletteForNodeType(undefined as any);
            const expectedDefault: ColourPalette = {
                baseDark: '#333',
                baseLight: '#eee',
                selected: '#ff0',
                hovered: '#0ff',
                linkStart: '#f00'
            };
            expect(result).toEqual(expectedDefault);
        });
    });
});