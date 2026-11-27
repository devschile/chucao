import { render, h, describe, it, expect } from '@stencil/vitest';

import './ch-stack.tsx';

describe('ch-stack', () => {
  it('stacks children vertically by default', async () => {
    const { root } = await render(
      <ch-stack>
        <p>Uno</p>
        <p>Dos</p>
      </ch-stack>,
    );

    expect(root.shadowRoot.querySelector('slot')).not.toBe(null);
    expect(root.classList.contains('stack')).toBe(true);
    expect(root.classList.contains('stack--gap-md')).toBe(true);
    expect(root.classList.contains('stack--align-stretch')).toBe(true);
    expect(root.classList.contains('stack--justify-start')).toBe(true);
  });

  it('maps every gap scale step to its token class', async () => {
    for (const gap of ['none', '2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl']) {
      const { root } = await render(<ch-stack gap={gap as 'md'} />);
      expect(root.classList.contains(`stack--gap-${gap}`)).toBe(true);
    }
  });

  it('falls back to md for an unknown gap', async () => {
    const { root } = await render(<ch-stack gap={'huge' as never} />);
    expect(root.classList.contains('stack--gap-md')).toBe(true);
    expect(root.classList.contains('stack--gap-huge')).toBe(false);
  });

  it('applies align and justify variants', async () => {
    const { root } = await render(<ch-stack align="center" justify="between" />);
    expect(root.classList.contains('stack--align-center')).toBe(true);
    expect(root.classList.contains('stack--justify-between')).toBe(true);
  });
});
