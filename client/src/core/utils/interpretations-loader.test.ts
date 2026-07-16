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
            schema_type: ''
        };
        const secondInterpretation: GraphInterpretation = {
            id: '2',
            interpretation_type: 'second',
            label: 'Second',
            schema_type: ''
        };
        const thirdInterpretation: GraphInterpretation = {
            id: '3',
            interpretation_type: 'third',
            label: 'Third',
            schema_type: 'flexible'
        };
        const fetchMock = vi.fn()
            .mockResolvedValueOnce({ json: async () => ['first.json', 'second.json'] })
            .mockResolvedValueOnce({ json: async () => firstInterpretation })
            .mockResolvedValueOnce({ json: async () => secondInterpretation })
            .mockResolvedValueOnce({ json: async () => ({ "schemas": [thirdInterpretation] }) });

        vi.stubGlobal('fetch', fetchMock);

        const result = await loadInterpretations();

        expect(fetchMock).toHaveBeenCalledTimes(4);
        expect(fetchMock).toHaveBeenNthCalledWith(1, '/config/interpretations.json');
        expect(fetchMock).toHaveBeenNthCalledWith(2, '/config/first.json');
        expect(fetchMock).toHaveBeenNthCalledWith(3, '/config/second.json');
        expect(fetchMock).toHaveBeenNthCalledWith(4, 'http://localhost:3000/schemas');
        expect(result).toEqual({
            first: firstInterpretation,
            second: secondInterpretation,
            third: thirdInterpretation
        });
    });

    it('returns an empty object when the manifest contains no files', async () => {
        const thirdInterpretation: GraphInterpretation = {
            id: '3',
            interpretation_type: 'third',
            label: 'Third',
            schema_type: 'flexible'
        };
        const fetchMock = vi.fn().mockResolvedValueOnce({ json: async () => [] })
            .mockResolvedValueOnce({ json: async () => ({ "schemas": [thirdInterpretation] }) });

        vi.stubGlobal('fetch', fetchMock);

        const result = await loadInterpretations();

        expect(fetchMock).toHaveBeenCalledTimes(2);
        expect(fetchMock).toHaveBeenNthCalledWith(1, '/config/interpretations.json');
        expect(fetchMock).toHaveBeenNthCalledWith(2, 'http://localhost:3000/schemas');

        expect(result).toEqual({
            third: thirdInterpretation
        });
    });
});
