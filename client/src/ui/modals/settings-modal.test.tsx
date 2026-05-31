import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SettingsModal } from './settings-modal';

vi.mock('../../api/user', () => ({
    getSettings: vi.fn(),
    updateSettings: vi.fn(),
    verifyVaultPath: vi.fn()
}));

import { getSettings, updateSettings, verifyVaultPath } from '../../api/user';

describe('SettingsModal', () => {
    const onClose = vi.fn();

    beforeEach(() => {
        vi.resetAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('renders loading state when opened and then displays settings fields', async () => {
        vi.mocked(getSettings).mockResolvedValueOnce({ vaultPath: '/tmp/vault' });

        render(<SettingsModal isOpen={true} onClose={onClose} />);

        expect(screen.getByText('Loading settings...')).toBeInTheDocument();

        const input = await screen.findByDisplayValue('/tmp/vault');
        expect(input).toBeInTheDocument();
        expect(screen.getByText('Vault Path:')).toBeInTheDocument();
    });

    it('saves settings when vault path is valid', async () => {
        vi.mocked(getSettings).mockResolvedValueOnce({ vaultPath: '/tmp/vault' });
        vi.mocked(verifyVaultPath).mockResolvedValueOnce(true);
        vi.mocked(updateSettings).mockResolvedValueOnce(undefined);

        render(<SettingsModal isOpen={true} onClose={onClose} />);

        await screen.findByDisplayValue('/tmp/vault');

        const saveButton = screen.getByRole('button', { name: /save settings/i });
        await userEvent.click(saveButton);

        await waitFor(() => {
            expect(verifyVaultPath).toHaveBeenCalledWith('/tmp/vault');
            expect(updateSettings).toHaveBeenCalledWith({ vaultPath: '/tmp/vault' });
            expect(onClose).toHaveBeenCalled();
        });
    });

    it('alerts and does not save when vault path validation fails', async () => {
        vi.mocked(getSettings).mockResolvedValueOnce({ vaultPath: '/tmp/vault' });
        vi.mocked(verifyVaultPath).mockResolvedValueOnce(false);
        const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => { });

        render(<SettingsModal isOpen={true} onClose={onClose} />);

        await screen.findByDisplayValue('/tmp/vault');

        const saveButton = screen.getByRole('button', { name: /save settings/i });
        await userEvent.click(saveButton);

        await waitFor(() => {
            expect(verifyVaultPath).toHaveBeenCalledWith('/tmp/vault');
            expect(alertSpy).toHaveBeenCalledWith(
                'The provided vault path is invalid. Please check the path and try again.'
            );
            expect(updateSettings).not.toHaveBeenCalled();
            expect(onClose).not.toHaveBeenCalled();
        });
    });

    it('updates the input state when the user edits a setting', async () => {
        vi.mocked(getSettings).mockResolvedValueOnce({ vaultPath: '/tmp/vault' });
        vi.mocked(verifyVaultPath).mockResolvedValueOnce(true);
        vi.mocked(updateSettings).mockResolvedValueOnce(undefined);

        render(<SettingsModal isOpen={true} onClose={onClose} />);

        const input = await screen.findByDisplayValue('/tmp/vault');
        await userEvent.clear(input);
        await userEvent.type(input, '/custom/vault');

        const saveButton = screen.getByRole('button', { name: /save settings/i });
        await userEvent.click(saveButton);

        await waitFor(() => {
            expect(verifyVaultPath).toHaveBeenCalledWith('/custom/vault');
            expect(updateSettings).toHaveBeenCalledWith({ vaultPath: '/custom/vault' });
        });
    });
});
