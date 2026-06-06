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

    drawMissionIcon(
        context: CanvasRenderingContext2D,
        x: number,
        y: number,
        size: number,
        color: string
    ): void {
        const armLength = size * 0.42;
        const strokeWidth = Math.max(3, size * 0.12);

        context.save();

        context.translate(x, y);
        context.strokeStyle = color;
        context.lineWidth = strokeWidth;
        context.lineCap = "round";
        context.lineJoin = "round";

        for (let i = 0; i < 3; i++) {
            context.save();

            context.rotate((Math.PI * 2 / 3) * i);

            context.beginPath();

            // Curved outer hook
            context.arc(
                0,
                -size * 0.22,
                size * 0.4,
                Math.PI * 0.95,
                Math.PI * 1.85
            );

            // Connecting stroke towards the centre/next arm
            context.lineTo(armLength * 0.45, size * 0.1);

            context.stroke();

            context.restore();
        }

        context.restore();
    }

    drawObjectiveIcon(
        context: CanvasRenderingContext2D,
        x: number,
        y: number,
        size: number,
        color: string
    ): void {
        const strokeWidth = Math.max(2, size * 0.12);

        context.save();

        context.strokeStyle = color;
        context.lineWidth = strokeWidth;
        context.lineCap = "round";
        context.lineJoin = "round";

        context.beginPath();
        context.moveTo(x - size * 0.1, y + size * 0.5);
        context.lineTo(x - size * 0.1, y - size * 0.5);
        context.lineTo(x + size * 0.3, y - size * 0.25);
        context.lineTo(x - size * 0.1, y);
        context.stroke();
        context.restore();
    }

    drawActionIcon(
        context: CanvasRenderingContext2D,
        x: number,
        y: number,
        size: number,
        color: string
    ): void {
        const strokeWidth = Math.max(2, size * 0.12);

        context.save();

        context.strokeStyle = color;
        context.lineWidth = strokeWidth;
        context.lineCap = "round";
        context.lineJoin = "round";

        context.beginPath();
        for (let i = -1; i <= 1; i++) {
            context.moveTo(x, y + (size * 0.4) * i);
            context.lineTo(x + size * 0.7, y + (size * 0.4) * i);
            context.moveTo(x - size * 0.7, y + (size * 0.4) * i);
            context.lineTo(x - size * 0.5, (y + (size * 0.4) * i) + (size * 0.1));
            context.lineTo(x - size * 0.2, y + (size * 0.4) * i - (size * 0.1));
        }
        context.stroke();
        context.restore();
    }
}
