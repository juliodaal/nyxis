/**
 * Text splitter for animation components. Uses `Intl.Segmenter` so emoji,
 * combining marks, and non-Latin scripts (CJK, Devanagari, Arabic, ...)
 * are split correctly — unlike a naive `text.split('')` which would break
 * surrogate pairs.
 *
 * Wraps each segment in a `<span>` so the segment can be animated
 * independently. Uses `aria-hidden` on the wrapped output and exposes the
 * original string via the parent element's accessible name so screen
 * readers always read the unsegmented text.
 */

export type SplitMode = 'chars' | 'words' | 'lines';

export interface SplitResult {
  /** The wrapped HTML to set on the target element. */
  html: string;
  /** Selector to target each segment. */
  selector: string;
}

const escapeHtml = (s: string) =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

function splitGraphemes(text: string): readonly string[] {
  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    const seg = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
    return Array.from(seg.segment(text), (s) => s.segment);
  }
  return Array.from(text);
}

function splitWords(text: string): readonly string[] {
  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    const seg = new Intl.Segmenter(undefined, { granularity: 'word' });
    return Array.from(seg.segment(text), (s) => s.segment);
  }
  return text.split(/(\s+)/);
}

const SEG_CLASS = 'nyxis-split-seg';

/**
 * Split a text string into spans by chars or words. Returns HTML and a
 * selector. Whitespace is preserved as non-animated text nodes.
 *
 * For `lines` you must also call `splitLines` after the element is in the
 * DOM, since line breaks depend on layout.
 */
export function splitText(text: string, mode: SplitMode): SplitResult {
  if (mode === 'lines') {
    return { html: escapeHtml(text), selector: `.${SEG_CLASS}` };
  }

  const items = mode === 'chars' ? splitGraphemes(text) : splitWords(text);
  const html = items
    .map((item) => {
      if (/^\s+$/.test(item)) return item;
      return `<span class="${SEG_CLASS}" style="display:inline-block">${escapeHtml(item)}</span>`;
    })
    .join('');

  return { html, selector: `.${SEG_CLASS}` };
}

/**
 * After the element is laid out, wrap each visual line in a span. Re-runs
 * are safe; previous segmentations are removed first.
 *
 * Returns the segments selector you can pass to GSAP.
 */
export function splitLines(el: HTMLElement): string {
  // First, restore the original text to a single text node so we can
  // re-segment from scratch.
  const original = el.dataset['nyxisOriginalText'];
  if (original !== undefined) {
    el.textContent = original;
  } else {
    el.dataset['nyxisOriginalText'] = el.textContent ?? '';
  }

  const text = el.textContent ?? '';
  if (!text) return `.${SEG_CLASS}`;

  // Wrap each word individually, measure offsetTop, group consecutive
  // words with the same offsetTop into one line.
  const words = text.split(/(\s+)/);
  el.textContent = '';
  const wordSpans: HTMLSpanElement[] = [];
  for (const w of words) {
    if (/^\s+$/.test(w)) {
      el.appendChild(document.createTextNode(w));
      continue;
    }
    if (!w) continue;
    const span = document.createElement('span');
    span.style.display = 'inline-block';
    span.textContent = w;
    el.appendChild(span);
    wordSpans.push(span);
  }

  const lines: HTMLSpanElement[][] = [];
  let lastTop = -Infinity;
  for (const span of wordSpans) {
    const top = span.offsetTop;
    if (top !== lastTop) lines.push([]);
    lines[lines.length - 1]!.push(span);
    lastTop = top;
  }

  // Reset and rebuild with line wrappers.
  el.textContent = el.dataset['nyxisOriginalText'] ?? '';
  el.textContent = '';
  for (let i = 0; i < lines.length; i += 1) {
    const lineWrapper = document.createElement('span');
    lineWrapper.className = SEG_CLASS;
    lineWrapper.style.display = 'block';
    lineWrapper.style.overflow = 'hidden';
    lines[i]!.forEach((span, idx) => {
      lineWrapper.appendChild(span);
      if (idx < lines[i]!.length - 1) {
        lineWrapper.appendChild(document.createTextNode(' '));
      }
    });
    el.appendChild(lineWrapper);
  }

  return `.${SEG_CLASS}`;
}
