import { describe, it, expect } from 'vitest';
import { Colours } from './colours';

describe('Colours', () => {
    let colourPalette = {
        baseDark: "#005545",
        baseLight: "#80a896",
        selected: "#ffeb3b",
        hovered: "#00bcd4",
        linkStart: "#f44336"
    };

    it('should return the correct colour for a given weight', () => {
        expect(Colours.getColourForNode(1, colourPalette)).toBe('rgb(0, 85, 69)');
        expect(Colours.getColourForNode(0.5, colourPalette)).toBe('rgb(64, 127, 110)');
        expect(Colours.getColourForNode(0, colourPalette)).toBe('rgb(128, 168, 150)');
    });

    it('should return a valid RGB string', () => {
        const colour = Colours.getColourForNode(0.3, colourPalette);
        expect(colour).toMatch(/^rgb\(\d{1,3}, \d{1,3}, \d{1,3}\)$/);
    });

    it('should work with rgb() colour formats in the palette', () => {
        const rgbColourPalette = {
            baseDark: "rgb(0, 85, 69)",
            baseLight: "rgb(128, 168, 150)",
            selected: "rgb(255, 235, 59)",
            hovered: "rgb(0, 188, 212)",
            linkStart: "rgb(244, 67, 54)"
        };
        expect(Colours.getColourForNode(0.5, rgbColourPalette)).toBe('rgb(64, 127, 110)');
    });

    it('should return null for invalid colour formats', () => {
        // @ts-ignore
        expect(Colours.getColourForNode(0.5, { baseDark: "invalid", baseLight: "invalid", selected: "invalid", hovered: "invalid", linkStart: "invalid" })).toBe('rgb(null, null, null)');
    });
});