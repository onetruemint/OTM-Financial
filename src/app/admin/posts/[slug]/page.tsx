import { notFound } from 'next/navigation';
import { getPostWithFormData } from '@/lib/data';
import PostForm from '@/components/admin/PostForm';
import type { AuthorData, CategoryData, TagData } from '@/lib/data';

export default async function EditPostPage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params;
  const { post, formData } = await getPostWithFormData(slug);

  if (!post) {
    notFound();
  }

  // Extract IDs from populated data
  const initialData = {
    title: post.title,
    excerpt: post.excerpt,
    content: post.content,
    featuredImage: post.featuredImage || '',
    author: typeof post.author === 'object' ? (post.author as AuthorData)._id : post.author,
    category: typeof post.category === 'object' ? (post.category as CategoryData)._id : post.category,
    tags: post.tags.map((t) => typeof t === 'object' ? (t as TagData)._id : t),
    published: post.published,
  };

  return (
    <PostForm
      authors={formData.authors}
      categories={formData.categories}
      tags={formData.tags}
      initialData={initialData}
      mode="edit"
      slug={slug}
    />
  );
}
