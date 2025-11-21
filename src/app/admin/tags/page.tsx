import { getTags } from '@/lib/data';
import TagsList from '@/components/admin/TagsList';

export default async function AdminTagsPage() {
  const tags = await getTags();

  return <TagsList initialTags={tags} />;
}
