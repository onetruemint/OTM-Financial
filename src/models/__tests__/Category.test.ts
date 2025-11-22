import Category from '../Category';

describe('Category model', () => {
  it('should have correct model name', () => {
    expect(Category.modelName).toBe('Category');
  });

  it('should have required name field', () => {
    const schema = Category.schema.paths;
    expect(schema.name).toBeDefined();
    expect(schema.name.options.required).toBeTruthy();
    expect(schema.name.options.unique).toBe(true);
  });

  it('should have required slug field', () => {
    const schema = Category.schema.paths;
    expect(schema.slug).toBeDefined();
    expect(schema.slug.options.required).toBe(true);
    expect(schema.slug.options.unique).toBe(true);
  });

  it('should have optional description field', () => {
    const schema = Category.schema.paths;
    expect(schema.description).toBeDefined();
    expect(schema.description.options.maxlength[0]).toBe(200);
  });

  it('should have color field with enum values', () => {
    const schema = Category.schema.paths;
    expect(schema.color).toBeDefined();
    expect(schema.color.options.default).toBe('blue');
    expect(schema.color.options.enum).toContain('blue');
    expect(schema.color.options.enum).toContain('green');
    expect(schema.color.options.enum).toContain('purple');
    expect(schema.color.options.enum).toContain('tan');
    expect(schema.color.options.enum).toContain('red');
    expect(schema.color.options.enum).toContain('mint');
  });

  it('should have timestamps enabled', () => {
    expect(Category.schema.options.timestamps).toBe(true);
  });

  it('should enforce name maxlength', () => {
    const schema = Category.schema.paths;
    expect(schema.name.options.maxlength[0]).toBe(50);
  });
});
