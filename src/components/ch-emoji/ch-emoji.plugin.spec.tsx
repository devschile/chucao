import { render, h, describe, it, expect } from '@stencil/vitest';

import './ch-emoji.tsx';

describe('ch-emoji', () => {
  it('renders an image with the correct default src', async () => {
    const { root } = await render(<ch-emoji name="huemul-love"></ch-emoji>);
    await expect(root).toEqualHtml(`
      <ch-emoji class="hydrated">
        <mock:shadow-root>
          <img class="emoji emoji--md emoji--hidden" src="https://static.devschile.cl/emoji/huemul-love.png" alt="huemul-love">
        </mock:shadow-root>
      </ch-emoji>
    `);
  });

  it('resolves an alias through the emoji map', async () => {
    const { root } = await render(<ch-emoji name="heart"></ch-emoji>);
    const img = root.shadowRoot.querySelector('img');
    expect(img.getAttribute('src')).toBe('https://static.devschile.cl/emoji/huemul-love.png');
  });

  it('uses the name directly when not in the map', async () => {
    const { root } = await render(<ch-emoji name="custom-emoji"></ch-emoji>);
    const img = root.shadowRoot.querySelector('img');
    expect(img.getAttribute('src')).toBe('https://static.devschile.cl/emoji/custom-emoji.png');
  });

  it('applies the size variant class', async () => {
    const { root } = await render(<ch-emoji name="huemul-love" size="lg"></ch-emoji>);
    const img = root.shadowRoot.querySelector('img');
    expect(img.classList.contains('emoji--lg')).toBe(true);
  });

  it('uses name as default alt text', async () => {
    const { root } = await render(<ch-emoji name="huemul-love"></ch-emoji>);
    const img = root.shadowRoot.querySelector('img');
    expect(img.getAttribute('alt')).toBe('huemul-love');
  });

  it('uses custom alt text when provided', async () => {
    const { root } = await render(<ch-emoji name="huemul-love" alt="Love emoji"></ch-emoji>);
    const img = root.shadowRoot.querySelector('img');
    expect(img.getAttribute('alt')).toBe('Love emoji');
  });
});
