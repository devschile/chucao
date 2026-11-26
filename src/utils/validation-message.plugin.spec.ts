import { describe, it, expect } from 'vitest';

import { resolveValidity } from './validation-message';

describe('resolveValidity', () => {
  it('reports nothing for a valid, filled control', () => {
    expect(resolveValidity({ required: false, empty: false, invalid: false })).toEqual({ flags: {}, message: undefined });
  });

  it('flags an empty required control with the native message', () => {
    expect(resolveValidity({ required: true, empty: true, invalid: false })).toEqual({
      flags: { valueMissing: true },
      message: 'Please fill out this field.',
    });
  });

  it('ignores required when the control is filled', () => {
    expect(resolveValidity({ required: true, empty: false, invalid: false })).toEqual({ flags: {}, message: undefined });
  });

  it('mirrors a custom error and uses its message', () => {
    expect(resolveValidity({ required: false, empty: false, invalid: true, errorMessage: 'Correo inválido' })).toEqual({
      flags: { customError: true },
      message: 'Correo inválido',
    });
  });

  it('ignores invalid without a message', () => {
    expect(resolveValidity({ required: false, empty: false, invalid: true })).toEqual({ flags: {}, message: undefined });
  });

  it('reports both flags but prefers the custom message when both apply', () => {
    expect(resolveValidity({ required: true, empty: true, invalid: true, errorMessage: 'Elige una opción' })).toEqual({
      flags: { valueMissing: true, customError: true },
      message: 'Elige una opción',
    });
  });

  it('falls back to the native message when the custom error has no text', () => {
    expect(resolveValidity({ required: true, empty: true, invalid: true, errorMessage: '' })).toEqual({
      flags: { valueMissing: true },
      message: 'Please fill out this field.',
    });
  });
});
