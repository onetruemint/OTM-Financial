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
  const headings: Array<{ id: string; text: string; level: number }> = [];

  // Match h2 and h3 tags with their attributes and content
  const headingRegex = /<h([2-6])([^>]*)>([^<]+)<\/h[2-6]>/gi;
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = parseInt(match[1]);
    const attributes = match[2];
    const text = match[3].trim();

    // Extract id from attributes if present
    const idMatch = attributes.match(/id=["']([^"']+)["']/i);
    const id = idMatch
      ? idMatch[1]
      : text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');

    headings.push({ id, text, level });
  }

  return headings;
}

// Add IDs to headings that don't have them
export function addHeadingIds(content: string): string {
  const usedIds = new Set<string>();

  return content.replace(/<h([2-6])([^>]*)>([^<]+)<\/h[2-6]>/gi, (match, level, attrs, text) => {
    // Check if already has an id
    if (/id=["'][^"']+["']/i.test(attrs)) {
      const idMatch = attrs.match(/id=["']([^"']+)["']/i);
      if (idMatch) usedIds.add(idMatch[1]);
      return match;
    }

    // Generate id from text
    const id = text.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');

    // Ensure unique id
    let uniqueId = id;
    let counter = 1;
    while (usedIds.has(uniqueId)) {
      uniqueId = `${id}-${counter}`;
      counter++;
    }
    usedIds.add(uniqueId);

    return `<h${level}${attrs} id="${uniqueId}">${text}</h${level}>`;
  });
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
