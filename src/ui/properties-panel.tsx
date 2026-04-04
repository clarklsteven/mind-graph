import React from "react";
import { Graph } from "../core/model/graph";
import { GraphNode } from "../core/model/node";
import { getDangerButtonStyle, getPropertyLabelStyle, getPropertyDisplayStyle, getPropertyInputStyle } from "./styles";
import { useEffect, useRef } from "react";
import { EdgeType } from "../core/model/edge";

type PropertiesPanelProps = {
    graph: Graph;
    selectedNodeId: string | null;
    selectedEdgeId: string | null;
    onGraphChanged: () => void;
    onDeleteSelectedNode: () => void;
    onDeleteSelectedEdge: () => void;
};

export default function PropertiesPanel({
    graph,
    selectedNodeId,
    selectedEdgeId,
    onGraphChanged,
    onDeleteSelectedNode,
    onDeleteSelectedEdge,
}: PropertiesPanelProps) {
    const selectedNode: GraphNode | undefined = selectedNodeId
        ? graph.getNode(selectedNodeId)
        : undefined;

    const selectedEdge = selectedEdgeId
        ? graph.getEdge(selectedEdgeId)
        : undefined;

    const titleInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!selectedNodeId) return;

        const input = titleInputRef.current;
        if (!input) return;

        input.focus();
        requestAnimationFrame(() => {
            input.select();
        });
    }, [selectedNodeId]);

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

            {selectedNode ? (
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
                            style={getPropertyLabelStyle()}
                        >
                            Node ID
                        </div>
                        <div
                            style={getPropertyDisplayStyle()}
                        >
                            {selectedNode.id}
                        </div>
                    </div>
                    <div>
                        <div
                            style={getPropertyLabelStyle()}
                        >
                            Title
                        </div>
                        <input
                            ref={titleInputRef}
                            type="text"
                            value={selectedNode.title}
                            onChange={handleTitleChange}
                            style={getPropertyInputStyle()}
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
            ) : selectedEdge ? (
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "16px",
                        height: "100%",
                    }}
                >
                    <div
                        style={getPropertyLabelStyle()}
                    >
                        <div>Edge ID</div>
                        <div style={getPropertyDisplayStyle()}>
                            {selectedEdge.id}
                        </div>
                    </div>
                    <div>
                        <div style={getPropertyLabelStyle()}>Type</div>
                        <select
                            value={selectedEdge.type}
                            onChange={(event) => {
                                selectedEdge.type = event.target.value as "Relates To" | "Theme Of";
                                onGraphChanged();
                            }}
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
                        >
                            <option value="Relates To">Relates To</option>
                            <option value="Theme Of">Theme Of</option>
                        </select>                    </div>
                    <div style={{ marginTop: "auto", paddingTop: "16px" }}>
                        <button
                            onClick={onDeleteSelectedEdge}
                            style={getDangerButtonStyle()}
                        >
                            Delete Edge
                        </button>
                    </div>
                </div>
            ) : (
                <div
                    style={{
                        color: "rgb(130, 120, 110)",
                        fontStyle: "italic",
                    }}
                >
                    No node selected
                </div>
            )}
        </aside>
    );
}