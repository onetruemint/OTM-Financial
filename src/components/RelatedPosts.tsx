import Link from 'next/link';
import { IPost } from '@/types';

interface RelatedPostsProps {
  posts: IPost[];
}

export default function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) {
    return null;
  }

  return (
    <div className="mt-12 pt-8 border-t border-mint">
      <h2 className="text-xl font-bold text-black mb-6">Related Posts</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {posts.map((post) => (
          <Link
            key={post._id}
            href={`/blog/${post.slug}`}
            className="group block p-4 bg-mint rounded-lg hover:bg-blue transition-colors"
          >
            {post.featuredImage && (
              <div className="aspect-video rounded-md overflow-hidden mb-3">
                <img
                  src={post.featuredImage}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
            )}
            <h3 className="font-medium text-black text-sm line-clamp-2">
              {post.title}
            </h3>
          </Link>
        ))}
      </div>
    </div>
  );
}
