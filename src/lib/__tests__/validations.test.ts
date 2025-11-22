import {
  createPostSchema,
  updatePostSchema,
  createAuthorSchema,
  createCategorySchema,
  createTagSchema,
  searchQuerySchema,
  validateBody,
} from '../validations';

describe('createPostSchema', () => {
  const validPost = {
    title: 'Test Post',
    excerpt: 'Test excerpt',
    content: 'Test content',
    author: 'author-id',
    category: 'category-id',
  };

  it('should validate a valid post', () => {
    const result = createPostSchema.safeParse(validPost);
    expect(result.success).toBe(true);
  });

  it('should require title', () => {
    const post = { ...validPost, title: '' };
    const result = createPostSchema.safeParse(post);
    expect(result.success).toBe(false);
  });

  it('should reject title over 200 characters', () => {
    const post = { ...validPost, title: 'a'.repeat(201) };
    const result = createPostSchema.safeParse(post);
    expect(result.success).toBe(false);
  });

  it('should require excerpt', () => {
    const post = { ...validPost, excerpt: '' };
    const result = createPostSchema.safeParse(post);
    expect(result.success).toBe(false);
  });

  it('should reject excerpt over 500 characters', () => {
    const post = { ...validPost, excerpt: 'a'.repeat(501) };
    const result = createPostSchema.safeParse(post);
    expect(result.success).toBe(false);
  });

  it('should require content', () => {
    const post = { ...validPost, content: '' };
    const result = createPostSchema.safeParse(post);
    expect(result.success).toBe(false);
  });

  it('should accept optional featuredImage as valid URL', () => {
    const post = { ...validPost, featuredImage: 'https://example.com/image.jpg' };
    const result = createPostSchema.safeParse(post);
    expect(result.success).toBe(true);
  });

  it('should accept empty string for featuredImage', () => {
    const post = { ...validPost, featuredImage: '' };
    const result = createPostSchema.safeParse(post);
    expect(result.success).toBe(true);
  });

  it('should reject invalid URL for featuredImage', () => {
    const post = { ...validPost, featuredImage: 'not-a-url' };
    const result = createPostSchema.safeParse(post);
    expect(result.success).toBe(false);
  });

  it('should default tags to empty array', () => {
    const result = createPostSchema.safeParse(validPost);
    if (result.success) {
      expect(result.data.tags).toEqual([]);
    }
  });

  it('should default published to false', () => {
    const result = createPostSchema.safeParse(validPost);
    if (result.success) {
      expect(result.data.published).toBe(false);
    }
  });
});

describe('updatePostSchema', () => {
  it('should allow partial updates', () => {
    const result = updatePostSchema.safeParse({ title: 'Updated Title' });
    expect(result.success).toBe(true);
  });

  it('should still validate provided fields', () => {
    const result = updatePostSchema.safeParse({ title: '' });
    expect(result.success).toBe(false);
  });
});

describe('createAuthorSchema', () => {
  const validAuthor = {
    name: 'John Doe',
    email: 'john@example.com',
  };

  it('should validate a valid author', () => {
    const result = createAuthorSchema.safeParse(validAuthor);
    expect(result.success).toBe(true);
  });

  it('should require name', () => {
    const author = { ...validAuthor, name: '' };
    const result = createAuthorSchema.safeParse(author);
    expect(result.success).toBe(false);
  });

  it('should reject name over 100 characters', () => {
    const author = { ...validAuthor, name: 'a'.repeat(101) };
    const result = createAuthorSchema.safeParse(author);
    expect(result.success).toBe(false);
  });

  it('should require valid email', () => {
    const author = { ...validAuthor, email: 'invalid-email' };
    const result = createAuthorSchema.safeParse(author);
    expect(result.success).toBe(false);
  });

  it('should accept optional bio', () => {
    const author = { ...validAuthor, bio: 'A short bio' };
    const result = createAuthorSchema.safeParse(author);
    expect(result.success).toBe(true);
  });

  it('should reject bio over 500 characters', () => {
    const author = { ...validAuthor, bio: 'a'.repeat(501) };
    const result = createAuthorSchema.safeParse(author);
    expect(result.success).toBe(false);
  });
});

describe('createCategorySchema', () => {
  it('should validate a valid category', () => {
    const result = createCategorySchema.safeParse({ name: 'Tech' });
    expect(result.success).toBe(true);
  });

  it('should require name', () => {
    const result = createCategorySchema.safeParse({ name: '' });
    expect(result.success).toBe(false);
  });

  it('should reject name over 50 characters', () => {
    const result = createCategorySchema.safeParse({ name: 'a'.repeat(51) });
    expect(result.success).toBe(false);
  });

  it('should accept valid color values', () => {
    const colors = ['blue', 'green', 'purple', 'tan', 'red', 'mint'];
    colors.forEach(color => {
      const result = createCategorySchema.safeParse({ name: 'Test', color });
      expect(result.success).toBe(true);
    });
  });

  it('should reject invalid color values', () => {
    const result = createCategorySchema.safeParse({ name: 'Test', color: 'yellow' });
    expect(result.success).toBe(false);
  });

  it('should default color to blue', () => {
    const result = createCategorySchema.safeParse({ name: 'Test' });
    if (result.success) {
      expect(result.data.color).toBe('blue');
    }
  });
});

describe('createTagSchema', () => {
  it('should validate a valid tag', () => {
    const result = createTagSchema.safeParse({ name: 'JavaScript' });
    expect(result.success).toBe(true);
  });

  it('should require name', () => {
    const result = createTagSchema.safeParse({ name: '' });
    expect(result.success).toBe(false);
  });

  it('should reject name over 30 characters', () => {
    const result = createTagSchema.safeParse({ name: 'a'.repeat(31) });
    expect(result.success).toBe(false);
  });
});

describe('searchQuerySchema', () => {
  it('should validate a valid search query', () => {
    const result = searchQuerySchema.safeParse({ q: 'test' });
    expect(result.success).toBe(true);
  });

  it('should require query string', () => {
    const result = searchQuerySchema.safeParse({ q: '' });
    expect(result.success).toBe(false);
  });

  it('should reject query over 100 characters', () => {
    const result = searchQuerySchema.safeParse({ q: 'a'.repeat(101) });
    expect(result.success).toBe(false);
  });

  it('should default page to 1', () => {
    const result = searchQuerySchema.safeParse({ q: 'test' });
    if (result.success) {
      expect(result.data.page).toBe(1);
    }
  });

  it('should default limit to 10', () => {
    const result = searchQuerySchema.safeParse({ q: 'test' });
    if (result.success) {
      expect(result.data.limit).toBe(10);
    }
  });

  it('should coerce page and limit to numbers', () => {
    const result = searchQuerySchema.safeParse({ q: 'test', page: '2', limit: '20' });
    if (result.success) {
      expect(result.data.page).toBe(2);
      expect(result.data.limit).toBe(20);
    }
  });

  it('should reject limit over 50', () => {
    const result = searchQuerySchema.safeParse({ q: 'test', limit: 51 });
    expect(result.success).toBe(false);
  });
});

describe('validateBody', () => {
  it('should return success with data for valid input', () => {
    const result = validateBody(createTagSchema, { name: 'Test' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe('Test');
    }
  });

  it('should return error message for invalid input', () => {
    const result = validateBody(createTagSchema, { name: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain('required');
    }
  });

  it('should combine multiple error messages', () => {
    const result = validateBody(createAuthorSchema, { name: '', email: 'invalid' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain(',');
    }
  });
});
