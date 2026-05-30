import { describe, it, expect } from 'vitest';
import express from 'express';
import request from 'supertest';
import healthcheckRouter from './healthcheck';

describe('healthcheck router', () => {
    it('responds with status ok', async () => {
        const app = express();
        app.use('/healthcheck', healthcheckRouter);

        const response = await request(app).get('/healthcheck');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ status: 'ok' });
    });
});
