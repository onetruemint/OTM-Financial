import Link from 'next/link';
import { Calendar, Heart, User } from 'lucide-react';
import { format } from 'date-fns';
import { IPost } from '@/types';

interface PostCardProps {
  post: IPost;
  featured?: boolean;
}

const colorMap: Record<string, string> = {
  blue: 'bg-blue',
  green: 'bg-green',
  purple: 'bg-purple',
  tan: 'bg-tan',
  red: 'bg-red',
  mint: 'bg-mint',
};

export default function PostCard({ post, featured = false }: PostCardProps) {
  const category = typeof post.category === 'object' ? post.category : null;
  const author = typeof post.author === 'object' ? post.author : null;
  const categoryColor = category?.color || 'blue';

  if (featured) {
    return (
      <article className="relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-mint group">
        <Link
          href={`/blog/${post.slug}`}
          className="absolute inset-0 z-0"
          aria-label={`Read ${post.title}`}
        />
        <div className="md:flex">
          {post.featuredImage && (
            <div className="md:w-1/2">
              <img
                src={post.featuredImage}
                alt={post.title}
                className="w-full h-64 md:h-full object-cover"
              />
            </div>
          )}
          <div className={`p-6 ${post.featuredImage ? 'md:w-1/2' : 'w-full'}`}>
            {category && (
              <Link
                href={`/category/${category.slug}`}
                className={`relative z-10 inline-block px-3 py-1 rounded-full text-sm font-medium text-black ${colorMap[categoryColor]} hover:opacity-80 transition-opacity`}
              >
                {category.name}
              </Link>
            )}
            <h2 className="text-2xl font-bold text-black mt-3 mb-2 group-hover:text-dark-purple transition-colors">
              {post.title}
            </h2>
            <p className="text-black/70 mb-4">{post.excerpt}</p>
            <div className="flex items-center justify-between text-sm text-black/60">
              <div className="flex items-center gap-4">
                {author && (
                  <span className="flex items-center gap-1">
                    <User size={14} />
                    {author.name}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Calendar size={14} />
                  {format(new Date(post.createdAt), 'MMM d, yyyy')}
                </span>
              </div>
              <span className="flex items-center gap-1">
                <Heart size={14} />
                {post.likes}
              </span>
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-mint group cursor-pointer">
      <Link
        href={`/blog/${post.slug}`}
        className="absolute inset-0 z-0"
        aria-label={`Read ${post.title}`}
      />
      {post.featuredImage && (
        <img
          src={post.featuredImage}
          alt={post.title}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-5">
        {category && (
          <Link
            href={`/category/${category.slug}`}
            className={`relative z-10 inline-block px-3 py-1 rounded-full text-xs font-medium text-black ${colorMap[categoryColor]} hover:opacity-80 transition-opacity`}
          >
            {category.name}
          </Link>
        )}
        <h3 className="text-lg font-bold text-black mt-2 mb-2 group-hover:text-dark-purple transition-colors line-clamp-2">
          {post.title}
        </h3>
        <p className="text-black/70 text-sm mb-3 line-clamp-2">{post.excerpt}</p>
        <div className="flex items-center justify-between text-xs text-black/60">
          <span className="flex items-center gap-1">
            <Calendar size={12} />
            {format(new Date(post.createdAt), 'MMM d, yyyy')}
          </span>
          <span className="flex items-center gap-1">
            <Heart size={12} />
            {post.likes}
          </span>
        </div>
      </div>
    </article>
  );
}
