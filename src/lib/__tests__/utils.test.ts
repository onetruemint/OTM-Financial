import { calculateReadingTime, formatReadingTime, extractHeadings, addHeadingIds, slugify } from '../utils';

describe('calculateReadingTime', () => {
  it('should return 1 minute for short content', () => {
    const content = 'Hello world';
    expect(calculateReadingTime(content)).toBe(1);
  });

  it('should calculate reading time based on word count', () => {
    // 400 words should be 2 minutes (200 words per minute)
    const words = Array(400).fill('word').join(' ');
    expect(calculateReadingTime(words)).toBe(2);
  });

  it('should strip HTML tags before counting', () => {
    const content = '<p>Hello</p> <strong>world</strong>';
    expect(calculateReadingTime(content)).toBe(1);
  });

  it('should handle empty content', () => {
    expect(calculateReadingTime('')).toBe(1);
  });

  it('should round up to nearest minute', () => {
    // 250 words should round up to 2 minutes
    const words = Array(250).fill('word').join(' ');
    expect(calculateReadingTime(words)).toBe(2);
  });
});

describe('formatReadingTime', () => {
  it('should format reading time correctly', () => {
    expect(formatReadingTime(1)).toBe('1 min read');
    expect(formatReadingTime(5)).toBe('5 min read');
    expect(formatReadingTime(10)).toBe('10 min read');
  });
});

describe('extractHeadings', () => {
  it('should extract h2 and h3 headings', () => {
    const content = '<h2>First</h2><p>text</p><h3>Second</h3>';
    const headings = extractHeadings(content);
    expect(headings).toHaveLength(2);
    expect(headings[0]).toEqual({ id: 'first', text: 'First', level: 2 });
    expect(headings[1]).toEqual({ id: 'second', text: 'Second', level: 3 });
  });

  it('should extract existing id attribute', () => {
    const content = '<h2 id="custom-id">Title</h2>';
    const headings = extractHeadings(content);
    expect(headings[0].id).toBe('custom-id');
  });

  it('should extract id with single quotes', () => {
    const content = "<h2 id='single-quote'>Title</h2>";
    const headings = extractHeadings(content);
    expect(headings[0].id).toBe('single-quote');
  });

  it('should generate slug from text when no id', () => {
    const content = '<h2>Hello World</h2>';
    const headings = extractHeadings(content);
    expect(headings[0].id).toBe('hello-world');
  });

  it('should return empty array for no headings', () => {
    const content = '<p>No headings here</p>';
    expect(extractHeadings(content)).toEqual([]);
  });

  it('should handle multiple headings of same level', () => {
    const content = '<h2>One</h2><h2>Two</h2><h2>Three</h2>';
    const headings = extractHeadings(content);
    expect(headings).toHaveLength(3);
  });

  it('should extract h4, h5, h6 headings', () => {
    const content = '<h4>Four</h4><h5>Five</h5><h6>Six</h6>';
    const headings = extractHeadings(content);
    expect(headings).toHaveLength(3);
    expect(headings[0].level).toBe(4);
    expect(headings[1].level).toBe(5);
    expect(headings[2].level).toBe(6);
  });

  it('should trim whitespace from heading text', () => {
    const content = '<h2>  Spaced Title  </h2>';
    const headings = extractHeadings(content);
    expect(headings[0].text).toBe('Spaced Title');
  });

  it('should handle headings with classes', () => {
    const content = '<h2 class="title" id="my-id">Title</h2>';
    const headings = extractHeadings(content);
    expect(headings[0].id).toBe('my-id');
  });
});

describe('addHeadingIds', () => {
  it('should add id to headings without id', () => {
    const content = '<h2>My Title</h2>';
    const result = addHeadingIds(content);
    expect(result).toBe('<h2 id="my-title">My Title</h2>');
  });

  it('should preserve existing ids', () => {
    const content = '<h2 id="existing">Title</h2>';
    const result = addHeadingIds(content);
    expect(result).toBe('<h2 id="existing">Title</h2>');
  });

  it('should handle multiple headings', () => {
    const content = '<h2>First</h2><h3>Second</h3>';
    const result = addHeadingIds(content);
    expect(result).toContain('id="first"');
    expect(result).toContain('id="second"');
  });

  it('should ensure unique ids for duplicate headings', () => {
    const content = '<h2>Title</h2><h2>Title</h2><h2>Title</h2>';
    const result = addHeadingIds(content);
    expect(result).toContain('id="title"');
    expect(result).toContain('id="title-1"');
    expect(result).toContain('id="title-2"');
  });

  it('should preserve other attributes', () => {
    const content = '<h2 class="heading">Title</h2>';
    const result = addHeadingIds(content);
    expect(result).toBe('<h2 class="heading" id="title">Title</h2>');
  });

  it('should handle all heading levels', () => {
    const content = '<h2>Two</h2><h3>Three</h3><h4>Four</h4><h5>Five</h5><h6>Six</h6>';
    const result = addHeadingIds(content);
    expect(result).toContain('<h2 id="two">');
    expect(result).toContain('<h3 id="three">');
    expect(result).toContain('<h4 id="four">');
    expect(result).toContain('<h5 id="five">');
    expect(result).toContain('<h6 id="six">');
  });

  it('should not modify non-heading content', () => {
    const content = '<p>Paragraph</p><h2>Heading</h2><p>More text</p>';
    const result = addHeadingIds(content);
    expect(result).toBe('<p>Paragraph</p><h2 id="heading">Heading</h2><p>More text</p>');
  });
});

describe('slugify', () => {
  it('should convert to lowercase', () => {
    expect(slugify('Hello World')).toBe('hello-world');
  });

  it('should replace spaces with hyphens', () => {
    expect(slugify('hello world test')).toBe('hello-world-test');
  });

  it('should remove special characters', () => {
    expect(slugify('hello@world!')).toBe('helloworld');
  });

  it('should collapse multiple hyphens', () => {
    expect(slugify('hello   world')).toBe('hello-world');
  });

  it('should handle empty string', () => {
    expect(slugify('')).toBe('');
  });

  it('should handle string with only special characters', () => {
    expect(slugify('!@#$%')).toBe('');
  });
});
