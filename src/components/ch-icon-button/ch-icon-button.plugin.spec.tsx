import { render, h, describe, it, expect, vi } from '@stencil/vitest';

import './ch-icon-button.tsx';

function button(root: HTMLElement) {
  return root.shadowRoot.querySelector('button');
}

describe('ch-icon-button', () => {
  it('names the button with its label', async () => {
    const { root } = await render(<ch-icon-button name="close" label="Cerrar"></ch-icon-button>);

    expect(button(root).getAttribute('aria-label')).toBe('Cerrar');
  });

  it('hides the glyph from assistive technology, since the button carries the name', async () => {
    const { root } = await render(<ch-icon-button name="close" label="Cerrar"></ch-icon-button>);

    expect(button(root).querySelector('svg').getAttribute('aria-hidden')).toBe('true');
  });

  it('never submits a form unless asked to', async () => {
    const { root } = await render(<ch-icon-button name="plus" label="Agregar"></ch-icon-button>);

    expect(button(root).getAttribute('type')).toBe('button');
  });

  it('emits chClick with the native event', async () => {
    const { root } = await render(<ch-icon-button name="plus" label="Agregar"></ch-icon-button>);
    const spy = vi.fn();
    root.addEventListener('chClick', spy);

    button(root).click();

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('ignores clicks while loading and marks itself busy', async () => {
    const { root } = await render(<ch-icon-button name="copy" label="Copiar" loading={true}></ch-icon-button>);
    const spy = vi.fn();
    root.addEventListener('chClick', spy);

    button(root).click();

    expect(spy).not.toHaveBeenCalled();
    expect(button(root).getAttribute('aria-busy')).toBe('true');
  });

  it('ignores clicks while disabled but stays focusable', async () => {
    const { root } = await render(<ch-icon-button name="copy" label="Copiar" disabled={true}></ch-icon-button>);
    const spy = vi.fn();
    root.addEventListener('chClick', spy);

    button(root).click();

    expect(spy).not.toHaveBeenCalled();
    expect(button(root).getAttribute('aria-disabled')).toBe('true');
    expect(button(root).hasAttribute('disabled')).toBe(false);
  });

  it('exposes three sizes', async () => {
    const { root } = await render(<ch-icon-button name="menu" label="Menú" size="sm"></ch-icon-button>);

    expect(button(root).getAttribute('class')).toContain('button--sm');
  });

  it('renders nothing for an unknown glyph without losing its name', async () => {
    const { root } = await render(<ch-icon-button name={'no-existe' as never} label="Cerrar"></ch-icon-button>);

    expect(button(root).querySelector('svg').children.length).toBe(0);
    expect(button(root).getAttribute('aria-label')).toBe('Cerrar');
  });
});
