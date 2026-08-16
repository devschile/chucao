import { render, h, describe, it, expect } from '@stencil/vitest';

import './ch-link.tsx';

describe('ch-link', () => {
  it('renders an anchor with the given href', async () => {
    const { root } = await render(<ch-link href="https://devschile.cl">devsChile</ch-link>);
    const anchor = root.shadowRoot?.querySelector('a');

    expect(anchor).not.toBeNull();
    expect(anchor?.getAttribute('href')).toBe('https://devschile.cl');
  });

  it('adds noopener noreferrer rel when target is _blank', async () => {
    const { root } = await render(
      <ch-link href="https://devschile.cl" target="_blank">
        devsChile
      </ch-link>,
    );
    const anchor = root.shadowRoot?.querySelector('a');

    expect(anchor?.getAttribute('target')).toBe('_blank');
    expect(anchor?.getAttribute('rel')).toBe('noopener noreferrer');
  });

  it('omits rel when the target is not _blank', async () => {
    const { root } = await render(<ch-link href="https://devschile.cl">devsChile</ch-link>);
    expect(root.shadowRoot?.querySelector('a')?.hasAttribute('rel')).toBe(false);
  });

  it('renders a muted link variant', async () => {
    const { root } = await render(
      <ch-link href="#x" variant="muted">
        Link
      </ch-link>,
    );
    expect(root.shadowRoot?.querySelector('a')?.classList.contains('link--muted')).toBe(true);
  });

  it('renders the internal element with a link part', async () => {
    const { root } = await render(<ch-link href="#x">Link</ch-link>);
    expect(root.shadowRoot?.querySelector('a')?.getAttribute('part')).toBe('link');
  });

  it('exposes a link part on the disabled element', async () => {
    const { root } = await render(
      <ch-link href="#x" disabled>
        Link
      </ch-link>,
    );
    expect(root.shadowRoot?.querySelector('span.link--disabled')?.getAttribute('part')).toBe('link');
  });

  it('renders a non-interactive element with aria-disabled when disabled', async () => {
    const { root } = await render(
      <ch-link href="https://devschile.cl" disabled>
        devsChile
      </ch-link>,
    );
    const span = root.shadowRoot?.querySelector('span.link--disabled');

    expect(root.shadowRoot?.querySelector('a')).toBeNull();
    expect(span?.getAttribute('aria-disabled')).toBe('true');
  });

  it('emits chClick when clicked', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(<ch-link href="#x">Link</ch-link>);
    const clickSpy = spyOnEvent('chClick');

    root.shadowRoot?.querySelector('a')?.click();
    await waitForChanges();

    expect(clickSpy).toHaveReceivedEvent();
  });

  it('does not emit chClick when disabled', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(
      <ch-link href="#x" disabled>
        Link
      </ch-link>,
    );
    const clickSpy = spyOnEvent('chClick');

    root.shadowRoot?.querySelector('span')?.click();
    await waitForChanges();

    expect(clickSpy).not.toHaveReceivedEvent();
  });
});
