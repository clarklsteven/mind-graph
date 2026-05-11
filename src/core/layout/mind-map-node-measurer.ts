import { GraphNode, Size } from "../model/node";
import { NodeMeasurer } from "./node-measurer";

export class MindMapNodeMeasurer implements NodeMeasurer {
    constructor(private ctx: CanvasRenderingContext2D) { }

    measure(node: GraphNode): Size {
        const paddingX = 20;
        const paddingY = 12;

        this.ctx.font = "14px sans-serif";

        const textWidth = this.ctx.measureText(node.title).width;

        console.log("Measure");
        return {
            width: textWidth + paddingX * 2,
            height: 14 + paddingY * 2
        };
    }
}