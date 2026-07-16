import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ReferenceEditor from './reference-editor';
import type { ArtifactReference } from '../../core/model/artefact-reference';

describe('ReferenceEditor', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    const references: ArtifactReference[] = [
        { label: 'Obsidian Note', target: 'obsidian://path', kind: 'obsidian' },
        { label: 'Web Link', target: 'https://example.com', kind: 'url' },
        { label: 'Graph Node', target: 'graph-id', kind: 'graph' },
        { label: 'Local File', target: '/tmp/doc.md', kind: 'file' },
        { label: 'Unknown Item', target: '?', kind: 'unknown' },
    ];

    it('renders add button and reference cards with icons', () => {
        const onChange = vi.fn();

        render(<ReferenceEditor referenceList={references} onChange={onChange} />);

        expect(screen.getByRole('button', { name: /add reference/i })).toBeInTheDocument();
        expect(screen.getByText('Obsidian Note')).toBeInTheDocument();
        expect(screen.getByText('Web Link')).toBeInTheDocument();
        expect(screen.getByText('Graph Node')).toBeInTheDocument();
        expect(screen.getByText('Local File')).toBeInTheDocument();
        expect(screen.getByText('Unknown Item')).toBeInTheDocument();

        expect(screen.getByText('📚')).toBeInTheDocument();
        expect(screen.getByText('🔗')).toBeInTheDocument();
        expect(screen.getByText('🧠')).toBeInTheDocument();
        expect(screen.getByText('📄')).toBeInTheDocument();
        expect(screen.getByText('❓')).toBeInTheDocument();
    });

    it('opens the new reference modal when Add Reference is clicked', async () => {
        const onChange = vi.fn();

        render(<ReferenceEditor referenceList={[]} onChange={onChange} />);

        await userEvent.click(screen.getByRole('button', { name: /add reference/i }));

        expect(screen.getByRole('dialog', { name: /create new reference/i })).toBeInTheDocument();
    });

    it('calls onChange with updated list when a new reference is created', async () => {
        const onChange = vi.fn();

        render(<ReferenceEditor referenceList={[]} onChange={onChange} />);

        await userEvent.click(screen.getByRole('button', { name: /add reference/i }));
        await userEvent.clear(screen.getByRole('textbox', { name: /reference label/i }));
        await userEvent.type(screen.getByRole('textbox', { name: /reference label/i }), '  New Link  ');
        await userEvent.type(screen.getByRole('textbox', { name: /graph name/i }), '  https://example.com  ');
        await userEvent.selectOptions(screen.getByRole('combobox', { name: /kind/i }), 'url');
        await userEvent.click(screen.getByRole('button', { name: /create/i }));

        expect(onChange).toHaveBeenCalledWith([
            { label: 'New Link', target: 'https://example.com', kind: 'url' }
        ]);
    });

    it('removes a reference when the remove button is clicked', async () => {
        const onChange = vi.fn();

        render(<ReferenceEditor referenceList={references} onChange={onChange} />);

        const item = screen.getByText('Obsidian Note').closest('div');
        expect(item).toBeTruthy();

        const buttons = within(item as HTMLElement).getAllByRole('button');
        await userEvent.click(buttons[1]);

        expect(onChange).toHaveBeenCalledWith(
            references.filter((reference) => reference.label !== 'Obsidian Note')
        );
    });

    it('opens a URL reference with window.open', async () => {
        const onChange = vi.fn();
        const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);

        render(<ReferenceEditor referenceList={references} onChange={onChange} />);

        const item = screen.getByText('Web Link').closest('div');
        expect(item).toBeTruthy();

        const buttons = within(item as HTMLElement).getAllByRole('button');
        await userEvent.click(buttons[0]);

        expect(openSpy).toHaveBeenCalledWith('https://example.com', '_blank');
    });

    it("updates window.location.href when opening an obsidian reference", async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();
        const originalLocation = window.location;

        Object.defineProperty(window, "location", {
            configurable: true,
            value: {
                href: "",
            } as Location,
        });

        try {
            render(
                <ReferenceEditor
                    referenceList={references}
                    onChange={onChange}
                />
            );

            const item = screen
                .getByText("Obsidian Note")
                .closest("div");

            expect(item).not.toBeNull();

            const buttons = within(item as HTMLElement)
                .getAllByRole("button");

            await user.click(buttons[0]);

            expect(window.location.href).toBe("obsidian://path");
        } finally {
            Object.defineProperty(window, "location", {
                configurable: true,
                value: originalLocation,
            });
        }
    });
});
