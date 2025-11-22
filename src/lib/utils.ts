// Calculate reading time for content
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const text = content.replace(/<[^>]*>/g, ''); // Strip HTML tags
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);
  return Math.max(1, readingTime);
}

// Format reading time for display
export function formatReadingTime(minutes: number): string {
  return `${minutes} min read`;
}

// Extract headings from HTML content for table of contents
export function extractHeadings(content: string): Array<{ id: string; text: string; level: number }> {
  const headingRegex = /<h([2-3])[^>]*(?:id="([^"]*)")?[^>]*>([^<]+)<\/h[2-3]>/gi;
  const headings: Array<{ id: string; text: string; level: number }> = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = parseInt(match[1]);
    const id = match[2] || match[3].toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
    const text = match[3];
    headings.push({ id, text, level });
  }

  return headings;
}

// Generate slug from text
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '')
    .replace(/--+/g, '-')
    .trim();
}
