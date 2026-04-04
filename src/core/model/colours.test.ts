import { describe, it, expect } from 'vitest';
import { Colours } from './colours';

describe('Colours', () => {
    it('should return the correct colour for a given weight', () => {
        expect(Colours.getColourForNode(10)).toBe('rgb(0, 85, 69)');
        expect(Colours.getColourForNode(5)).toBe('rgb(64, 127, 110)');
        expect(Colours.getColourForNode(0)).toBe('rgb(128, 168, 150)');
    });

    it('should return a valid RGB string', () => {
        const colour = Colours.getColourForNode(3);
        expect(colour).toMatch(/^rgb\(\d{1,3}, \d{1,3}, \d{1,3}\)$/);
    });
});