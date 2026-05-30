import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from './server';

describe('server entrypoint', () => {
    it('exports the express application with mounted routes', async () => {
        const response = await request(app).get('/healthcheck');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ status: 'ok' });
    });
});
