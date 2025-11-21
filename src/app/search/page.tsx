import PostCard from '@/components/PostCard';
import Pagination from '@/components/Pagination';
import dbConnect from '@/lib/mongodb';
import { Post } from '@/models';
import { IPost } from '@/types';
import { Search } from 'lucide-react';

interface SearchPageProps {
  searchParams: Promise<{ q?: string; page?: string }>;
}

async function searchPosts(query: string, page: number = 1, limit: number = 9) {
  await dbConnect();

  const skip = (page - 1) * limit;
  const searchRegex = new RegExp(query, 'i');

  const filter = {
    published: true,
    $or: [
      { title: searchRegex },
      { excerpt: searchRegex },
      { content: searchRegex },
    ],
  };

  const [posts, total] = await Promise.all([
    Post.find(filter)
      .populate('author', 'name avatar')
      .populate('category', 'name slug color')
      .populate('tags', 'name slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Post.countDocuments(filter),
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

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q || '';
  const page = parseInt(params.page || '1');

  const { posts, pagination } = query
    ? await searchPosts(query, page)
    : { posts: [], pagination: { page: 1, limit: 9, total: 0, pages: 0 } };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black mb-2">Search Results</h1>
        {query && (
          <p className="text-black/70">
            {pagination.total} result{pagination.total !== 1 ? 's' : ''} for &quot;{query}&quot;
          </p>
        )}
      </div>

      {!query ? (
        <div className="text-center py-16">
          <div className="bg-mint rounded-2xl p-8 max-w-md mx-auto">
            <Search size={48} className="text-dark-blue mx-auto mb-4" />
            <h2 className="text-xl font-bold text-black mb-2">Start searching</h2>
            <p className="text-black/70">
              Use the search bar above to find posts.
            </p>
          </div>
        </div>
      ) : posts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.pages}
            basePath={`/search?q=${encodeURIComponent(query)}`}
          />
        </>
      ) : (
        <div className="text-center py-16">
          <div className="bg-mint rounded-2xl p-8 max-w-md mx-auto">
            <h2 className="text-xl font-bold text-black mb-2">No results found</h2>
            <p className="text-black/70">
              Try different keywords or check your spelling.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
