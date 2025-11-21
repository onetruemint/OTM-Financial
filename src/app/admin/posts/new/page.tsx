import { getFormData } from '@/lib/data';
import PostForm from '@/components/admin/PostForm';

export default async function NewPostPage() {
  const { authors, categories, tags } = await getFormData();

  return (
    <PostForm
      authors={authors}
      categories={categories}
      tags={tags}
      mode="create"
    />
  );
}
