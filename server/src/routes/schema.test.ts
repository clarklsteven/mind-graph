import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import express from 'express';
import request from 'supertest';
import schemaRouter from './schema';
import { Schemas } from '../schemas/schemas';

describe('schema router', () => {
    let app: ReturnType<typeof express>;

    beforeEach(() => {
        app = express();
        app.use(express.json());
        app.use('/schemas', schemaRouter);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('returns the available schemas', async () => {
        vi.spyOn(Schemas.prototype, 'getSchemas').mockResolvedValue([
            {
                id: 'alpha',
                label: 'alpha',
                interpretation_type: 'alpha',
                schema_type: 'flexible',
                node_definitions: [],
                relationship_definitions: []
            }
        ]);

        const response = await request(app).get('/schemas');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            status: 'ok',
            schemas: [{
                id: 'alpha',
                label: 'alpha',
                interpretation_type: 'alpha',
                schema_type: 'flexible',
                node_definitions: [],
                relationship_definitions: []
            }
            ]
        });
    });

    it('returns a specific schema by name', async () => {
        vi.spyOn(Schemas.prototype, 'getSchema').mockResolvedValue({
            id: 'alpha',
            label: 'alpha',
            interpretation_type: 'alpha',
            schema_type: 'flexible',
            node_definitions: [],
            relationship_definitions: []
        }
        );

        const response = await request(app).get('/schemas/alpha.json');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            status: 'ok',
            name: 'alpha.json',
            schema: {
                id: 'alpha',
                label: 'alpha',
                interpretation_type: 'alpha',
                schema_type: 'flexible',
                node_definitions: [],
                relationship_definitions: []
            }

        });
    });
});
