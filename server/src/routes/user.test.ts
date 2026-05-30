import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import express from 'express';
import request from 'supertest';
import userRouter from './user';
import { UserSettings } from '../user/user-settings';

describe('user router', () => {
    let app: ReturnType<typeof express>;

    beforeEach(() => {
        app = express();
        app.use(express.json());
        app.use('/user', userRouter);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('returns the current settings', async () => {
        vi.spyOn(UserSettings.prototype, 'getSettings').mockReturnValue({ vaultPath: '/tmp/vault' });

        const response = await request(app).get('/user/settings');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            status: 'ok',
            settings: { vaultPath: '/tmp/vault' }
        });
    });

    it('updates settings and returns ok', async () => {
        const updateSettingsMock = vi.spyOn(UserSettings.prototype, 'updateSettings').mockImplementation(() => undefined);

        const response = await request(app)
            .post('/user/settings')
            .send({ vaultPath: '/tmp/vault' });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ status: 'ok' });
        expect(updateSettingsMock).toHaveBeenCalledWith({ vaultPath: '/tmp/vault' });
    });

    it('verifies a vault path', async () => {
        vi.spyOn(UserSettings.prototype, 'verifyVaultPath').mockReturnValue(true);

        const response = await request(app)
            .post('/user/settings/verify-vault-path')
            .send({ vaultPath: '/tmp/vault' });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ status: 'ok', isValid: true });
    });
});
