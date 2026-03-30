interface Colour {
    r: number;
    g: number;
    b: number;
}

export class Colours {
    private static darkestColour: Colour = { r: 0, g: 85, b: 69 };
    private static lightestColour: Colour = { r: 255, g: 250, b: 231 };
    private static middleColour: Colour = { r: 128, g: 168, b: 150 };
    private static maxWeight: number = 10;

    static getColourForNode(weight: number): string {

        const r = Math.round(this.darkestColour.r + (this.middleColour.r - this.darkestColour.r) * (1 - weight / this.maxWeight));
        const g = Math.round(this.darkestColour.g + (this.middleColour.g - this.darkestColour.g) * (1 - weight / this.maxWeight));
        const b = Math.round(this.darkestColour.b + (this.middleColour.b - this.darkestColour.b) * (1 - weight / this.maxWeight));
        return `rgb(${r}, ${g}, ${b})`;
    }
}