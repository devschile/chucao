import { render, h, describe, it, expect } from '@stencil/vitest';

import './ch-stat.tsx';

function valueSpan(root: HTMLElement) {
  return root.shadowRoot.querySelector('.stat__value');
}

describe('ch-stat', () => {
  it('renders the label and the consumer-formatted value verbatim', async () => {
    const { root } = await render(<ch-stat label="Ventas del mes" value="$1.250.000" />);

    expect(root.shadowRoot.querySelector('.stat__label').textContent).toBe('Ventas del mes');
    expect(valueSpan(root).textContent).toBe('$1.250.000');
  });

  it('renders the hint only when passed', async () => {
    const withHint = await render(<ch-stat label="A" value="1" hint="vs. mes anterior" />);
    const withoutHint = await render(<ch-stat label="A" value="1" />);

    expect(withHint.root.shadowRoot.querySelector('.stat__hint').textContent).toBe('vs. mes anterior');
    expect(withoutHint.root.shadowRoot.querySelector('.stat__hint')).toBeNull();
  });

  it('adds a sign cue for positive and negative tones so the tone survives greyscale', async () => {
    const positive = await render(<ch-stat label="A" value="12" tone="positive" />);
    const negative = await render(<ch-stat label="A" value="8" tone="negative" />);

    const plus = positive.root.shadowRoot.querySelector('.stat__cue');
    const minus = negative.root.shadowRoot.querySelector('.stat__cue');
    expect(plus.textContent).toBe('+');
    expect(plus.getAttribute('aria-hidden')).toBe('true');
    expect(minus.textContent).toBe('−');
  });

  it('adds no sign cue for the default and unavailable tones', async () => {
    const plain = await render(<ch-stat label="A" value="1" />);
    const unavailable = await render(<ch-stat label="A" value="—" tone="unavailable" />);

    expect(plain.root.shadowRoot.querySelector('.stat__cue')).toBeNull();
    expect(unavailable.root.shadowRoot.querySelector('.stat__cue')).toBeNull();
    expect(valueSpan(unavailable.root).className).toContain('stat__value--unavailable');
  });

  it('falls back to the default tone on an unknown value', async () => {
    const { root } = await render(<ch-stat label="A" value="1" tone={'banana' as 'positive'} />);
    expect(valueSpan(root).className).toBe('stat__value');
  });

  it('offers the value and footer slots for composed content', async () => {
    const { root } = await render(<ch-stat label="A" value="1" />);
    expect(root.shadowRoot.querySelector('slot[name="value"]')).not.toBeNull();
    expect(root.shadowRoot.querySelector('slot[name="footer"]')).not.toBeNull();
  });
});
