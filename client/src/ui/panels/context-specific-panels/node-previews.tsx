import { useEffect, useRef } from "react";
import { NodeIconPalette } from "../../utils/node-icon-palette";

export type NodePreviewProps = {
    nodeType: string;
    colour: string;
};

export default function NodePreviews({ nodeType, colour }: NodePreviewProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const nodeIconPalette = new NodeIconPalette();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext("2d");
        if (!context) return;

        context.clearRect(0, 0, canvas.width, canvas.height);

        const x = canvas.width / 2;
        const y = canvas.height / 2;

        context.fillStyle = colour;
        context.beginPath();
        context.arc(x, y, 12, 0, Math.PI * 2);
        context.fill();

        switch (nodeType) {
            case "goal":
                nodeIconPalette.drawGoalIcon(context, x, y, 10, "#fffaf0");
                break;
            case "mission":
                nodeIconPalette.drawMissionIcon(context, x, y, 10, "#fffaf0");
                break;
            case "objective":
                nodeIconPalette.drawObjectiveIcon(context, x, y, 10, "#fffaf0");
                break;
            case "action":
                nodeIconPalette.drawActionIcon(context, x, y, 10, "#fffaf0");
                break;
            default:
                break;
        }
    }, []);

    return (
        <canvas
            ref={canvasRef}
            width={24}
            height={24}
        />
    );
}