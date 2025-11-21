import PostCard from '@/components/PostCard';
import Pagination from '@/components/Pagination';
import dbConnect from '@/lib/mongodb';
import { Post } from '@/models';
import { IPost } from '@/types';

export const dynamic = 'force-dynamic';

interface BlogPageProps {
  searchParams: Promise<{ page?: string }>;
}

async function getPosts(page: number = 1, limit: number = 9) {
  await dbConnect();

  const skip = (page - 1) * limit;

  const [posts, total] = await Promise.all([
    Post.find({ published: true })
      .populate('author', 'name avatar')
      .populate('category', 'name slug color')
      .populate('tags', 'name slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Post.countDocuments({ published: true }),
  ]);

  return {
    posts: JSON.parse(JSON.stringify(posts)) as IPost[],
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || '1');
  const { posts, pagination } = await getPosts(page);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black mb-2">Blog</h1>
        <p className="text-black/70">
          Browse all our articles and stories.
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
            basePath="/blog"
          />
        </>
      ) : (
        <div className="text-center py-16">
          <div className="bg-mint rounded-2xl p-8 max-w-md mx-auto">
            <h2 className="text-xl font-bold text-black mb-2">No posts found</h2>
            <p className="text-black/70">
              Check back soon for new content!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
