import { Component, Event, type EventEmitter, Host, Prop, Watch, h } from '@stencil/core';

let openModals = 0;
let previousOverflow = '';
let previousPaddingRight = '';

/**
 * Modal dialog, built on the native `<dialog>` element and opened with
 * `showModal()`.
 *
 * The browser therefore supplies the parts that are easy to get wrong: moving
 * focus into the dialog and returning it afterwards, marking the rest of the
 * document inert, `Escape` to close, the top layer, `::backdrop`, and the
 * implicit `dialog` role with `aria-modal="true"`. Notably it does not trap
 * focus, which is deliberate — the W3C APA group concluded a modal should let
 * keyboard users reach browser UI, so a hand-rolled trap would be less
 * correct, not more.
 *
 * What the platform does not cover, and this component adds: locking the page
 * behind the dialog so it cannot scroll, and closing when the backdrop is
 * clicked. The latter is `closedby="any"` in the platform, which Safari does
 * not support yet, so it is implemented here for every browser alike rather
 * than only for some.
 */
@Component({
  tag: 'ch-modal',
  styleUrl: 'ch-modal.css',
  shadow: true,
})
export class ChModal {
  /**
   * Whether the dialog is open. Kept in sync when the user closes it with
   * `Escape`, the close button or a click outside.
   */
  @Prop({ mutable: true }) open = false;

  /**
   * Accessible name for the dialog, set as `aria-label`. A slotted heading
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
   * Emitted after the dialog opens.
   */
  @Event() chOpen: EventEmitter<void>;

  /**
   * Emitted after the dialog closes, however it was closed.
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
    openModals += 1;
    if (openModals > 1) {
      return;
    }
    const root = document.documentElement;
    const scrollbar = window.innerWidth - root.clientWidth;
    previousOverflow = root.style.overflow;
    previousPaddingRight = root.style.paddingRight;
    root.style.overflow = 'hidden';
    if (scrollbar > 0) {
      root.style.paddingRight = `${scrollbar}px`;
    }
  }

  private unlockScroll() {
    if (!this.scrollLocked) {
      return;
    }
    this.scrollLocked = false;
    openModals -= 1;
    if (openModals > 0) {
      return;
    }
    const root = document.documentElement;
    root.style.overflow = previousOverflow;
    root.style.paddingRight = previousPaddingRight;
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
    // selection dragged out of the dialog, and a keyboard-synthesised click
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
        <dialog class="modal" aria-label={this.label} ref={el => (this.dialog = el as HTMLDialogElement)}>
          <div class="modal-head">
            <slot name="heading"></slot>
            {this.closeLabel && (
              <button class="modal-close" type="button" aria-label={this.closeLabel} onClick={this.handleCloseClick}>
                <span aria-hidden="true">×</span>
              </button>
            )}
          </div>
          <div class="modal-body">
            <slot></slot>
          </div>
        </dialog>
      </Host>
    );
  }
}
