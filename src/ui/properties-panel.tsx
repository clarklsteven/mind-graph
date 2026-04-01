import React from "react";
import { Graph } from "../core/model/graph";
import { GraphNode } from "../core/model/node";
import { getDangerButtonStyle, getSecondaryButtonStyle } from "./styles";

type PropertiesPanelProps = {
    graph: Graph;
    selectedNodeId: string | null;
    onGraphChanged: () => void;
    onDeleteSelectedNode: () => void;
};

export default function PropertiesPanel({
    graph,
    selectedNodeId,
    onGraphChanged,
    onDeleteSelectedNode,
}: PropertiesPanelProps) {
    const selectedNode: GraphNode | undefined = selectedNodeId
        ? graph.getNode(selectedNodeId)
        : undefined;

    const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!selectedNode) return;

        selectedNode.title = event.target.value;
        onGraphChanged();
    };

    return (
        <aside
            style={{
                backgroundColor: "rgb(245, 239, 217)",
                borderLeft: "1px solid rgb(210, 205, 190)",
                padding: "16px",
                boxSizing: "border-box",
                width: "260px",
                minWidth: "260px",
                height: "100%",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <h2
                style={{
                    marginTop: 0,
                    fontSize: "18px",
                    color: "rgb(70, 50, 60)",
                }}
            >
                Properties
            </h2>

            {!selectedNode ? (
                <div
                    style={{
                        color: "rgb(130, 120, 110)",
                        fontStyle: "italic",
                    }}
                >
                    No node selected
                </div>
            ) : (
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "16px",
                        height: "100%",
                    }}
                >
                    <div>
                        <div
                            style={{
                                fontSize: "12px",
                                fontWeight: 600,
                                color: "rgb(120, 110, 100)",
                                marginBottom: "4px",
                                textTransform: "uppercase",
                                letterSpacing: "0.04em",
                            }}
                        >
                            Node ID
                        </div>
                        <div
                            style={{
                                padding: "8px 10px",
                                border: "1px solid rgb(210, 205, 190)",
                                borderRadius: "8px",
                                backgroundColor: "rgb(236, 231, 214)",
                                color: "rgb(140, 135, 130)",
                                fontFamily: "monospace",
                                fontSize: "13px",
                            }}
                        >
                            {selectedNode.id}
                        </div>
                    </div>

                    <div>
                        <div
                            style={{
                                fontSize: "12px",
                                fontWeight: 600,
                                color: "rgb(120, 110, 100)",
                                marginBottom: "4px",
                                textTransform: "uppercase",
                                letterSpacing: "0.04em",
                            }}
                        >
                            Title
                        </div>
                        <input
                            type="text"
                            value={selectedNode.title}
                            onChange={handleTitleChange}
                            style={{
                                width: "100%",
                                padding: "8px 10px",
                                border: "1px solid rgb(210, 205, 190)",
                                borderRadius: "8px",
                                backgroundColor: "rgb(255, 250, 231)",
                                color: "rgb(70, 50, 60)",
                                fontSize: "14px",
                                boxSizing: "border-box",
                            }}
                        />
                    </div>
                    <div style={{ marginTop: "auto", paddingTop: "16px" }}>
                        <button
                            onClick={onDeleteSelectedNode}
                            style={getDangerButtonStyle()}
                        >
                            Delete Node
                        </button>
                    </div>
                </div>
            )}
        </aside>
    );
}