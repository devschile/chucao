import { render, h, describe, it, expect } from '@stencil/vitest';

import './ch-tooltip.tsx';

function bubble(root: HTMLElement) {
  return root.shadowRoot.querySelector('.bubble');
}

function fire(target: Element | HTMLElement | Document, type: string, init: Record<string, unknown> = {}) {
  const event = new Event(type, { bubbles: true, composed: true });
  Object.assign(event, init);
  target.dispatchEvent(event);
}

describe('ch-tooltip', () => {
  it('places the bubble above the trigger by default', async () => {
    const { root } = await render(
      <ch-tooltip>
        <button slot="trigger">Guardar</button>
        <span slot="content">Guarda los cambios</span>
      </ch-tooltip>,
    );
    expect(bubble(root).className).toBe('bubble bubble--top');
  });

  it('honours the placement prop', async () => {
    const { root } = await render(
      <ch-tooltip placement="right">
        <button slot="trigger">Guardar</button>
        <span slot="content">Guarda los cambios</span>
      </ch-tooltip>,
    );
    expect(bubble(root).className).toBe('bubble bubble--right');
  });

  it('describes the trigger with the slotted text, which is what makes it accessible', async () => {
    const { root } = await render(
      <ch-tooltip>
        <button slot="trigger">Guardar</button>
        <span slot="content">Guarda los cambios</span>
      </ch-tooltip>,
    );
    const trigger = root.querySelector('button');
    const content = root.querySelector('[slot="content"]');

    expect(content.id).not.toBe('');
    expect(trigger.getAttribute('aria-describedby')).toBe(content.id);
    expect(content.getAttribute('role')).toBe('tooltip');
  });

  it('keeps an id the consumer already set instead of overwriting it', async () => {
    const { root } = await render(
      <ch-tooltip>
        <button slot="trigger">Guardar</button>
        <span slot="content" id="ayuda-guardar">
          Guarda los cambios
        </span>
      </ch-tooltip>,
    );
    expect(root.querySelector('[slot="content"]').id).toBe('ayuda-guardar');
    expect(root.querySelector('button').getAttribute('aria-describedby')).toBe('ayuda-guardar');
  });

  it('opens on focus and closes on blur, so it works without a pointer', async () => {
    const { root, waitForChanges } = await render(
      <ch-tooltip>
        <button slot="trigger">Guardar</button>
        <span slot="content">Guarda los cambios</span>
      </ch-tooltip>,
    );
    const trigger = root.querySelector('button');

    fire(trigger, 'focusin');
    await waitForChanges();
    expect(bubble(root).className).toContain('bubble--visible');

    fire(trigger, 'focusout');
    await waitForChanges();
    expect(bubble(root).className).not.toContain('bubble--visible');
  });

  it('opens on hover and closes when the pointer leaves', async () => {
    const { root, waitForChanges } = await render(
      <ch-tooltip>
        <button slot="trigger">Guardar</button>
        <span slot="content">Guarda los cambios</span>
      </ch-tooltip>,
    );

    fire(root, 'mouseenter');
    await waitForChanges();
    expect(bubble(root).className).toContain('bubble--visible');

    fire(root, 'mouseleave');
    await waitForChanges();
    expect(bubble(root).className).not.toContain('bubble--visible');
  });

  it('closes on Escape while keeping focus on the trigger', async () => {
    const { root, waitForChanges } = await render(
      <ch-tooltip>
        <button slot="trigger">Guardar</button>
        <span slot="content">Guarda los cambios</span>
      </ch-tooltip>,
    );
    const trigger = root.querySelector('button');

    fire(trigger, 'focusin');
    await waitForChanges();
    expect(bubble(root).className).toContain('bubble--visible');

    fire(document, 'keydown', { key: 'Escape' });
    await waitForChanges();
    expect(bubble(root).className).not.toContain('bubble--visible');
  });

  it('closes on Escape when opened by hover, with focus elsewhere on the page', async () => {
    const { root, waitForChanges } = await render(
      <ch-tooltip>
        <button slot="trigger">Guardar</button>
        <span slot="content">Guarda los cambios</span>
      </ch-tooltip>,
    );

    // No focusin: hovering leaves focus wherever it was, so the key never
    // reaches the host and only a document listener can see it.
    fire(root, 'mouseenter');
    await waitForChanges();
    expect(bubble(root).className).toContain('bubble--visible');

    fire(document, 'keydown', { key: 'Escape' });
    await waitForChanges();
    expect(bubble(root).className).not.toContain('bubble--visible');
  });

  it('shows again after an Escape once the pointer comes back', async () => {
    const { root, waitForChanges } = await render(
      <ch-tooltip>
        <button slot="trigger">Guardar</button>
        <span slot="content">Guarda los cambios</span>
      </ch-tooltip>,
    );

    fire(root, 'mouseenter');
    await waitForChanges();
    fire(document, 'keydown', { key: 'Escape' });
    await waitForChanges();
    expect(bubble(root).className).not.toContain('bubble--visible');

    fire(root, 'mouseleave');
    fire(root, 'mouseenter');
    await waitForChanges();

    expect(bubble(root).className).toContain('bubble--visible');
  });

  it('stays visible when the pointer leaves but the trigger still has focus', async () => {
    const { root, waitForChanges } = await render(
      <ch-tooltip>
        <button slot="trigger">Guardar</button>
        <span slot="content">Guarda los cambios</span>
      </ch-tooltip>,
    );
    const trigger = root.querySelector('button');

    fire(trigger, 'focusin');
    fire(root, 'mouseenter');
    await waitForChanges();
    fire(root, 'mouseleave');
    await waitForChanges();

    expect(bubble(root).className).toContain('bubble--visible');
  });

  it('stays visible when focus leaves but the pointer is still over it', async () => {
    const { root, waitForChanges } = await render(
      <ch-tooltip>
        <button slot="trigger">Guardar</button>
        <span slot="content">Guarda los cambios</span>
      </ch-tooltip>,
    );
    const trigger = root.querySelector('button');

    fire(root, 'mouseenter');
    fire(trigger, 'focusin');
    await waitForChanges();
    fire(trigger, 'focusout');
    await waitForChanges();

    expect(bubble(root).className).toContain('bubble--visible');
  });

  it('ignores other keys', async () => {
    const { root, waitForChanges } = await render(
      <ch-tooltip>
        <button slot="trigger">Guardar</button>
        <span slot="content">Guarda los cambios</span>
      </ch-tooltip>,
    );

    fire(root.querySelector('button'), 'focusin');
    await waitForChanges();
    fire(document, 'keydown', { key: 'a' });
    await waitForChanges();

    expect(bubble(root).className).toContain('bubble--visible');
  });

  it('does not throw when only one of the two slots is filled', async () => {
    const { root } = await render(
      <ch-tooltip>
        <button slot="trigger">Guardar</button>
      </ch-tooltip>,
    );
    expect(root.querySelector('button').hasAttribute('aria-describedby')).toBe(false);
    expect(bubble(root)).not.toBe(null);
  });
});
