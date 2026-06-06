import { useEffect, useRef } from "react";
import { EdgeIconPalette } from "../../utils/edge-icon-palette";

export type EdgePreviewProps = {
    edgeType: string;
};

export default function EdgePreviews({ edgeType }: EdgePreviewProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const edgeIconPalette = new EdgeIconPalette();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext("2d");
        if (!context) return;

        context.clearRect(0, 0, canvas.width, canvas.height);

        const x = canvas.width / 2;
        const y = canvas.height / 2;

        //context.fillStyle = "green";
        //context.beginPath();
        //context.arc(x, y, 12, 0, Math.PI * 2);
        //context.fill();

        switch (edgeType) {
            case "leads_to":
                edgeIconPalette.drawDirectedEdgeIcon(context, x, y, 24, "#01361c");
                break;
            default:
                break;
        }
    }, []);

    return (
        <canvas
            ref={canvasRef}
            width={36}
            height={24}
        />
    );
}