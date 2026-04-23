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
        const parsedBaseDark = this.parseColour(colourPalette.baseDark);
        const parsedBaseLight = this.parseColour(colourPalette.baseLight);

        if (!parsedBaseDark || !parsedBaseLight) {
            console.warn(`Invalid colour format in palette: ${colourPalette.baseDark} or ${colourPalette.baseLight}`);
            return 'rgb(null, null, null)';
        }
        const r = Math.round(parsedBaseDark.r + (parsedBaseLight.r - parsedBaseDark.r) * (1 - weight));
        const g = Math.round(parsedBaseDark.g + (parsedBaseLight.g - parsedBaseDark.g) * (1 - weight));
        const b = Math.round(parsedBaseDark.b + (parsedBaseLight.b - parsedBaseDark.b) * (1 - weight));
        return `rgb(${r}, ${g}, ${b})`;
    }
}