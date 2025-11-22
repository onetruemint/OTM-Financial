// Mock isomorphic-dompurify
jest.mock('isomorphic-dompurify', () => ({
  sanitize: jest.fn((html: string, options: any) => {
    // Simple mock that removes script tags and event handlers
    let result = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '')
      .replace(/<form[^>]*>.*?<\/form>/gi, '')
      .replace(/\s*on\w+="[^"]*"/gi, '');
    return result;
  }),
}));

import { sanitizeHtml, escapeRegex } from '../sanitize';

describe('sanitizeHtml', () => {
  it('should allow basic formatting tags', () => {
    const html = '<p>Hello <strong>world</strong></p>';
    expect(sanitizeHtml(html)).toBe(html);
  });

  it('should allow headings', () => {
    const html = '<h1>Title</h1><h2>Subtitle</h2>';
    expect(sanitizeHtml(html)).toBe(html);
  });

  it('should allow lists', () => {
    const html = '<ul><li>Item 1</li><li>Item 2</li></ul>';
    expect(sanitizeHtml(html)).toBe(html);
  });

  it('should allow links with href', () => {
    const html = '<a href="https://example.com">Link</a>';
    expect(sanitizeHtml(html)).toContain('href="https://example.com"');
  });

  it('should allow images with src and alt', () => {
    const html = '<img src="image.jpg" alt="Test">';
    const result = sanitizeHtml(html);
    expect(result).toContain('src="image.jpg"');
    expect(result).toContain('alt="Test"');
  });

  it('should remove script tags', () => {
    const html = '<p>Safe</p><script>alert("XSS")</script>';
    expect(sanitizeHtml(html)).toBe('<p>Safe</p>');
  });

  it('should remove style tags', () => {
    const html = '<p>Safe</p><style>body{display:none}</style>';
    expect(sanitizeHtml(html)).toBe('<p>Safe</p>');
  });

  it('should remove iframe tags', () => {
    const html = '<p>Safe</p><iframe src="evil.com"></iframe>';
    expect(sanitizeHtml(html)).toBe('<p>Safe</p>');
  });

  it('should remove form and input tags', () => {
    const html = '<form><input type="text"></form>';
    expect(sanitizeHtml(html)).toBe('');
  });

  it('should remove event handlers', () => {
    const html = '<img src="x" onerror="alert(1)">';
    const result = sanitizeHtml(html);
    expect(result).not.toContain('onerror');
  });

  it('should remove onclick handlers', () => {
    const html = '<button onclick="alert(1)">Click</button>';
    const result = sanitizeHtml(html);
    expect(result).not.toContain('onclick');
  });

  it('should allow tables', () => {
    const html = '<table><thead><tr><th>Header</th></tr></thead><tbody><tr><td>Data</td></tr></tbody></table>';
    expect(sanitizeHtml(html)).toBe(html);
  });

  it('should allow code and pre tags', () => {
    const html = '<pre><code>const x = 1;</code></pre>';
    expect(sanitizeHtml(html)).toBe(html);
  });

  it('should allow blockquote', () => {
    const html = '<blockquote>Quote</blockquote>';
    expect(sanitizeHtml(html)).toBe(html);
  });

  it('should allow class and id attributes', () => {
    const html = '<div class="container" id="main">Content</div>';
    const result = sanitizeHtml(html);
    expect(result).toContain('class="container"');
    expect(result).toContain('id="main"');
  });

  it('should handle empty input', () => {
    expect(sanitizeHtml('')).toBe('');
  });
});

describe('escapeRegex', () => {
  it('should escape special regex characters', () => {
    expect(escapeRegex('.')).toBe('\\.');
    expect(escapeRegex('*')).toBe('\\*');
    expect(escapeRegex('+')).toBe('\\+');
    expect(escapeRegex('?')).toBe('\\?');
    expect(escapeRegex('^')).toBe('\\^');
    expect(escapeRegex('$')).toBe('\\$');
    expect(escapeRegex('{')).toBe('\\{');
    expect(escapeRegex('}')).toBe('\\}');
    expect(escapeRegex('(')).toBe('\\(');
    expect(escapeRegex(')')).toBe('\\)');
    expect(escapeRegex('|')).toBe('\\|');
    expect(escapeRegex('[')).toBe('\\[');
    expect(escapeRegex(']')).toBe('\\]');
    expect(escapeRegex('\\')).toBe('\\\\');
  });

  it('should escape multiple special characters', () => {
    expect(escapeRegex('test.*+?')).toBe('test\\.\\*\\+\\?');
  });

  it('should leave normal characters unchanged', () => {
    expect(escapeRegex('hello world')).toBe('hello world');
  });

  it('should handle empty string', () => {
    expect(escapeRegex('')).toBe('');
  });

  it('should escape regex pattern', () => {
    const pattern = '[a-z]+';
    const escaped = escapeRegex(pattern);
    expect(escaped).toBe('\\[a-z\\]\\+');
  });
});
