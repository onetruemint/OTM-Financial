import { notFound } from 'next/navigation';
import PostCard from '@/components/PostCard';
import Pagination from '@/components/Pagination';
import dbConnect from '@/lib/mongodb';
import { Post, Category } from '@/models';
import { IPost, ICategory } from '@/types';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

async function getCategoryWithPosts(slug: string, page: number = 1, limit: number = 9) {
  await dbConnect();

  const category = await Category.findOne({ slug }).lean();

  if (!category) {
    return null;
  }

  const skip = (page - 1) * limit;

  const [posts, total] = await Promise.all([
    Post.find({ category: category._id, published: true })
      .populate('author', 'name avatar')
      .populate('category', 'name slug color')
      .populate('tags', 'name slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Post.countDocuments({ category: category._id, published: true }),
  ]);

  return {
    category: JSON.parse(JSON.stringify(category)) as ICategory,
    posts: JSON.parse(JSON.stringify(posts)) as IPost[],
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
}

const colorMap: Record<string, string> = {
  blue: 'bg-blue',
  green: 'bg-green',
  purple: 'bg-purple',
  tan: 'bg-tan',
  red: 'bg-red',
  mint: 'bg-mint',
};

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;
  const page = parseInt(pageParam || '1');

  const data = await getCategoryWithPosts(slug, page);

  if (!data) {
    notFound();
  }

  const { category, posts, pagination } = data;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div
          className={`inline-block px-4 py-2 rounded-full text-black font-medium ${
            colorMap[category.color] || colorMap.blue
          } mb-4`}
        >
          {category.name}
        </div>
        <h1 className="text-3xl font-bold text-black mb-2">
          Posts in {category.name}
        </h1>
        {category.description && (
          <p className="text-black/70">{category.description}</p>
        )}
        <p className="text-black/60 text-sm mt-2">
          {pagination.total} post{pagination.total !== 1 ? 's' : ''}
        </p>
      </div>

      {posts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.pages}
            basePath={`/category/${slug}`}
          />
        </>
      ) : (
        <div className="text-center py-16">
          <div className="bg-mint rounded-2xl p-8 max-w-md mx-auto">
            <h2 className="text-xl font-bold text-black mb-2">No posts yet</h2>
            <p className="text-black/70">
              Posts in this category will appear here.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
