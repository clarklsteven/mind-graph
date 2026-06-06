export class EdgeIconPalette {
    drawDirectedEdgeIcon(
        context: CanvasRenderingContext2D,
        x: number,
        y: number,
        width: number,
        color: string
    ): void {
        const nodeRadius = 2;
        const arrowSize = 4;

        const startX = x - width / 2;
        const endX = x + width / 2;

        context.save();

        context.strokeStyle = "black";
        context.fillStyle = color;
        context.lineWidth = 1;

        // Start node
        context.beginPath();
        context.arc(startX, y, nodeRadius, 0, Math.PI * 2);
        context.stroke();

        // End node
        context.beginPath();
        context.arc(endX, y, nodeRadius, 0, Math.PI * 2);
        context.stroke();

        // Line
        const lineStartX = startX + nodeRadius + 2;
        const lineEndX = endX - nodeRadius - arrowSize;

        context.strokeStyle = color;
        context.fillStyle = color;
        context.beginPath();
        context.moveTo(lineStartX, y);
        context.lineTo(lineEndX, y);
        context.stroke();

        // Arrowhead
        context.beginPath();
        context.moveTo(lineEndX + arrowSize, y);
        context.lineTo(lineEndX, y - arrowSize / 2);
        context.lineTo(lineEndX, y + arrowSize / 2);
        context.closePath();
        context.fill();

        context.restore();
    }
}