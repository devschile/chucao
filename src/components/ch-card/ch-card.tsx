import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'ch-card',
  styleUrl: 'ch-card.css',
  shadow: true,
})
export class ChCard {
  render() {
    return (
      <Host>
        <div class="card">
          <slot></slot>
        </div>
      </Host>
    );
  }
}
