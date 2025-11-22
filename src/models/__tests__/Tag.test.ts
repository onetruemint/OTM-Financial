import Tag from '../Tag';

describe('Tag model', () => {
  it('should have correct model name', () => {
    expect(Tag.modelName).toBe('Tag');
  });

  it('should have required name field', () => {
    const schema = Tag.schema.paths;
    expect(schema.name).toBeDefined();
    expect(schema.name.options.required).toBeTruthy();
    expect(schema.name.options.unique).toBe(true);
  });

  it('should have required slug field', () => {
    const schema = Tag.schema.paths;
    expect(schema.slug).toBeDefined();
    expect(schema.slug.options.required).toBe(true);
    expect(schema.slug.options.unique).toBe(true);
  });

  it('should enforce name maxlength', () => {
    const schema = Tag.schema.paths;
    expect(schema.name.options.maxlength[0]).toBe(30);
  });

  it('should have timestamps enabled', () => {
    expect(Tag.schema.options.timestamps).toBe(true);
  });
});
