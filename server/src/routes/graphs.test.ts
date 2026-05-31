import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import express from 'express';
import request from 'supertest';
import graphsRouter from './graphs';
import { Graphs } from '../graphs/graphs';

describe('graphs router', () => {
    let app: ReturnType<typeof express>;

    beforeEach(() => {
        app = express();
        app.use(express.json());
        app.use('/graphs', graphsRouter);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('returns a list of graphs', async () => {
        vi.spyOn(Graphs.prototype, 'getGraphs').mockResolvedValue([
            {
                name: 'test',
                interpretation: 'demo',
                lastModified: '2020-01-01T00:00:00.000Z'
            }
        ]);

        const response = await request(app).get('/graphs');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            status: 'ok',
            graphs: [
                {
                    name: 'test',
                    interpretation: 'demo',
                    lastModified: '2020-01-01T00:00:00.000Z'
                }
            ]
        });
    });

    it('returns 404 when a graph is not found', async () => {
        vi.spyOn(Graphs.prototype, 'getGraph').mockResolvedValue(null);

        const response = await request(app).get('/graphs/missing');

        expect(response.status).toBe(404);
        expect(response.body).toEqual({
            status: 'error',
            message: 'Graph not found'
        });
    });

    it('returns a graph when it exists', async () => {
        vi.spyOn(Graphs.prototype, 'getGraph').mockResolvedValue({
            name: 'existing',
            interpretation: 'demo',
            nodes: [],
            edges: []
        });

        const response = await request(app).get('/graphs/existing');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            status: 'ok',
            name: 'existing',
            graph: {
                name: 'existing',
                interpretation: 'demo',
                nodes: [],
                edges: []
            }
        });
    });

    it('creates a new graph', async () => {
        vi.spyOn(Graphs.prototype, 'createGraph').mockResolvedValue({
            name: 'created',
            interpretation: 'demo',
            nodes: [],
            edges: []
        });

        const response = await request(app)
            .post('/graphs')
            .send({
                name: 'created',
                interpretationType: 'demo',
                graphData: { name: 'created', interpretation: 'demo', nodes: [], edges: [] }
            });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            status: 'ok',
            name: 'created',
            graph: {
                name: 'created',
                interpretation: 'demo',
                nodes: [],
                edges: []
            }
        });
    });

    it('updates an existing graph', async () => {
        vi.spyOn(Graphs.prototype, 'updateGraph').mockResolvedValue({
            name: 'existing',
            interpretation: 'demo',
            nodes: [],
            edges: []
        });

        const response = await request(app)
            .put('/graphs/existing')
            .send({ graph: { name: 'existing', interpretation: 'demo', nodes: [], edges: [] } });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            status: 'ok',
            name: 'existing',
            graph: {
                name: 'existing',
                interpretation: 'demo',
                nodes: [],
                edges: []
            }
        });
    });

    it('returns 400 when trying to create a graph without a name or interpretation type', async () => {
        const response = await request(app)
            .post('/graphs')
            .send({ name: '', interpretationType: '' });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            status: 'error',
            message: 'Graph data with a valid name is required'
        });
    });

    it('returns 400 when trying to create a graph with an invalid name', async () => {
        const response = await request(app)
            .post('/graphs')
            .send({
                name: 'invalid/name',
                interpretationType: 'demo',
                graphData: { name: 'invalid/name', interpretation: 'demo', nodes: [], edges: [] }
            });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            status: 'error',
            message: 'Invalid graph name'
        });
    });

    it('returns 400 when trying to create a graph with a name made of spaces', async () => {
        const response = await request(app)
            .post('/graphs')
            .send({
                name: '   ',
                interpretationType: 'demo',
                graphData: { name: '   ', interpretation: 'demo', nodes: [], edges: [] }
            });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            status: 'error',
            message: 'Invalid graph name'
        });
    });

    it('returns 400 when trying to create a graph that starts with a dot', async () => {
        const response = await request(app)
            .post('/graphs')
            .send({
                name: '.hidden',
                interpretationType: 'demo',
                graphData: { name: '.hidden', interpretation: 'demo', nodes: [], edges: [] }
            });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            status: 'error',
            message: 'Invalid graph name'
        });
    });
});
