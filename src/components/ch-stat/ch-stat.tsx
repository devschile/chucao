import { Component, Host, Prop, h } from '@stencil/core';

export type ChStatTone = 'default' | 'positive' | 'negative' | 'unavailable';

const TONES = new Set(['default', 'positive', 'negative', 'unavailable']);

/**
 * One dashboard metric: a label, a value and an optional hint.
 *
 * The value is a string the consumer has already formatted — the component
 * never parses numbers, so locale, currency and precision stay where the
 * data comes from. On a fetch error, pass the em dash and the unavailable
 * tone rather than a zero that would read as a real measurement:
 *
 * ```html
 * <ch-stat label="Ventas del mes" value="$1.250.000" tone="positive"></ch-stat>
 * <ch-stat label="Ticket promedio" value="—" tone="unavailable"></ch-stat>
 * ```
 *
 * A tone is never carried by colour alone: positive and negative values get
 * a visible sign cue, so the three states stay distinguishable in greyscale
 * and for colour-blind users. The `value` slot replaces the rendered value
 * for composed content (a link, a spinner), and the `footer` slot sits under
 * the hint for a comparison line or a sparkline.
 */
@Component({
  tag: 'ch-stat',
  styleUrl: 'ch-stat.css',
  shadow: true,
})
export class ChStat {
  /**
   * Short label naming the metric, rendered in small caps above the value.
   */
  @Prop() label!: string;

  /**
   * The metric value, already formatted by the consumer. Shown verbatim.
   */
  @Prop() value!: string;

  /**
   * Secondary line under the value — a comparison or a unit note.
   */
  @Prop() hint?: string;

  /**
   * Visual tone of the value. `positive` and `negative` add a sign cue so
   * the tone survives greyscale; `unavailable` dims the value for the
   * "could not be measured" case. An unknown value falls back to `default`.
   */
  @Prop() tone: ChStatTone = 'default';

  private get toneClass() {
    return TONES.has(this.tone) ? this.tone : 'default';
  }

  render() {
    const cue = this.toneClass === 'positive' ? '+' : this.toneClass === 'negative' ? '−' : null;

    return (
      <Host class="stat">
        <div class="stat__inner">
          <span class="stat__label">{this.label}</span>
          <span
            class={{
              stat__value: true,
              [`stat__value--${this.toneClass}`]: this.toneClass !== 'default',
            }}
          >
            {cue && (
              <span class="stat__cue" aria-hidden="true">
                {cue}
              </span>
            )}
            <slot name="value">{this.value}</slot>
          </span>
          {this.hint && <span class="stat__hint">{this.hint}</span>}
          <div class="stat__footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </Host>
    );
  }
}
