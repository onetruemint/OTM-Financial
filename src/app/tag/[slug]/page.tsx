import { notFound } from 'next/navigation';
import PostCard from '@/components/PostCard';
import Pagination from '@/components/Pagination';
import dbConnect from '@/lib/mongodb';
import { Post, Tag } from '@/models';
import { IPost, ITag } from '@/types';

interface TagPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

async function getTagWithPosts(slug: string, page: number = 1, limit: number = 9) {
  await dbConnect();

  const tag = await Tag.findOne({ slug }).lean();

  if (!tag) {
    return null;
  }

  const skip = (page - 1) * limit;

  const [posts, total] = await Promise.all([
    Post.find({ tags: tag._id, published: true })
      .populate('author', 'name avatar')
      .populate('category', 'name slug color')
      .populate('tags', 'name slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Post.countDocuments({ tags: tag._id, published: true }),
  ]);

  return {
    tag: JSON.parse(JSON.stringify(tag)) as ITag,
    posts: JSON.parse(JSON.stringify(posts)) as IPost[],
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
}

export default async function TagPage({ params, searchParams }: TagPageProps) {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;
  const page = parseInt(pageParam || '1');

  const data = await getTagWithPosts(slug, page);

  if (!data) {
    notFound();
  }

  const { tag, posts, pagination } = data;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="inline-block px-4 py-2 rounded-full text-black font-medium bg-mint mb-4">
          #{tag.name}
        </div>
        <h1 className="text-3xl font-bold text-black mb-2">
          Posts tagged with #{tag.name}
        </h1>
        <p className="text-black/60 text-sm">
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
            basePath={`/tag/${slug}`}
          />
        </>
      ) : (
        <div className="text-center py-16">
          <div className="bg-mint rounded-2xl p-8 max-w-md mx-auto">
            <h2 className="text-xl font-bold text-black mb-2">No posts yet</h2>
            <p className="text-black/70">
              Posts with this tag will appear here.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
