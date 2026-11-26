import { describe, it, expect, vi, beforeEach, afterEach } from '@stencil/vitest';
import { Build } from '@stencil/core';

import { hasLightDomText, warnMissingName } from './accessibility';

describe('accessible-name helper', () => {
  const wasDev = Build.isDev;
  beforeEach(() => {
    (Build as { isDev: boolean }).isDev = true;
  });
  afterEach(() => {
    (Build as { isDev: boolean }).isDev = wasDev;
    vi.restoreAllMocks();
  });

  it('detects text in the default slot but not in named slots', () => {
    const text = document.createElement('ch-button');
    text.textContent = 'Guardar';
    expect(hasLightDomText(text)).toBe(true);

    const icon = document.createElement('ch-button');
    const span = document.createElement('span');
    span.setAttribute('slot', 'start');
    span.textContent = '✕';
    icon.appendChild(span);
    expect(hasLightDomText(icon)).toBe(false);
  });

  it('warns only once per element', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const el = document.createElement('ch-modal');

    warnMissingName(el, 'ch-modal', 'pass label');
    warnMissingName(el, 'ch-modal', 'pass label');

    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn.mock.calls[0][0]).toContain('ch-modal');
  });

  it('does not warn without a browser window', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.stubGlobal('window', undefined);
    try {
      warnMissingName(document.createElement('ch-modal'), 'ch-modal', 'pass label');
      expect(warn).not.toHaveBeenCalled();
    } finally {
      vi.unstubAllGlobals();
    }
  });
});
