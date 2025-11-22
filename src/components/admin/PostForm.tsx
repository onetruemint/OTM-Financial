'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import type { AuthorData, CategoryData, TagData } from '@/lib/data';
import ImageUpload, { ImageUploadRef } from '@/components/ImageUpload';

interface PostFormProps {
  authors: AuthorData[];
  categories: CategoryData[];
  tags: TagData[];
  initialData?: {
    title: string;
    excerpt: string;
    content: string;
    featuredImage: string;
    author: string;
    category: string;
    tags: string[];
    published: boolean;
  };
  mode: 'create' | 'edit';
  slug?: string;
}

export default function PostForm({
  authors,
  categories,
  tags,
  initialData,
  mode,
  slug,
}: PostFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const imageUploadRef = useRef<ImageUploadRef>(null);

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    excerpt: initialData?.excerpt || '',
    content: initialData?.content || '',
    featuredImage: initialData?.featuredImage || '',
    author: initialData?.author || '',
    category: initialData?.category || '',
    tags: initialData?.tags || [],
    published: initialData?.published || false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Confirm any pending image upload first
      const finalFormData = { ...formData };
      if (imageUploadRef.current) {
        const uploadResult = await imageUploadRef.current.confirmPending();
        if (!uploadResult.success) {
          setError(`Image upload failed: ${uploadResult.error}`);
          setIsLoading(false);
          return;
        }
        if (uploadResult.url) {
          finalFormData.featuredImage = uploadResult.url;
        }
      }

      const url = mode === 'create' ? '/api/posts' : `/api/posts/${slug}`;
      const method = mode === 'create' ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(finalFormData),
      });

      if (response.ok) {
        router.push('/admin/posts');
        router.refresh();
      } else {
        const data = await response.json();
        setError(data.error || `Failed to ${mode === 'create' ? 'create' : 'update'} post`);
      }
    } catch (error) {
      setError('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTagChange = (tagId: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tagId)
        ? prev.tags.filter((id) => id !== tagId)
        : [...prev.tags, tagId],
    }));
  };

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/posts"
          className="inline-flex items-center gap-2 text-black/70 hover:text-dark-blue mb-4"
        >
          <ArrowLeft size={18} />
          Back to posts
        </Link>
        <h1 className="text-3xl font-bold text-black">
          {mode === 'create' ? 'New Post' : 'Edit Post'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl">
        <div className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-black mb-1">
              Title *
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="w-full px-4 py-2 rounded-lg bg-mint border border-dark-blue/30 focus:border-dark-blue focus:outline-none text-black"
            />
          </div>

          {/* Excerpt */}
          <div>
            <label htmlFor="excerpt" className="block text-sm font-medium text-black mb-1">
              Excerpt *
            </label>
            <textarea
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              required
              rows={2}
              maxLength={300}
              className="w-full px-4 py-2 rounded-lg bg-mint border border-dark-blue/30 focus:border-dark-blue focus:outline-none text-black resize-none"
            />
            <p className="text-xs text-black/50 mt-1">{formData.excerpt.length}/300</p>
          </div>

          {/* Content */}
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-black mb-1">
              Content * (HTML supported)
            </label>
            <textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              required
              rows={12}
              className="w-full px-4 py-2 rounded-lg bg-mint border border-dark-blue/30 focus:border-dark-blue focus:outline-none text-black font-mono text-sm"
            />
          </div>

          {/* Featured Image */}
          <ImageUpload
            ref={imageUploadRef}
            value={formData.featuredImage}
            onChange={(url) => setFormData({ ...formData, featuredImage: url })}
            folder="otm-financial/posts"
            label="Featured Image"
            aspectRatio="video"
          />

          {/* Author & Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="author" className="block text-sm font-medium text-black mb-1">
                Author *
              </label>
              <select
                id="author"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                required
                className="w-full px-4 py-2 rounded-lg bg-mint border border-dark-blue/30 focus:border-dark-blue focus:outline-none text-black"
              >
                <option value="">Select author</option>
                {authors.map((author) => (
                  <option key={author._id} value={author._id}>
                    {author.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-black mb-1">
                Category *
              </label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
                className="w-full px-4 py-2 rounded-lg bg-mint border border-dark-blue/30 focus:border-dark-blue focus:outline-none text-black"
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-black mb-2">Tags</label>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <label
                  key={tag._id}
                  className={`flex items-center gap-2 px-3 py-1 rounded-full cursor-pointer transition-colors ${
                    formData.tags.includes(tag._id)
                      ? 'bg-dark-purple text-black'
                      : 'bg-mint text-black hover:bg-blue'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.tags.includes(tag._id)}
                    onChange={() => handleTagChange(tag._id)}
                    className="sr-only"
                  />
                  {tag.name}
                </label>
              ))}
              {tags.length === 0 && (
                <p className="text-black/50 text-sm">No tags available. Create some first.</p>
              )}
            </div>
          </div>

          {/* Published */}
          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.published}
                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                className="w-4 h-4 rounded border-dark-blue/30 text-dark-purple focus:ring-dark-purple"
              />
              <span className="text-sm font-medium text-black">
                {mode === 'create' ? 'Publish immediately' : 'Published'}
              </span>
            </label>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red text-black text-sm p-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Submit */}
          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-2 bg-dark-purple text-black font-medium rounded-lg hover:bg-purple transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={18} />
              {isLoading ? 'Saving...' : mode === 'create' ? 'Save Post' : 'Update Post'}
            </button>
            <Link
              href="/admin/posts"
              className="px-6 py-2 bg-mint text-black rounded-lg hover:bg-blue transition-colors"
            >
              Cancel
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
