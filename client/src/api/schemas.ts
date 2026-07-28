import type { GraphInterpretation } from "../core/model/graph-interpretation";

export type SchemaEntry = {
    name: string;
    lastModified: string;
};

export async function createFlexibleSchema(schema: GraphInterpretation): Promise<SchemaEntry> {
    await fetch(`http://localhost:3000/schemas`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ schema: schema })
    });
    return {
        name: schema.label,
        lastModified: new Date().toISOString()
    };
}