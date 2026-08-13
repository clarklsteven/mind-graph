import { useState } from "react";
import { Modal } from "./modal";
import { getPropertyInputStyle, getPropertyLabelStyle } from "../utils/styles";
import { asiguraPalette } from "../utils/asigura-palette";
import type { GraphInterpretation } from "../../core/model/graph-interpretation";
import type { NodeDefinition } from "../../core/model/node-definition";
import type { RelationshipDefinition } from "../../core/model/relationship-definition";

type PropertySource = "library" | "schema";
type PropertyKind = "node" | "edge";

type CreateFlexibleSchemaModalProps = {
    schemas: GraphInterpretation[];
    isOpen: boolean;
    onClose: () => void;
    onCreate: (schema: GraphInterpretation | null) => void;
};

export default function CreateFlexibleSchemaModal({ schemas, isOpen, onClose, onCreate }: CreateFlexibleSchemaModalProps) {
    const [schemaName, setSchemaName] = useState("");
    const [selectedLibrarySchema, setSelectedLibrarySchema] = useState("");
    const [nodeEdgeMode, setNodeEdgeMode] = useState("nodes");
    const [selectedLibraryNode, setSelectedLibraryNode] = useState("");
    const [selectedLibraryEdge, setSelectedLibraryEdge] = useState("");
    const [selectedSchemaNode, setSelectedSchemaNode] = useState("");
    const [selectedSchemaEdge, setSelectedSchemaEdge] = useState("");
    const [visibleProperties, setVisibleProperties] = useState<string[]>([]);
    const [flexibleSchema, setFlexibleSchema] = useState<GraphInterpretation | null>(null);

    if (isOpen && !flexibleSchema) {
        setFlexibleSchema({
            id: "",
            interpretation_type: "",
            label: "",
            schema_type: "flexible",
            node_definitions: [],
            relationship_definitions: []
        });
    }

    function choosePropertySet(source: PropertySource, kind: PropertyKind, name: string): string[] {
        const propertyList: string[] = [];

        if (source === "library") {
            console.log(selectedLibrarySchema);
            const schema = schemas.find((schema: GraphInterpretation) => schema.id === selectedLibrarySchema)
            if (!schema) {
                console.error("Can't find selected library schema.");
                return [];
            }
            if (kind === "node" && !schema.node_definitions) {
                console.error("Selected library schema has no node definitions.");
                return [];
            }
            if (kind === "edge" && !schema.relationship_definitions) {
                console.error("Selected library schema has no relationship definitions.");
                return [];
            }
            if (kind === "node") {
                const nodeDef = schema.node_definitions!.find((def: NodeDefinition) => def.label === name);
                if (!nodeDef) {
                    console.error("Can't find selected library schema node.");
                    return [];
                }
                for (const prop of nodeDef.properties ?? []) {
                    propertyList.push(prop.label);
                }
            }
            else if (kind === "edge") {
                return [];
            }
            else {
                console.error("Unknown property kind.");
            }
        }
        else if (source === "schema") {
            if (kind === "node") {
                const nodeDef = flexibleSchema?.node_definitions!.find((def: NodeDefinition) => def.label === name);
                if (!nodeDef) {
                    console.error("Can't find selected flexible schema node.");
                    return [];
                }
                for (const prop of nodeDef.properties ?? []) {
                    propertyList.push(prop.label);
                }
            }
            else if (kind === "edge") {
                return [];
            }
            else {
                console.error("Unknown property kind.");
            }
        }
        else {
            console.error("Unknown property source");
        }

        console.log(propertyList);
        return propertyList;
    }

    function updateSchemaName(name: string): void {
        setSchemaName(name);
        const normalisedName = name.toLowerCase().replace(" ", "_");
        if (flexibleSchema) {
            flexibleSchema.id = normalisedName;
            flexibleSchema.interpretation_type = normalisedName;
            flexibleSchema.label = name;
        }
    }

    const handleCreate = () => {
        if (schemaName.trim() !== "") {
            onCreate(flexibleSchema ?? null);
            onClose();
        }
    };

    function getSelectedSchemaNodeList() {
        if (selectedLibrarySchema === "")
            return [];
        else {
            const schema = schemas.find((schema: GraphInterpretation) => schema.id === selectedLibrarySchema);
            return schema?.node_definitions?.map((def) => def.label);
        }
    }

    function getSelectedSchemaEdgeList() {
        if (selectedLibrarySchema === "")
            return [];
        else {
            const schema = schemas.find((schema: GraphInterpretation) => schema.id === selectedLibrarySchema);
            return schema?.relationship_definitions?.map((def) => def.label);
        }
    }

    function getSelectedNodeDefinition(node: string): NodeDefinition | null {
        if (selectedLibrarySchema !== "") {
            const schema = schemas.find((schema: GraphInterpretation) => schema.id === selectedLibrarySchema);
            if (!schema) return null;
            const nodeDefinition = schema.node_definitions?.find((def: NodeDefinition) => def.label === node);
            if (!nodeDefinition) return null;
            return nodeDefinition;
        }
        return null;
    }

    function getSelectedEdgeDefinition(edge: string): RelationshipDefinition | null {
        if (selectedLibrarySchema !== "") {
            const schema = schemas.find((schema: GraphInterpretation) => schema.id === selectedLibrarySchema);
            if (!schema) return null;
            const edgeDefinition = schema.relationship_definitions?.find((def: RelationshipDefinition) => def.label === edge);
            if (!edgeDefinition) return null;
            return edgeDefinition;
        }
        return null;
    }

    function addNodeType(node: NodeDefinition | null): void {
        if (flexibleSchema && node) {
            setFlexibleSchema({
                ...flexibleSchema,
                node_definitions: [
                    ...flexibleSchema.node_definitions ?? [],
                    node
                ]
            });
        }
    }

    function addEdgeType(edge: RelationshipDefinition | null): void {
        if (flexibleSchema && edge) {
            setFlexibleSchema({
                ...flexibleSchema,
                relationship_definitions: [
                    ...flexibleSchema.relationship_definitions ?? [],
                    edge
                ]
            });
        }
    }

    return (
        <Modal isOpen={isOpen} title="Create Flexible Schema" onClose={onClose} width="1200px">
            <div
                style={{ display: "flex", flexDirection: "row", gap: "8px" }}
            >
                <div style={getPropertyLabelStyle()}>Schema Name</div>
                <input
                    id="schemaName"
                    type="text"
                    value={schemaName}
                    onChange={(e) => updateSchemaName(e.target.value)}
                    style={getPropertyInputStyle()}
                />
            </div>
            <div className="flexible-schema-workspace">
                <div className="flexible-schema-triptich-panel">
                    <span style={getPropertyLabelStyle()}>Library</span>
                    <div className="flexible-schema-sub-panel">
                        <div className="flexible-schema-collection" >
                            {schemas.map((schema: GraphInterpretation) => (
                                <div className={`flexible-schema-collection-entry ${selectedLibrarySchema === schema.id ? "flexible-schema-collection-entry-active" : ""}`}
                                    onClick={() => setSelectedLibrarySchema(schema.id)}
                                >{schema.label}</div>
                            ))}</div>
                    </div>
                    <div
                        style={{
                            flex: 1,
                            border: "1px solid " + asiguraPalette["asigura-6"],
                            borderRadius: "4px",
                            padding: "6px",
                            backgroundColor: asiguraPalette["asigura-9"],
                        }}
                    >
                        <div
                            style={{
                                flex: 1,
                                borderRadius: "4px",
                                padding: "6px",
                                backgroundColor: asiguraPalette["asigura-9"],
                                display: "flex",
                                flexDirection: "row",
                                gap: "4px",
                            }}
                        >
                            <button
                                className={`flexible-schema-collection-button ${nodeEdgeMode === "nodes" ? "flexible-schema-collection-button-active" : "flexible-schema-collection-button-secondary"}`}
                                onClick={() => setNodeEdgeMode("nodes")}
                            >
                                Nodes
                            </button>
                            <button
                                className={`flexible-schema-collection-button ${nodeEdgeMode === "edges" ? "flexible-schema-collection-button-active" : "flexible-schema-collection-button-secondary"}`}
                                onClick={() => setNodeEdgeMode("edges")}
                            >
                                Edges
                            </button>
                        </div>
                        <div className="flexible-schema-collection">
                            {nodeEdgeMode === "" ? <div></div> :
                                nodeEdgeMode === "nodes" ?
                                    getSelectedSchemaNodeList()?.map((node) =>
                                        <div className={`flexible-schema-collection-entry ${selectedLibraryNode === node ? "flexible-schema-collection-entry-active" : ""}`}
                                            onClick={() => {
                                                setSelectedLibraryNode(node);
                                                setSelectedLibraryEdge("");
                                                setSelectedSchemaNode("");
                                                setSelectedSchemaEdge("");
                                                setVisibleProperties(choosePropertySet("library", "node", node));
                                            }
                                            }
                                        >{node}
                                            <button
                                                style={{
                                                    border: "1px solid " + asiguraPalette["asigura-6"],
                                                    borderRadius: "4px",
                                                    backgroundColor: asiguraPalette["asigura-7"],
                                                }}
                                                onClick={() => {
                                                    setSelectedLibraryNode(node);
                                                    setSelectedLibraryEdge("");
                                                    setSelectedSchemaNode("");
                                                    setSelectedSchemaEdge("");
                                                    addNodeType(getSelectedNodeDefinition(node));
                                                    setVisibleProperties(choosePropertySet("library", "node", node));
                                                }}
                                            >+</button>
                                        </div>) :
                                    getSelectedSchemaEdgeList()?.map((edge) =>
                                        <div className={`flexible-schema-collection-entry ${selectedLibraryEdge === edge ? "flexible-schema-collection-entry-active" : ""}`}
                                            onClick={() => {
                                                setSelectedLibraryEdge(edge);
                                                setSelectedLibraryNode("");
                                                setSelectedSchemaNode("");
                                                setSelectedSchemaEdge("");
                                                setVisibleProperties(choosePropertySet("library", "edge", edge));

                                            }}
                                        >{edge}
                                            <button
                                                style={{
                                                    border: "1px solid " + asiguraPalette["asigura-6"],
                                                    borderRadius: "4px",
                                                    backgroundColor: asiguraPalette["asigura-7"],
                                                }}
                                                onClick={() => {
                                                    setSelectedLibraryEdge(edge);
                                                    addEdgeType(getSelectedEdgeDefinition(edge));
                                                    setVisibleProperties(choosePropertySet("library", "edge", edge));
                                                }}
                                            >+</button>
                                        </div>)}
                        </div>
                    </div>
                </div>
                <div className="flexible-schema-triptich-panel">
                    <span style={getPropertyLabelStyle()}>New Schema</span>
                    <div className="flexible-schema-sub-panel">
                        <span style={getPropertyLabelStyle()}>Nodes</span>
                        <div style={{
                            flex: 1,
                            border: "1px solid " + asiguraPalette["asigura-6"],
                            borderRadius: "4px",
                            padding: "6px",
                            backgroundColor: asiguraPalette["asigura-8pt5"],
                            display: "flex",
                            flexDirection: "column",
                            gap: "4px",
                        }}>
                            {flexibleSchema === null || flexibleSchema.node_definitions === undefined ?
                                <div></div> :
                                flexibleSchema.node_definitions.map((def: NodeDefinition) =>
                                    <div
                                        className={`flexible-schema-collection-entry ${selectedSchemaNode === def.label ? "flexible-schema-collection-entry-active" : ""}`}
                                        onClick={() => {
                                            setSelectedLibraryNode("");
                                            setSelectedLibraryEdge("");
                                            setSelectedSchemaNode(def.label);
                                            setSelectedSchemaEdge("");
                                            setVisibleProperties(choosePropertySet("schema", "node", def.label));
                                        }}
                                    >{def.label}</div>
                                )}
                        </div>
                    </div>
                    <div className="flexible-schema-sub-panel">
                        <span style={getPropertyLabelStyle()}>Edges</span>
                        <div style={{
                            flex: 1,
                            border: "1px solid " + asiguraPalette["asigura-6"],
                            borderRadius: "4px",
                            padding: "6px",
                            backgroundColor: asiguraPalette["asigura-8pt5"],
                            display: "flex",
                            flexDirection: "column",
                            gap: "4px",
                        }}>
                            {flexibleSchema === null || flexibleSchema.relationship_definitions === undefined ?
                                <div></div> :
                                flexibleSchema.relationship_definitions.map((def: RelationshipDefinition) =>
                                    <div
                                        className={`flexible-schema-collection-entry ${selectedSchemaEdge === def.label ? "flexible-schema-collection-entry-active" : ""}`}
                                        onClick={() => {
                                            setSelectedLibraryNode("");
                                            setSelectedLibraryEdge("");
                                            setSelectedSchemaNode("");
                                            setSelectedSchemaEdge(def.label);
                                            setVisibleProperties(choosePropertySet("schema", "edge", def.label));

                                        }}
                                    >{def.label}</div>
                                )}

                        </div>
                    </div>
                </div>
                <div className="flexible-schema-triptich-panel">
                    <span style={getPropertyLabelStyle()}>Properties</span>
                    <div className="flexible-schema-sub-panel">
                        <div className="flexible-schema-content">
                            {visibleProperties.map((prop: string) => (
                                <div className="flexible-schema-collection-entry">{prop}</div>))}</div>
                    </div>
                </div>
            </div>
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "flex-end", gap: "8px", marginTop: "12px" }}>
                <button
                    onClick={() => { onClose(); setFlexibleSchema(null) }}
                    style={{
                        padding: "6px 12px",
                        backgroundColor: "#e0d8c8",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer"
                    }}
                >Cancel</button>
                <button
                    onClick={handleCreate}
                    style={{
                        padding: "6px 12px",
                        backgroundColor: "#00332a",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer"
                    }}
                >Create</button>
            </div>
        </Modal >
    );
}