import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { loadInterpretations } from './interpretations-loader';
import type { GraphInterpretation } from '../model/graph-interpretation';

describe('loadInterpretations', () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('loads interpretation files from the config manifest and returns a lookup object', async () => {
        const firstInterpretation: GraphInterpretation = {
            id: '1',
            interpretation_type: 'first',
            label: 'First',
            relationship_definitions: []
        };
        const secondInterpretation: GraphInterpretation = {
            id: '2',
            interpretation_type: 'second',
            label: 'Second',
            relationship_definitions: []
        };
        const fetchMock = vi.fn()
            .mockResolvedValueOnce({ json: async () => ['first.json', 'second.json'] })
            .mockResolvedValueOnce({ json: async () => firstInterpretation })
            .mockResolvedValueOnce({ json: async () => secondInterpretation });

        vi.stubGlobal('fetch', fetchMock);

        const result = await loadInterpretations();

        expect(fetchMock).toHaveBeenCalledTimes(3);
        expect(fetchMock).toHaveBeenNthCalledWith(1, '/config/interpretations.json');
        expect(fetchMock).toHaveBeenNthCalledWith(2, '/config/first.json');
        expect(fetchMock).toHaveBeenNthCalledWith(3, '/config/second.json');
        expect(result).toEqual({
            first: firstInterpretation,
            second: secondInterpretation
        });
    });

    it('returns an empty object when the manifest contains no files', async () => {
        const fetchMock = vi.fn().mockResolvedValueOnce({ json: async () => [] });
        vi.stubGlobal('fetch', fetchMock);

        const result = await loadInterpretations();

        expect(fetchMock).toHaveBeenCalledOnce();
        expect(fetchMock).toHaveBeenCalledWith('/config/interpretations.json');
        expect(result).toEqual({});
    });
});
