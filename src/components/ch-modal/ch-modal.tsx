import { Component, Event, type EventEmitter, Host, Prop, Watch, h } from '@stencil/core';

/**
 * Modal dialog, built on the native `<dialog>` element and opened with
 * `showModal()`.
 *
 * The browser therefore supplies the parts that are easy to get wrong: focus
 * management, marking the rest of the document inert, `Escape` to close, the
 * top layer, `::backdrop`, and the implicit `dialog` role with
 * `aria-modal="true"`. Notably it does not trap focus, which is deliberate —
 * the W3C APA group concluded a modal should let keyboard users reach browser
 * UI, so a hand-rolled trap would be less correct, not more.
 *
 * What the platform does not do, and this component does: returning focus to
 * whatever was focused before opening, and locking background scroll.
 */
@Component({
  tag: 'ch-modal',
  styleUrl: 'ch-modal.css',
  shadow: true,
})
export class ChModal {
  /**
   * Whether the dialog is open. Kept in sync when the user closes it with
   * `Escape` or the close button.
   */
  @Prop({ mutable: true }) open = false;

  /**
   * Accessible name for the dialog, set as `aria-label`. A slotted heading
   * cannot be referenced with `aria-labelledby` across the shadow boundary, so
   * the name comes through this prop.
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
  private previouslyFocused?: HTMLElement;
  private previousOverflow = '';
  private previousPaddingRight = '';

  componentDidLoad() {
    if (this.open) {
      this.showDialog();
    }
  }

  disconnectedCallback() {
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
    // Absent in server rendering and in the test environment, neither of which
    // implements the dialog API.
    if (typeof this.dialog?.showModal !== 'function') {
      return;
    }
    this.previouslyFocused = document.activeElement as HTMLElement;
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
    const root = document.documentElement;
    // Compensating for the scrollbar's width keeps the page from shifting
    // sideways as it disappears.
    const scrollbar = window.innerWidth - root.clientWidth;
    this.previousOverflow = root.style.overflow;
    this.previousPaddingRight = root.style.paddingRight;
    root.style.overflow = 'hidden';
    if (scrollbar > 0) {
      root.style.paddingRight = `${scrollbar}px`;
    }
  }

  private unlockScroll() {
    const root = document.documentElement;
    root.style.overflow = this.previousOverflow;
    root.style.paddingRight = this.previousPaddingRight;
  }

  /** Fires for every close, including `Escape`, so `open` cannot drift. */
  private handleNativeClose = () => {
    this.unlockScroll();
    if (this.previouslyFocused && typeof this.previouslyFocused.focus === 'function') {
      this.previouslyFocused.focus();
    }
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
    // Without the dialog API there is no native close event to react to.
    this.open = false;
    this.chClose.emit();
  };

  render() {
    return (
      <Host>
        <dialog class="modal" aria-label={this.label} ref={el => (this.dialog = el as HTMLDialogElement)} onClose={this.handleNativeClose}>
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
