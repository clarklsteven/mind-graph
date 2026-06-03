import { describe, it, expect } from 'vitest';
import { asiguraPalette } from './asigura-palette';

describe('asiguraPalette', () => {
    it('should export a palette object with named color values', () => {
        expect(asiguraPalette).toBeTypeOf('object');
        expect(asiguraPalette).toHaveProperty('asigura-1', '#005545');
        expect(asiguraPalette).toHaveProperty('asigura-4', '#609179');
        expect(asiguraPalette).toHaveProperty('asigura-accent-4', '#B398B4');
        expect(asiguraPalette).toHaveProperty('asigura-status-6', '#6898cb');
    });

    it('should only contain hex color strings', () => {
        Object.values(asiguraPalette).forEach(value => {
            expect(value).toMatch(/^#[0-9A-Fa-f]{6}$/);
        });
    });
});
