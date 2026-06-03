export class NodeIconPalette {
    drawGoalIcon(
        context: CanvasRenderingContext2D,
        x: number,
        y: number,
        size: number,
        color: string
    ): void {
        context.save();

        context.strokeStyle = color;
        context.lineWidth = Math.max(2, size * 0.1);
        context.lineWidth = Math.max(2, size * 0.1);

        context.beginPath();
        context.arc(x, y, size * 0.7, 0, Math.PI * 2);
        context.stroke();

        context.beginPath();
        context.arc(x, y, size * 0.45, 0, Math.PI * 2);
        context.stroke();

        context.beginPath();
        context.arc(x, y, size * 0.2, 0, Math.PI * 2);
        context.fillStyle = color;
        context.fill();

        context.restore();
    }
}