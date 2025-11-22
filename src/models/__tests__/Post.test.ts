import Post from '../Post';

describe('Post model', () => {
  it('should have correct model name', () => {
    expect(Post.modelName).toBe('Post');
  });

  it('should have required title field', () => {
    const schema = Post.schema.paths;
    expect(schema.title).toBeDefined();
    expect(schema.title.options.required).toBeTruthy();
    expect(schema.title.options.maxlength[0]).toBe(200);
  });

  it('should have required slug field', () => {
    const schema = Post.schema.paths;
    expect(schema.slug).toBeDefined();
    expect(schema.slug.options.required).toBe(true);
    expect(schema.slug.options.unique).toBe(true);
  });

  it('should have required excerpt field', () => {
    const schema = Post.schema.paths;
    expect(schema.excerpt).toBeDefined();
    expect(schema.excerpt.options.required).toBeTruthy();
    expect(schema.excerpt.options.maxlength[0]).toBe(300);
  });

  it('should have required content field', () => {
    const schema = Post.schema.paths;
    expect(schema.content).toBeDefined();
    expect(schema.content.options.required).toBeTruthy();
  });

  it('should have optional featuredImage field', () => {
    const schema = Post.schema.paths;
    expect(schema.featuredImage).toBeDefined();
  });

  it('should have required author reference', () => {
    const schema = Post.schema.paths;
    expect(schema.author).toBeDefined();
    expect(schema.author.options.ref).toBe('Author');
    expect(schema.author.options.required).toBe(true);
  });

  it('should have required category reference', () => {
    const schema = Post.schema.paths;
    expect(schema.category).toBeDefined();
    expect(schema.category.options.ref).toBe('Category');
    expect(schema.category.options.required).toBe(true);
  });

  it('should have tags array reference', () => {
    const schema = Post.schema.paths;
    expect(schema.tags).toBeDefined();
  });

  it('should have likes field with default 0', () => {
    const schema = Post.schema.paths;
    expect(schema.likes).toBeDefined();
    expect(schema.likes.options.default).toBe(0);
  });

  it('should have published field with default false', () => {
    const schema = Post.schema.paths;
    expect(schema.published).toBeDefined();
    expect(schema.published.options.default).toBe(false);
  });

  it('should have timestamps enabled', () => {
    expect(Post.schema.options.timestamps).toBe(true);
  });

  it('should have text index for search', () => {
    const indexes = Post.schema.indexes();
    const textIndex = indexes.find(
      (index) => index[0].title === 'text' || index[0].content === 'text'
    );
    expect(textIndex).toBeDefined();
  });
});
