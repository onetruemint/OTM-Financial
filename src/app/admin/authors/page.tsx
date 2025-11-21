import { getAuthors } from '@/lib/data';
import AuthorsList from '@/components/admin/AuthorsList';

export default async function AdminAuthorsPage() {
  const authors = await getAuthors();

  return <AuthorsList initialAuthors={authors} />;
}
