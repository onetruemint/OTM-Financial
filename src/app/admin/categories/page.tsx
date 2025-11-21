import { getCategories } from '@/lib/data';
import CategoriesList from '@/components/admin/CategoriesList';

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  return <CategoriesList initialCategories={categories} />;
}
