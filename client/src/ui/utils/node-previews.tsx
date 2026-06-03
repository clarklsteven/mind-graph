import { useEffect, useRef } from "react";
import { NodeIconPalette } from "./node-icon-palette";

export default function GoalNodePreview() {
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

        context.fillStyle = "green";
        context.beginPath();
        context.arc(x, y, 12, 0, Math.PI * 2);
        context.fill();

        nodeIconPalette.drawGoalIcon(context, x, y, 10, "#fffaf0");
    }, []);

    return (
        <canvas
            ref={canvasRef}
            width={24}
            height={24}
        />
    );
}