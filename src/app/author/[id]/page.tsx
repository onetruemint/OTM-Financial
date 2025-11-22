import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { User } from 'lucide-react';
import PostCard from '@/components/PostCard';
import Pagination from '@/components/Pagination';
import Breadcrumbs from '@/components/Breadcrumbs';
import dbConnect from '@/lib/mongodb';
import { Post, Author } from '@/models';
import { IPost, IAuthor } from '@/types';
import { generateListMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';

interface AuthorPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string }>;
}

async function getAuthorWithPosts(id: string, page: number = 1, limit: number = 9) {
  await dbConnect();

  const author = await Author.findById(id).lean();

  if (!author) {
    return null;
  }

  const skip = (page - 1) * limit;

  const [posts, total] = await Promise.all([
    Post.find({ author: author._id, published: true })
      .populate('author', 'name avatar')
      .populate('category', 'name slug color')
      .populate('tags', 'name slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Post.countDocuments({ author: author._id, published: true }),
  ]);

  return {
    author: JSON.parse(JSON.stringify(author)) as IAuthor,
    posts: JSON.parse(JSON.stringify(posts)) as IPost[],
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
}

export async function generateMetadata({ params }: AuthorPageProps): Promise<Metadata> {
  const { id } = await params;
  await dbConnect();
  const author = await Author.findById(id).lean();

  if (!author) {
    return { title: 'Author Not Found' };
  }

  const authorData = JSON.parse(JSON.stringify(author)) as IAuthor;

  return generateListMetadata({
    title: `Articles by ${authorData.name}`,
    description: authorData.bio || `Read all articles written by ${authorData.name} on personal finance, budgeting, and investing.`,
    path: `/author/${id}`,
  });
}

export default async function AuthorPage({ params, searchParams }: AuthorPageProps) {
  const { id } = await params;
  const { page: pageParam } = await searchParams;
  const page = parseInt(pageParam || '1');

  const data = await getAuthorWithPosts(id, page);

  if (!data) {
    notFound();
  }

  const { author, posts, pagination } = data;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Breadcrumbs
        items={[
          { label: 'Authors', href: '/blog' },
          { label: author.name },
        ]}
      />

      {/* Author Header */}
      <div className="mb-8 p-6 bg-mint rounded-xl">
        <div className="flex items-start gap-4">
          {author.avatar ? (
            <img
              src={author.avatar}
              alt={author.name}
              className="w-20 h-20 rounded-full object-cover"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-dark-purple flex items-center justify-center">
              <User size={32} className="text-black" />
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold text-black mb-2">{author.name}</h1>
            {author.bio && (
              <p className="text-black/70">{author.bio}</p>
            )}
            <p className="text-sm text-black/60 mt-2">
              {pagination.total} article{pagination.total !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>

      {/* Posts */}
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
            basePath={`/author/${id}`}
          />
        </>
      ) : (
        <div className="text-center py-16">
          <div className="bg-mint rounded-2xl p-8 max-w-md mx-auto">
            <h2 className="text-xl font-bold text-black mb-2">No posts yet</h2>
            <p className="text-black/70">
              This author hasn&apos;t published any posts yet.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
