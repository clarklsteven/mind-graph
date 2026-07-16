import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NewGraphModal } from './new-graph-modal';

type GraphInterpretation = {
    id: string;
    interpretation_type: string;
    label: string;
    schema_type: string;
};

describe('NewGraphModal', () => {
    const interpretations: GraphInterpretation[] = [
        { id: 'thinking-graph', interpretation_type: 'thinking-graph', label: 'Thinking Graph', schema_type: "application" },
        { id: 'narrative-strategy-graph', interpretation_type: 'narrative-strategy-graph', label: 'Narrative Strategy', schema_type: "application" },
    ];

    it('renders the modal with default values when open', () => {
        const onClose = vi.fn();
        const onCreate = vi.fn();

        render(
            <NewGraphModal
                isOpen={true}
                onClose={onClose}
                onCreate={onCreate}
                interpretations={interpretations}
            />
        );

        expect(screen.getByRole('dialog', { name: /create new graph/i })).toBeInTheDocument();
        expect(screen.getByRole('textbox', { name: /graph name/i })).toHaveValue('Untitled Graph');
        expect(screen.getByRole('combobox', { name: /interpretation/i })).toHaveValue('thinking-graph');
        expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /create/i })).toBeInTheDocument();
    });

    it('does not render when closed', () => {
        const onClose = vi.fn();
        const onCreate = vi.fn();

        render(
            <NewGraphModal
                isOpen={false}
                onClose={onClose}
                onCreate={onCreate}
                interpretations={interpretations}
            />
        );

        expect(screen.queryByRole('dialog', { name: /create new graph/i })).not.toBeInTheDocument();
    });

    it('calls onCreate with trimmed name and selected interpretation', async () => {
        const onClose = vi.fn();
        const onCreate = vi.fn();

        render(
            <NewGraphModal
                isOpen={true}
                onClose={onClose}
                onCreate={onCreate}
                interpretations={interpretations}
            />
        );

        const nameInput = screen.getByRole('textbox', { name: /graph name/i });
        const interpretationSelect = screen.getByRole('combobox', { name: /interpretation/i });
        const createButton = screen.getByRole('button', { name: /create/i });

        await userEvent.clear(nameInput);
        await userEvent.type(nameInput, '  My New Graph  ');
        await userEvent.selectOptions(interpretationSelect, 'narrative-strategy-graph');
        await userEvent.click(createButton);

        expect(onCreate).toHaveBeenCalledWith('My New Graph', 'narrative-strategy-graph');
        expect(onClose).toHaveBeenCalled();
    });

    it('calls onClose when cancel is clicked and does not call onCreate', async () => {
        const onClose = vi.fn();
        const onCreate = vi.fn();

        render(
            <NewGraphModal
                isOpen={true}
                onClose={onClose}
                onCreate={onCreate}
                interpretations={interpretations}
            />
        );

        const cancelButton = screen.getByRole('button', { name: /cancel/i });
        await userEvent.click(cancelButton);

        expect(onClose).toHaveBeenCalled();
        expect(onCreate).not.toHaveBeenCalled();
    });

    it('creates a thinking graph by default if no interpretations are provided', async () => {
        const onClose = vi.fn();
        const onCreate = vi.fn();

        render(
            <NewGraphModal
                isOpen={true}
                onClose={onClose}
                onCreate={onCreate}
                interpretations={[]}
            />
        );

        const nameInput = screen.getByRole('textbox', { name: /graph name/i });
        const createButton = screen.getByRole('button', { name: /create/i });

        await userEvent.clear(nameInput);
        await userEvent.type(nameInput, '  My New Graph  ');
        await userEvent.click(createButton);

        expect(onCreate).toHaveBeenCalledWith('My New Graph', 'thinking-graph');
        expect(onClose).toHaveBeenCalled();
    });
});
