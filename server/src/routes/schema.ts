import { Router } from "express";
import { Schemas } from "../schemas/schemas";

const router = Router();
const schemas = new Schemas();

// Create a flexible schema
router.post("/", async (_req, res) => {
    const schema = _req.body.schema;
    const savedSchema = await schemas.createSchema(schema);
    if (savedSchema) {
        res.status(201).json({
            status: "ok",
            schema: savedSchema
        });
    }
    else {
        res.status(500).json({
            status: "failed",
            message: "Failed to create new flexible schema"
        })
    }
});

// Get a list of all flexible schemas
router.get("/", async (_req, res) => {
    const schemaList = await schemas.getSchemas();
    res.status(200).json({
        status: "ok",
        schemas: schemaList
    });
});

// Get a specific schema by name
router.get("/:name", async (_req, res) => {
    const schemaName = _req.params.name;
    const schema = await schemas.getSchema(schemaName);

    res.status(200).json({
        status: "ok",
        name: _req.params.name,
        schema: schema
    });
});

export default router;