export interface ColourPalette {
    baseDark: string;
    baseLight: string;
    selected: string;
    hovered: string;
    linkStart: string;
}

export interface InterpretationPalette {
    nodePalettes: Record<string, ColourPalette>;
}

export class InterpretationPaletteManager {
    private interpretationPalette: InterpretationPalette;

    constructor(interpretationPalette: InterpretationPalette) {
        this.interpretationPalette = interpretationPalette;
    }

    getColourPaletteForNodeType(nodeType: string): ColourPalette {
        return this.interpretationPalette.nodePalettes[nodeType] ?? this.getDefaultPalette();
    }

    private getDefaultPalette(): ColourPalette {
        return {
            baseDark: "#333",
            baseLight: "#eee",
            selected: "#ff0",
            hovered: "#0ff",
            linkStart: "#f00"
        };
    }
}