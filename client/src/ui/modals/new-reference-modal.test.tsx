import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NewReferenceModal } from './new-reference-modal';

describe('NewReferenceModal', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('renders the modal with default form values when open', async () => {
        const onClose = vi.fn();
        const onCreate = vi.fn();

        render(<NewReferenceModal isOpen={true} onClose={onClose} onCreate={onCreate} />);

        const labelInput = await screen.findByRole('textbox', { name: /reference label/i });
        const targetInput = screen.getByRole('textbox', { name: /graph name/i });
        const kindSelect = screen.getByRole('combobox', { name: /kind/i });

        expect(labelInput).toHaveValue('New Reference');
        expect(targetInput).toHaveValue('');
        expect(kindSelect).toHaveValue('unknown');
        expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /create/i })).toBeInTheDocument();
    });

    it('does not render when isOpen is false', () => {
        const onClose = vi.fn();
        const onCreate = vi.fn();

        render(<NewReferenceModal isOpen={false} onClose={onClose} onCreate={onCreate} />);

        expect(screen.queryByRole('dialog', { name: /create new reference/i })).not.toBeInTheDocument();
    });

    it('calls onCreate with trimmed values and selected kind', async () => {
        const onClose = vi.fn();
        const onCreate = vi.fn();

        render(<NewReferenceModal isOpen={true} onClose={onClose} onCreate={onCreate} />);

        const labelInput = await screen.findByRole('textbox', { name: /reference label/i });
        const targetInput = screen.getByRole('textbox', { name: /graph name/i });
        const kindSelect = screen.getByRole('combobox', { name: /kind/i });

        await userEvent.clear(labelInput);
        await userEvent.type(labelInput, '  Example Reference  ');
        await userEvent.clear(targetInput);
        await userEvent.type(targetInput, '  https://example.com  ');
        await userEvent.selectOptions(kindSelect, 'url');
        await userEvent.click(screen.getByRole('button', { name: /create/i }));

        await waitFor(() => {
            expect(onCreate).toHaveBeenCalledWith('Example Reference', 'https://example.com', 'url');
            expect(onClose).toHaveBeenCalled();
        });
    });

    it('calls onClose when Cancel is clicked and does not call onCreate', async () => {
        const onClose = vi.fn();
        const onCreate = vi.fn();

        render(<NewReferenceModal isOpen={true} onClose={onClose} onCreate={onCreate} />);

        await screen.findByRole('textbox', { name: /reference label/i });
        await userEvent.click(screen.getByRole('button', { name: /cancel/i }));

        expect(onClose).toHaveBeenCalled();
        expect(onCreate).not.toHaveBeenCalled();
    });
});
