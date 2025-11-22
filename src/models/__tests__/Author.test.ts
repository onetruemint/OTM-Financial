import Author from '../Author';

describe('Author model', () => {
  it('should have correct model name', () => {
    expect(Author.modelName).toBe('Author');
  });

  it('should have required name field', () => {
    const schema = Author.schema.paths;
    expect(schema.name).toBeDefined();
    expect(schema.name.options.required).toBeTruthy();
  });

  it('should have required email field', () => {
    const schema = Author.schema.paths;
    expect(schema.email).toBeDefined();
    expect(schema.email.options.required).toBeTruthy();
    expect(schema.email.options.unique).toBe(true);
  });

  it('should have optional bio field', () => {
    const schema = Author.schema.paths;
    expect(schema.bio).toBeDefined();
    expect(schema.bio.options.maxlength[0]).toBe(500);
  });

  it('should have optional avatar field', () => {
    const schema = Author.schema.paths;
    expect(schema.avatar).toBeDefined();
  });

  it('should have timestamps enabled', () => {
    expect(Author.schema.options.timestamps).toBe(true);
  });

  it('should enforce name maxlength', () => {
    const schema = Author.schema.paths;
    expect(schema.name.options.maxlength[0]).toBe(100);
  });
});
