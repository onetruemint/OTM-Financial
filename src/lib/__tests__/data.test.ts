// Mock react cache
jest.mock('react', () => ({
  cache: (fn: Function) => fn,
}));

// Mock dbConnect
jest.mock('../mongodb', () => ({
  __esModule: true,
  default: jest.fn().mockResolvedValue(undefined),
}));

// Mock models
const mockAuthorFind = jest.fn();
const mockCategoryFind = jest.fn();
const mockTagFind = jest.fn();
const mockPostFindOne = jest.fn();

jest.mock('@/models', () => ({
  Author: {
    find: () => ({
      select: () => ({
        sort: () => ({
          lean: mockAuthorFind,
        }),
      }),
    }),
  },
  Category: {
    find: () => ({
      select: () => ({
        sort: () => ({
          lean: mockCategoryFind,
        }),
      }),
    }),
  },
  Tag: {
    find: () => ({
      select: () => ({
        sort: () => ({
          lean: mockTagFind,
        }),
      }),
    }),
  },
  Post: {
    findOne: () => ({
      populate: () => ({
        populate: () => ({
          populate: () => ({
            lean: mockPostFindOne,
          }),
        }),
      }),
    }),
  },
}));

import {
  getFormData,
  getPostBySlug,
  getPostWithFormData,
  getAuthors,
  getCategories,
  getTags,
} from '../data';

describe('getFormData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch authors, categories, and tags', async () => {
    const mockAuthors = [{ _id: '1', name: 'Author 1', email: 'a@a.com' }];
    const mockCategories = [{ _id: '1', name: 'Category 1', slug: 'cat-1' }];
    const mockTags = [{ _id: '1', name: 'Tag 1', slug: 'tag-1' }];

    mockAuthorFind.mockResolvedValue(mockAuthors);
    mockCategoryFind.mockResolvedValue(mockCategories);
    mockTagFind.mockResolvedValue(mockTags);

    const result = await getFormData();

    expect(result.authors).toEqual(mockAuthors);
    expect(result.categories).toEqual(mockCategories);
    expect(result.tags).toEqual(mockTags);
  });
});

describe('getPostBySlug', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return post when found', async () => {
    const mockPost = {
      _id: '1',
      title: 'Test Post',
      slug: 'test-post',
      content: 'Content',
    };

    mockPostFindOne.mockResolvedValue(mockPost);

    const result = await getPostBySlug('test-post');

    expect(result).toEqual(mockPost);
  });

  it('should return null when post not found', async () => {
    mockPostFindOne.mockResolvedValue(null);

    const result = await getPostBySlug('nonexistent');

    expect(result).toBeNull();
  });
});

describe('getPostWithFormData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return post and form data', async () => {
    const mockPost = { _id: '1', title: 'Test', slug: 'test' };
    const mockAuthors = [{ _id: '1', name: 'Author' }];
    const mockCategories = [{ _id: '1', name: 'Category', slug: 'cat' }];
    const mockTags = [{ _id: '1', name: 'Tag', slug: 'tag' }];

    mockPostFindOne.mockResolvedValue(mockPost);
    mockAuthorFind.mockResolvedValue(mockAuthors);
    mockCategoryFind.mockResolvedValue(mockCategories);
    mockTagFind.mockResolvedValue(mockTags);

    const result = await getPostWithFormData('test');

    expect(result.post).toEqual(mockPost);
    expect(result.formData.authors).toEqual(mockAuthors);
    expect(result.formData.categories).toEqual(mockCategories);
    expect(result.formData.tags).toEqual(mockTags);
  });

  it('should return null post when not found', async () => {
    mockPostFindOne.mockResolvedValue(null);
    mockAuthorFind.mockResolvedValue([]);
    mockCategoryFind.mockResolvedValue([]);
    mockTagFind.mockResolvedValue([]);

    const result = await getPostWithFormData('nonexistent');

    expect(result.post).toBeNull();
  });
});

describe('getAuthors', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return all authors', async () => {
    const mockAuthors = [
      { _id: '1', name: 'Author 1' },
      { _id: '2', name: 'Author 2' },
    ];

    // Override mock for this specific test
    const { Author } = require('@/models');
    Author.find = () => ({
      sort: () => ({
        lean: jest.fn().mockResolvedValue(mockAuthors),
      }),
    });

    const result = await getAuthors();

    expect(result).toEqual(mockAuthors);
  });
});

describe('getCategories', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return all categories', async () => {
    const mockCategories = [
      { _id: '1', name: 'Category 1', slug: 'cat-1' },
      { _id: '2', name: 'Category 2', slug: 'cat-2' },
    ];

    const { Category } = require('@/models');
    Category.find = () => ({
      sort: () => ({
        lean: jest.fn().mockResolvedValue(mockCategories),
      }),
    });

    const result = await getCategories();

    expect(result).toEqual(mockCategories);
  });
});

describe('getTags', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return all tags', async () => {
    const mockTags = [
      { _id: '1', name: 'Tag 1', slug: 'tag-1' },
      { _id: '2', name: 'Tag 2', slug: 'tag-2' },
    ];

    const { Tag } = require('@/models');
    Tag.find = () => ({
      sort: () => ({
        lean: jest.fn().mockResolvedValue(mockTags),
      }),
    });

    const result = await getTags();

    expect(result).toEqual(mockTags);
  });
});
