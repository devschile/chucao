import { Component, Event, type EventEmitter, Host, Prop, Watch, h } from '@stencil/core';

import { lockScroll as lockPageScroll, unlockScroll as unlockPageScroll } from '../../utils/scroll-lock';

export type ChDrawerSide = 'start' | 'end' | 'top' | 'bottom';

/**
 * Sliding side panel for navigation, editing forms and quick detail views.
 *
 * Built on the native `<dialog>` element and opened with `showModal()`, exactly
 * like `ch-modal`, so the browser owns focus management, the inert background,
 * `Escape`, the top layer, `::backdrop`, and the implicit `dialog` role with
 * `aria-modal="true"`. The only differences are placement — anchored to one
 * edge instead of centred — and the longer content it is meant for, which is
 * why it exposes `header` and `footer` slots around a scrollable body.
 *
 * Scroll locking is shared with `ch-modal` through `utils/scroll-lock`, so a
 * drawer and a modal opened together cannot unlock the page early.
 */
@Component({
  tag: 'ch-drawer',
  styleUrl: 'ch-drawer.css',
  shadow: true,
})
export class ChDrawer {
  /**
   * Whether the drawer is open. Kept in sync when the user closes it with
   * `Escape`, the close button or a click outside.
   */
  @Prop({ mutable: true }) open = false;

  /**
   * The edge the panel slides in from. `start`/`end` follow the writing
   * direction, so `start` is the left edge in LTR and the right edge in RTL.
   */
  @Prop() side: ChDrawerSide = 'end';

  /**
   * Accessible name for the drawer, set as `aria-label`. A slotted heading
   * cannot be referenced with `aria-labelledby` across the shadow boundary, so
   * the name comes through this prop — and a modal dialog needs one, so pass
   * the same text as the heading.
   */
  @Prop() label?: string;

  /**
   * Accessible label for the close button, set as `aria-label`. Setting it is
   * what adds the button: its only content is a decorative glyph, so without a
   * label it would have no accessible name.
   */
  @Prop() closeLabel?: string;

  /**
   * Emitted after the drawer opens.
   */
  @Event() chOpen: EventEmitter<void>;

  /**
   * Emitted after the drawer closes, however it was closed.
   */
  @Event() chClose: EventEmitter<void>;

  private dialog?: HTMLDialogElement;
  private scrollLocked = false;
  private pointerDownedOutside = false;

  componentDidLoad() {
    // Wired here rather than in JSX because Stencil derives a listener's event
    // name from whether `on<name>` exists on `window`, which differs between
    // the browser and the test environment for pointer events.
    this.dialog?.addEventListener('close', this.handleNativeClose);
    this.dialog?.addEventListener('pointerdown', this.handlePointerDown);
    this.dialog?.addEventListener('click', this.handleClick);
    if (this.open) {
      this.showDialog();
    }
  }

  disconnectedCallback() {
    this.dialog?.removeEventListener('close', this.handleNativeClose);
    this.dialog?.removeEventListener('pointerdown', this.handlePointerDown);
    this.dialog?.removeEventListener('click', this.handleClick);
    this.unlockScroll();
  }

  @Watch('open')
  handleOpenChange(open: boolean) {
    if (open) {
      this.showDialog();
    } else {
      this.closeDialog();
    }
  }

  private showDialog() {
    if (typeof this.dialog?.showModal !== 'function') {
      return;
    }
    this.lockScroll();
    this.dialog.showModal();
    this.chOpen.emit();
  }

  private closeDialog() {
    if (typeof this.dialog?.close === 'function' && this.dialog.open) {
      this.dialog.close();
    }
  }

  private lockScroll() {
    if (this.scrollLocked) {
      return;
    }
    this.scrollLocked = true;
    lockPageScroll();
  }

  private unlockScroll() {
    if (!this.scrollLocked) {
      return;
    }
    this.scrollLocked = false;
    unlockPageScroll();
  }

  /**
   * True for a pointer event on the backdrop: the `<dialog>` is the event
   * target for its own box only, and the coordinates fall outside that box.
   */
  private isOnBackdrop(event: MouseEvent) {
    if (!this.dialog || event.target !== this.dialog) {
      return false;
    }
    const box = this.dialog.getBoundingClientRect();
    return event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom;
  }

  private handlePointerDown = (event: Event) => {
    this.pointerDownedOutside = this.isOnBackdrop(event as MouseEvent);
  };

  private handleClick = (event: Event) => {
    // Requiring the press to have started on the backdrop too keeps a
    // selection dragged out of the drawer, and a keyboard-synthesised click
    // (which reports coordinates of 0), from closing it.
    const dismiss = this.pointerDownedOutside && this.isOnBackdrop(event as MouseEvent);
    this.pointerDownedOutside = false;
    if (dismiss) {
      this.closeDialog();
    }
  };

  private handleNativeClose = () => {
    this.unlockScroll();
    if (this.open) {
      this.open = false;
    }
    this.chClose.emit();
  };

  private handleCloseClick = () => {
    if (typeof this.dialog?.close === 'function' && this.dialog.open) {
      this.dialog.close();
      return;
    }
    this.open = false;
    this.chClose.emit();
  };

  render() {
    return (
      <Host>
        <dialog class={{ drawer: true, [`drawer--${this.side}`]: true }} aria-label={this.label} ref={el => (this.dialog = el as HTMLDialogElement)}>
          <div class="drawer-head">
            <slot name="header"></slot>
            {this.closeLabel && (
              <button class="drawer-close" type="button" aria-label={this.closeLabel} onClick={this.handleCloseClick}>
                <span aria-hidden="true">×</span>
              </button>
            )}
          </div>
          <div class="drawer-body">
            <slot></slot>
          </div>
          <slot name="footer"></slot>
        </dialog>
      </Host>
    );
  }
}
