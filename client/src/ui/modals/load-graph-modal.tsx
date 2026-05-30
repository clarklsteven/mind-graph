import { useState, useEffect } from "react";
import { getGraphs } from "../../api/graphs";
import { Modal } from "./modal";
import type { GraphEntry } from "../../api/graphs";

type LoadGraphModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onLoad: (name: string) => void;
};

export function LoadGraphModal({
    isOpen,
    onClose,
    onLoad
}: LoadGraphModalProps) {
    const [availableGraphs, setAvailableGraphs] = useState<GraphEntry[]>([]);
    const [selectedGraph, setSelectedGraph] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadGraphs() {
            try {
                const result = await getGraphs();
                setAvailableGraphs(result);
            } finally {
                setIsLoading(false);
            }
        }

        loadGraphs();
    }, []);

    function graphCard(graphName: string, interpretationType: string, lastModified: string) {
        const name = graphName.split(".")[0].replace(/_/g, " ").replace(/-/g, " ");
        const parsedInterpretationType: string = interpretationType.replace("-graph", "").split("-").map(word => word.charAt(0).toUpperCase()).join("");
        let badgeColour: string = "#888";
        switch (parsedInterpretationType) {
            case "DI":
                badgeColour = "#666666";
                break;
            case "T":
                badgeColour = "#54c45e";
                break;
            case "MM":
                badgeColour = "#6db1ff";
                break;
            case "NS":
                badgeColour = "#00c2a8";
                break;
        }
        const lmDate = new Date(lastModified);
        const dateString = lmDate.toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
        let backgroundColor = "#ffffd0";
        if (selectedGraph === graphName) {
            backgroundColor = "#ffe680";
        }

        return (
            <div key={graphName}
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                    padding: "8px",
                    backgroundColor: backgroundColor,
                    borderRadius: "8px",
                    border: "1px solid #e0d8c8",
                    cursor: "pointer"
                }}
                onClick={() => setSelectedGraph(graphName)}
                onDoubleClick={() => {
                    onLoad(graphName);
                    onClose();
                }}
            >
                <div style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "4px"
                }}>
                    <div
                        className="graph-type-badge"
                        style={{ minWidth: "28px", minHeight: "28px", backgroundColor: badgeColour }}
                    >
                        {parsedInterpretationType}
                    </div>
                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "4px",
                        width: "100%"
                    }}>
                        <div
                            style={{
                                fontSize: "18px",
                                fontWeight: "bold",
                                color: "#005545"
                            }}>
                            {name}
                        </div>
                        <div
                            style={{
                                fontSize: "14px",
                                fontStyle: "italic",
                                color: "#555",
                                alignSelf: "flex-end"
                            }}
                        >
                            Last Modified: {dateString}
                        </div>

                    </div>
                </div>
            </div>
        );
    }

    return (
        <Modal isOpen={isOpen} title="Load Graph" onClose={onClose}>
            <div style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                padding: "12px",
                backgroundColor: "#ffffe7",
                borderRadius: "8px",
                border: "1px solid #e0d8c8"
            }}> {isLoading ? (<div>Loading...</div>) : (
                availableGraphs.map(graph => {
                    return (
                        graphCard(graph.name, graph.interpretation, graph.lastModified)
                    );
                }))}
            </div>
            <div style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-end",
                gap: "8px",
                marginTop: "12px"
            }}>
                <button
                    onClick={onClose}
                    style={{
                        padding: "6px 12px",
                        backgroundColor: "#e0d8c8",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer"
                    }}
                >
                    Cancel
                </button>
                <button
                    onClick={() => {
                        onLoad(selectedGraph || "");
                        onClose();
                    }}
                    style={{
                        padding: "6px 12px",
                        backgroundColor: "#00332a",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer"
                    }}
                >
                    Load
                </button>
            </div>
        </Modal>
    );
}