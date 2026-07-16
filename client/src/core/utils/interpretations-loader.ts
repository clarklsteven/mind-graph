import type { GraphInterpretation } from "../model/graph-interpretation";

export async function loadInterpretations(): Promise<Record<string, GraphInterpretation>> {
    const manifestResponse = await fetch("/config/interpretations.json");
    const files: string[] = await manifestResponse.json();

    const entries = await Promise.all(
        files.map(async (file) => {
            const response = await fetch(`/config/${file}`);
            const interpretation: GraphInterpretation = await response.json();
            return [interpretation.interpretation_type, interpretation] as const;
        })
    );

    const flexibleSchemasResponse = await fetch("http://localhost:3000/schemas");
    const flexibleSchemasJson = await flexibleSchemasResponse.json();
    const flexibleSchemas: GraphInterpretation[] = flexibleSchemasJson.schemas;
    flexibleSchemas.map((schema) => {
        entries.push([schema.interpretation_type, schema]);
    })

    return Object.fromEntries(entries);
}