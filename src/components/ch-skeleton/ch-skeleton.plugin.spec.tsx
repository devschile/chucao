import { render, h, describe, it, expect } from '@stencil/vitest';

import './ch-skeleton.tsx';

describe('ch-skeleton', () => {
  it('renders one decorative line by default', async () => {
    const { root } = await render(<ch-skeleton />);
    const items = root.shadowRoot.querySelectorAll('.skeleton__item');

    expect(items).toHaveLength(1);
    expect(root.getAttribute('aria-hidden')).toBe('true');
    expect(root.classList.contains('skeleton--line')).toBe(true);
    expect(root.classList.contains('skeleton--animated')).toBe(true);
  });

  it('renders count placeholders', async () => {
    const { root } = await render(<ch-skeleton count={3} />);
    expect(root.shadowRoot.querySelectorAll('.skeleton__item')).toHaveLength(3);
  });

  it('falls back to one placeholder for a count below 1', async () => {
    const { root } = await render(<ch-skeleton count={0} />);
    expect(root.shadowRoot.querySelectorAll('.skeleton__item')).toHaveLength(1);
  });

  it('makes a circle square from its width', async () => {
    const { root } = await render(<ch-skeleton shape="circle" width="2.5rem" height="9rem" />);
    const item = root.shadowRoot.querySelector('.skeleton__item') as HTMLElement;

    expect(root.classList.contains('skeleton--circle')).toBe(true);
    expect(item.style.width).toBe('2.5rem');
    expect(item.style.height).toBe('2.5rem');
  });

  it('applies width and height to a rectangle', async () => {
    const { root } = await render(<ch-skeleton shape="rect" width="8rem" height="4rem" />);
    const item = root.shadowRoot.querySelector('.skeleton__item') as HTMLElement;

    expect(root.classList.contains('skeleton--rect')).toBe(true);
    expect(item.style.width).toBe('8rem');
    expect(item.style.height).toBe('4rem');
  });

  it('drops the animation class when animated is off', async () => {
    const { root } = await render(<ch-skeleton animated={false} />);
    expect(root.classList.contains('skeleton--animated')).toBe(false);
  });

  it('stays out of the accessibility tree', async () => {
    const { root } = await render(<ch-skeleton count={2} />);
    expect(root.getAttribute('aria-hidden')).toBe('true');
  });
});
