import { z } from 'zod';

// Post validation schema
export const createPostSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  excerpt: z.string().min(1, 'Excerpt is required').max(500, 'Excerpt too long'),
  content: z.string().min(1, 'Content is required'),
  featuredImage: z.string().url().optional().or(z.literal('')),
  author: z.string().min(1, 'Author is required'),
  category: z.string().min(1, 'Category is required'),
  tags: z.array(z.string()).optional().default([]),
  published: z.boolean().optional().default(false),
});

export const updatePostSchema = createPostSchema.partial();

// Author validation schema
export const createAuthorSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  email: z.string().email('Invalid email address'),
  bio: z.string().max(500, 'Bio too long').optional().or(z.literal('')),
  avatar: z.string().url().optional().or(z.literal('')),
});

export const updateAuthorSchema = createAuthorSchema.partial();

// Category validation schema
export const createCategorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name too long'),
  description: z.string().max(200, 'Description too long').optional().or(z.literal('')),
  color: z.enum(['blue', 'green', 'purple', 'tan', 'red', 'mint']).optional().default('blue'),
});

export const updateCategorySchema = createCategorySchema.partial();

// Tag validation schema
export const createTagSchema = z.object({
  name: z.string().min(1, 'Name is required').max(30, 'Name too long'),
});

export const updateTagSchema = createTagSchema.partial();

// Search query validation
export const searchQuerySchema = z.object({
  q: z.string().min(1).max(100),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(50).optional().default(10),
});

// Helper to validate and return errors
export function validateBody<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; error: string } {
  const result = schema.safeParse(data);
  if (!result.success) {
    const errors = result.error.issues.map(e => e.message).join(', ');
    return { success: false, error: errors };
  }
  return { success: true, data: result.data };
}
