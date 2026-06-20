export type ReferenceKind = "url" | "file" | "graph" | "obsidian" | "unknown";

export type ArtifactReference = {
    label: string;
    target: string;
    kind: ReferenceKind;
};