import Link from 'next/link';
import dbConnect from '@/lib/mongodb';
import { Category, Post } from '@/models';
import { ICategory } from '@/types';

interface CategoryWithCount extends ICategory {
  postCount: number;
}

async function getCategoriesWithCounts(): Promise<CategoryWithCount[]> {
  await dbConnect();

  const categories = await Category.find().sort({ name: 1 }).lean();

  const categoriesWithCounts = await Promise.all(
    categories.map(async (category) => {
      const postCount = await Post.countDocuments({
        category: category._id,
        published: true,
      });
      return {
        ...JSON.parse(JSON.stringify(category)),
        postCount,
      };
    })
  );

  return categoriesWithCounts;
}

const colorMap: Record<string, { bg: string; hover: string }> = {
  blue: { bg: 'bg-blue', hover: 'hover:bg-dark-blue' },
  green: { bg: 'bg-green', hover: 'hover:bg-dark-green' },
  purple: { bg: 'bg-purple', hover: 'hover:bg-dark-purple' },
  tan: { bg: 'bg-tan', hover: 'hover:bg-dark-tan' },
  red: { bg: 'bg-red', hover: 'hover:bg-dark-red' },
  mint: { bg: 'bg-mint', hover: 'hover:bg-dark-green' },
};

export default async function CategoriesPage() {
  const categories = await getCategoriesWithCounts();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black mb-2">Categories</h1>
        <p className="text-black/70">
          Browse posts by category.
        </p>
      </div>

      {categories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => {
            const colors = colorMap[category.color] || colorMap.blue;
            return (
              <Link
                key={category._id}
                href={`/category/${category.slug}`}
                className={`${colors.bg} ${colors.hover} rounded-xl p-6 transition-colors`}
              >
                <h2 className="text-xl font-bold text-black mb-2">
                  {category.name}
                </h2>
                {category.description && (
                  <p className="text-black/70 text-sm mb-3">
                    {category.description}
                  </p>
                )}
                <p className="text-sm text-black/60">
                  {category.postCount} post{category.postCount !== 1 ? 's' : ''}
                </p>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="bg-mint rounded-2xl p-8 max-w-md mx-auto">
            <h2 className="text-xl font-bold text-black mb-2">No categories yet</h2>
            <p className="text-black/70">
              Categories will appear here once created.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
