import DOMPurify from 'isomorphic-dompurify';

// Sanitize HTML content to prevent XSS attacks
export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'p', 'br', 'hr',
      'ul', 'ol', 'li',
      'strong', 'em', 'u', 's', 'del', 'ins', 'mark', 'sub', 'sup',
      'a', 'blockquote', 'code', 'pre', 'kbd', 'samp', 'var',
      'img', 'figure', 'figcaption', 'picture', 'source',
      'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'caption', 'colgroup', 'col',
      'div', 'span', 'section', 'article', 'aside', 'header', 'footer', 'nav',
      'details', 'summary',
      'abbr', 'cite', 'dfn', 'time', 'address',
      'dl', 'dt', 'dd',
    ],
    ALLOWED_ATTR: [
      'href', 'src', 'alt', 'title', 'class', 'id',
      'target', 'rel', 'width', 'height',
      'datetime', 'open', 'colspan', 'rowspan', 'scope',
      'srcset', 'sizes', 'media', 'type',
      'lang', 'dir', 'translate',
    ],
    ALLOW_DATA_ATTR: false,
    ADD_ATTR: ['target'],
    FORBID_TAGS: ['script', 'style', 'iframe', 'form', 'input'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover'],
  });
}

// Escape special regex characters to prevent ReDoS
export function escapeRegex(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
