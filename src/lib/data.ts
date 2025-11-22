import { cache } from 'react';
import dbConnect from './mongodb';
import { Author, Category, Tag, Post } from '@/models';

// Types
export interface AuthorData {
  _id: string;
  name: string;
  email?: string;
  bio?: string;
  avatar?: string;
}

export interface CategoryData {
  _id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface TagData {
  _id: string;
  name: string;
  slug: string;
}

export interface PostData {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  author: AuthorData | string;
  category: CategoryData | string;
  tags: (TagData | string)[];
  published: boolean;
  likes: number;
  createdAt: string;
  updatedAt: string;
}

export interface FormData {
  authors: AuthorData[];
  categories: CategoryData[];
  tags: TagData[];
}

// Cached function to get all form data in a single database call
export const getFormData = cache(async (): Promise<FormData> => {
  await dbConnect();

  const [authors, categories, tags] = await Promise.all([
    Author.find().select('name email bio').sort({ name: 1 }).lean(),
    Category.find().select('name slug description').sort({ name: 1 }).lean(),
    Tag.find().select('name slug').sort({ name: 1 }).lean(),
  ]);

  return {
    authors: JSON.parse(JSON.stringify(authors)),
    categories: JSON.parse(JSON.stringify(categories)),
    tags: JSON.parse(JSON.stringify(tags)),
  };
});

// Cached function to get a single post by slug
export const getPostBySlug = cache(async (slug: string): Promise<PostData | null> => {
  await dbConnect();

  const post = await Post.findOne({ slug })
    .populate('author', 'name email bio')
    .populate('category', 'name slug description')
    .populate('tags', 'name slug')
    .lean();

  if (!post) return null;

  return JSON.parse(JSON.stringify(post));
});

// Cached function to get post with form data (for edit page)
export const getPostWithFormData = cache(async (slug: string): Promise<{
  post: PostData | null;
  formData: FormData;
}> => {
  await dbConnect();

  const [post, authors, categories, tags] = await Promise.all([
    Post.findOne({ slug })
      .populate('author', 'name email bio')
      .populate('category', 'name slug description')
      .populate('tags', 'name slug')
      .lean(),
    Author.find().select('name email bio').sort({ name: 1 }).lean(),
    Category.find().select('name slug description').sort({ name: 1 }).lean(),
    Tag.find().select('name slug').sort({ name: 1 }).lean(),
  ]);

  return {
    post: post ? JSON.parse(JSON.stringify(post)) : null,
    formData: {
      authors: JSON.parse(JSON.stringify(authors)),
      categories: JSON.parse(JSON.stringify(categories)),
      tags: JSON.parse(JSON.stringify(tags)),
    },
  };
});

// Cached function to get all authors
export const getAuthors = cache(async (): Promise<AuthorData[]> => {
  await dbConnect();
  const authors = await Author.find().sort({ name: 1 }).lean();
  return JSON.parse(JSON.stringify(authors));
});

// Cached function to get all categories
export const getCategories = cache(async (): Promise<CategoryData[]> => {
  await dbConnect();
  const categories = await Category.find().sort({ name: 1 }).lean();
  return JSON.parse(JSON.stringify(categories));
});

// Cached function to get all tags
export const getTags = cache(async (): Promise<TagData[]> => {
  await dbConnect();
  const tags = await Tag.find().sort({ name: 1 }).lean();
  return JSON.parse(JSON.stringify(tags));
});
