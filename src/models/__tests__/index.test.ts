import { Post, Author, Category, Tag, AdminUser } from '../index';

describe('Model exports', () => {
  it('should export Post model', () => {
    expect(Post).toBeDefined();
    expect(Post.modelName).toBe('Post');
  });

  it('should export Author model', () => {
    expect(Author).toBeDefined();
    expect(Author.modelName).toBe('Author');
  });

  it('should export Category model', () => {
    expect(Category).toBeDefined();
    expect(Category.modelName).toBe('Category');
  });

  it('should export Tag model', () => {
    expect(Tag).toBeDefined();
    expect(Tag.modelName).toBe('Tag');
  });

  it('should export AdminUser model', () => {
    expect(AdminUser).toBeDefined();
    expect(AdminUser.modelName).toBe('AdminUser');
  });
});
