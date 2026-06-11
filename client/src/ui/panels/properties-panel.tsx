import React from "react";
import type { Graph } from "../../core/model/graph";
import type { GraphNode } from "../../core/model/node";
import { getDangerButtonStyle, getPropertyLabelStyle, getPropertyDisplayStyle, getPropertyInputStyle, getPropertyDropdownStyle } from "../utils/styles";
import { useEffect, useRef } from "react";
import type { GraphInterpretation, InterpretationOptionSet } from "../../core/model/graph-interpretation";
import type { NodeDefinition } from "../../core/model/node-definition";
import { asiguraPalette } from "../utils/asigura-palette";
import type { GraphLookupSet } from "../../core/model/graph-data";

export type PropertiesPanelProps = {
    graph: Graph;
    selectedNodeId: string | null;
    selectedEdgeId: string | null;
    onGraphChanged: () => void;
    onDeleteSelectedNode: () => void;
    onDeleteSelectedEdge: () => void;
    interpretation: GraphInterpretation | null;
};

export default function PropertiesPanel({
    graph,
    selectedNodeId,
    selectedEdgeId,
    onGraphChanged,
    onDeleteSelectedNode,
    onDeleteSelectedEdge,
    interpretation
}: PropertiesPanelProps) {
    const selectedNode: GraphNode | undefined = selectedNodeId
        ? graph.getNode(selectedNodeId)
        : undefined;

    const selectedEdge = selectedEdgeId
        ? graph.getEdge(selectedEdgeId)
        : undefined;

    const nodeDefinition = interpretation ?
        interpretation?.node_definitions ?
            interpretation.node_definitions.find((def: NodeDefinition) => def.id === selectedNode?.type) :
            undefined : undefined;

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

    let propertiesComponents: React.ReactNode = (<div>No properties</div>);
    if (selectedNode && selectedNode.properties && nodeDefinition && nodeDefinition.properties && nodeDefinition.properties.length > 0) {
        propertiesComponents =
            nodeDefinition.properties.map((property) => {
                let value = String(selectedNode.properties?.[property.id] ?? "");
                if (property.defaultValue && value === "") value = property.defaultValue as string;

                if (property.valueType === "string") {
                    const readonly: boolean = property.editable !== undefined && !property.editable;
                    return (
                        <div>
                            <div
                                key={property.id}
                                style={getPropertyLabelStyle()}>
                                {property.label}
                            </div>
                            <input
                                type="text"
                                value={value}
                                style={getPropertyInputStyle()}
                                onChange={(e) => {
                                    selectedNode.properties![property.id] = e.target.value;
                                    onGraphChanged();
                                }}
                                readOnly={readonly}
                            />
                        </div>
                    );
                } else if (property.valueType === "paragraph") {
                    return (
                        <div>
                            <div
                                key={property.id}
                                style={getPropertyLabelStyle()}>
                                {property.label}
                            </div>
                            <textarea
                                value={value}
                                style={{ ...getPropertyInputStyle(), height: "80px", resize: "vertical" }}
                                onChange={(e) => {
                                    selectedNode.properties![property.id] = e.target.value;
                                    onGraphChanged();
                                }}
                            />
                        </div>
                    );
                } else if (property.valueType === "option") {
                    // Get the property options
                    let options: string[] = [""];
                    const currentValue: string = selectedNode.properties![property.id] as string;
                    if (property.optionSource && property.optionSource.type === "interpretationOptionSet") {
                        // Get the options from the interpretation
                        const optionSet: InterpretationOptionSet | undefined = interpretation?.option_sets?.filter((optionSet: InterpretationOptionSet) => optionSet.id === property.id)[0];
                        options = ["", ...(optionSet?.values ?? [])];
                    } else if (property.optionSource && property.optionSource.type === "graphLookupSet") {
                        const optionSet: GraphLookupSet | undefined = graph.getLookupSets().filter((lookupSet: GraphLookupSet) => lookupSet.id === property.id)[0];
                        options = ["", ...(optionSet?.values ?? [])];
                    }
                    const currentOption = options.find((option: string) => option.toLowerCase() === currentValue.toLowerCase());
                    return (
                        <div>
                            <div
                                key={property.id}
                                style={getPropertyLabelStyle()}>
                                {property.label}
                            </div>
                            <select
                                value={currentOption}
                                onChange={(e) => {
                                    selectedNode.properties![property.id] = e.target.value;
                                    onGraphChanged();
                                }}
                                style={getPropertyDropdownStyle()}
                            >
                                {(options ?? []).map((option: string) => (
                                    <option key={option} value={option}>
                                        {option.charAt(0).toUpperCase() + option.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )
                }

                return null;
            })
    }

    let nodeType: React.ReactNode = null;
    if (interpretation?.capabilities?.nodeTypeEditable) {
        const selectedNode = graph.getNodes().find(n => n.id === selectedNodeId);
        if (selectedNode) {
            nodeType = (<div>
                <div style={getPropertyLabelStyle()}>Node Type</div>
                <select
                    value={selectedNode.type}
                    onChange={(e) => {
                        selectedNode.type = e.target.value;
                        onGraphChanged();
                    }}
                    style={getPropertyDropdownStyle()}
                >
                    {(interpretation?.node_definitions ?? []).map((def) => (
                        <option key={def.id} value={def.id}>
                            {def.label}
                        </option>
                    ))}
                </select>
            </div>
            );
        }
    }

    let theSelectedEdge = selectedEdge;
    if (!interpretation?.capabilities?.edgePropertiesEditable) {
        theSelectedEdge = undefined;
    }

    return (
        <aside
            style={{
                backgroundColor: asiguraPalette["asigura-8"],
                borderLeft: "1px solid " + asiguraPalette["asigura-7"],
                padding: "16px",
                boxSizing: "border-box",
                width: "260px",
                minWidth: "260px",
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
                    {nodeType}
                    {propertiesComponents}
                    <div style={{ marginTop: "auto", paddingTop: "16px" }}>
                        <button
                            onClick={onDeleteSelectedNode}
                            style={getDangerButtonStyle()}
                        >
                            Delete Node
                        </button>
                    </div>
                </div>
            ) : theSelectedEdge ? (
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "16px",
                    }}
                >
                    <div
                        style={getPropertyLabelStyle()}
                    >
                        <div>Edge ID</div>
                        <div style={getPropertyDisplayStyle()}>
                            {theSelectedEdge.id}
                        </div>
                    </div>
                    <div>
                        <div style={getPropertyLabelStyle()}>Type</div>
                        <select
                            value={theSelectedEdge.type}
                            onChange={(e) => {
                                theSelectedEdge.type = e.target.value;
                                onGraphChanged();
                            }}
                            style={getPropertyDropdownStyle()}
                        >
                            {(interpretation?.relationship_definitions ?? []).map((def) => (
                                <option key={def.id} value={def.id}>
                                    {def.label}
                                </option>
                            ))}
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