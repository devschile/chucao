import { Build } from '@stencil/core';

const warned = new WeakSet<Element>();

export function hasLightDomText(host: Element): boolean {
  return Array.from(host.childNodes).some((child) => {
    if (child.nodeType !== 3 && child.nodeType !== 1) {
      return false;
    }
    if (child.nodeType === 1 && (child as Element).hasAttribute('slot')) {
      return false;
    }
    return (child.textContent ?? '').trim() !== '';
  });
}

export function warnMissingName(host: Element, tag: string, reason: string) {
  if (!Build.isDev && !Build.isTesting) {
    return;
  }
  if (typeof globalThis.window === 'undefined' || warned.has(host)) {
    return;
  }
  warned.add(host);
  console.warn(`[chucao] <${tag}> has no accessible name: ${reason}. See docs/components.md.`);
}
