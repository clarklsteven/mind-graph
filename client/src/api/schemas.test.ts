import { afterEach, describe, expect, it, vi } from "vitest";
import { createFlexibleSchema } from "./schemas";

describe("client/api/schemas", () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("posts a flexible schema to the server and returns a schema entry", async () => {
        const schema = {
            id: "alpha",
            interpretation_type: "alpha",
            label: "Alpha Schema",
            schema_type: "flexible",
            node_definitions: [],
            relationship_definitions: []
        };
        const fetchMock = vi.fn().mockResolvedValue({});

        vi.stubGlobal("fetch", fetchMock);

        const entry = await createFlexibleSchema(schema);

        expect(fetchMock).toHaveBeenCalledOnce();
        expect(fetchMock).toHaveBeenCalledWith("http://localhost:3000/schemas", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ schema })
        });
        expect(entry).toEqual({
            name: "Alpha Schema",
            lastModified: expect.any(String)
        });
    });
});
