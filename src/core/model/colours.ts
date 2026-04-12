import { ColourPalette } from "./palette";

interface Colour {
    r: number;
    g: number;
    b: number;
}

export class Colours {

    private static parseColour(colour: string): Colour | null {
        if (colour.startsWith("#")) {
            const bigint = parseInt(colour.slice(1), 16);
            return {
                r: (bigint >> 16) & 255,
                g: (bigint >> 8) & 255,
                b: bigint & 255
            };
        } else if (colour.startsWith("rgb(")) {
            const parts = colour.slice(4, -1).split(",").map(part => parseInt(part.trim()));
            return { r: parts[0], g: parts[1], b: parts[2] };
        }
        return null;
    }

    static getColourForNode(weight: number, colourPalette: ColourPalette): string {

        const r = Math.round(this.parseColour(colourPalette.baseDark)!.r + (this.parseColour(colourPalette.baseLight)!.r - this.parseColour(colourPalette.baseDark)!.r) * (1 - weight));
        const g = Math.round(this.parseColour(colourPalette.baseDark)!.g + (this.parseColour(colourPalette.baseLight)!.g - this.parseColour(colourPalette.baseDark)!.g) * (1 - weight));
        const b = Math.round(this.parseColour(colourPalette.baseDark)!.b + (this.parseColour(colourPalette.baseLight)!.b - this.parseColour(colourPalette.baseDark)!.b) * (1 - weight));
        return `rgb(${r}, ${g}, ${b})`;
    }
}