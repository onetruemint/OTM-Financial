import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Calendar, User, Tag as TagIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Metadata } from 'next';
import dbConnect from '@/lib/mongodb';
import { Post } from '@/models';
import { IPost } from '@/types';
import LikeButton from '@/components/LikeButton';
import { ArticleJsonLd, BreadcrumbJsonLd } from '@/components/JsonLd';
import { generateArticleMetadata, siteConfig } from '@/lib/seo';
import ReadingTime from '@/components/ReadingTime';
import TableOfContents from '@/components/TableOfContents';
import RelatedPosts from '@/components/RelatedPosts';
import SocialShare from '@/components/SocialShare';
import Breadcrumbs from '@/components/Breadcrumbs';

export const dynamic = 'force-dynamic';

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

async function getPost(slug: string): Promise<IPost | null> {
  await dbConnect();

  const post = await Post.findOne({ slug, published: true })
    .populate('author', 'name avatar bio')
    .populate('category', 'name slug color')
    .populate('tags', 'name slug')
    .lean();

  return post ? JSON.parse(JSON.stringify(post)) : null;
}

async function getRelatedPosts(post: IPost): Promise<IPost[]> {
  await dbConnect();

  const categoryId = typeof post.category === 'object' ? post.category._id : post.category;
  const tagIds = post.tags?.map(tag => typeof tag === 'object' ? tag._id : tag) || [];

  const relatedPosts = await Post.find({
    _id: { $ne: post._id },
    published: true,
    $or: [
      { category: categoryId },
      { tags: { $in: tagIds } },
    ],
  })
    .populate('author', 'name avatar')
    .populate('category', 'name slug color')
    .sort({ createdAt: -1 })
    .limit(3)
    .lean();

  return JSON.parse(JSON.stringify(relatedPosts));
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  const author = typeof post.author === 'object' ? post.author : null;
  const tags = post.tags?.filter((tag) => typeof tag === 'object').map((tag) =>
    typeof tag === 'object' ? tag.name : ''
  ) || [];

  return generateArticleMetadata({
    title: post.title,
    description: post.excerpt,
    slug: post.slug,
    publishedTime: new Date(post.createdAt).toISOString(),
    modifiedTime: post.updatedAt ? new Date(post.updatedAt).toISOString() : undefined,
    authors: author ? [author.name] : undefined,
    tags,
    image: post.featuredImage,
  });
}

const colorMap: Record<string, string> = {
  blue: 'bg-blue',
  green: 'bg-green',
  purple: 'bg-purple',
  tan: 'bg-tan',
  red: 'bg-red',
  mint: 'bg-mint',
};

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  const category = typeof post.category === 'object' ? post.category : null;
  const author = typeof post.author === 'object' ? post.author : null;
  const tags = post.tags?.filter((tag) => typeof tag === 'object') || [];
  const categoryColor = category?.color || 'blue';
  const relatedPosts = await getRelatedPosts(post);
  const postUrl = `${siteConfig.url}/blog/${post.slug}`;

  return (
    <>
      <ArticleJsonLd
        title={post.title}
        description={post.excerpt}
        url={`${siteConfig.url}/blog/${post.slug}`}
        imageUrl={post.featuredImage}
        datePublished={new Date(post.createdAt).toISOString()}
        dateModified={post.updatedAt ? new Date(post.updatedAt).toISOString() : undefined}
        authorName={author?.name || 'OneTrueMint'}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: siteConfig.url },
          { name: 'Blog', url: `${siteConfig.url}/blog` },
          { name: post.title, url: `${siteConfig.url}/blog/${post.slug}` },
        ]}
      />
      <article className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: 'Blog', href: '/blog' },
            { label: post.title },
          ]}
        />

        {/* Header */}
        <header className="mb-8">
        {category && (
          <Link
            href={`/category/${category.slug}`}
            className={`inline-block px-3 py-1 rounded-full text-sm font-medium text-black ${colorMap[categoryColor]} hover:opacity-80 transition-opacity mb-4`}
          >
            {category.name}
          </Link>
        )}
        <h1 className="text-3xl md:text-4xl font-bold text-black mb-4">
          {post.title}
        </h1>
        <p className="text-lg text-black/70 mb-6">{post.excerpt}</p>
        <div className="flex flex-wrap items-center gap-4 text-sm text-black/60">
          {author && (
            <Link
              href={`/author/${author._id}`}
              className="flex items-center gap-2 hover:text-dark-blue transition-colors"
            >
              {author.avatar ? (
                <img
                  src={author.avatar}
                  alt={author.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <User size={16} />
              )}
              {author.name}
            </Link>
          )}
          <span className="flex items-center gap-1">
            <Calendar size={16} />
            {format(new Date(post.createdAt), 'MMMM d, yyyy')}
          </span>
          <ReadingTime content={post.content} />
        </div>
      </header>

      {/* Featured Image */}
      {post.featuredImage && (
        <div className="mb-8 rounded-xl overflow-hidden">
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full h-auto object-cover"
          />
        </div>
      )}

      {/* Table of Contents */}
      <TableOfContents content={post.content} />

      {/* Content */}
      <div
        className="prose prose-lg max-w-none mb-8 text-black/80"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Tags */}
      {tags.length > 0 && (
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-2">
            <TagIcon size={16} className="text-black/60" />
            {tags.map((tag) => (
              <Link
                key={typeof tag === 'object' ? tag._id : tag}
                href={`/tag/${typeof tag === 'object' ? tag.slug : ''}`}
                className="px-3 py-1 bg-mint rounded-full text-sm text-black hover:bg-dark-green transition-colors"
              >
                #{typeof tag === 'object' ? tag.name : ''}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Like Button and Social Share */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-mint pt-6">
        <div className="flex items-center gap-4">
          <span className="text-black/60">Did you enjoy this post?</span>
          <LikeButton slug={post.slug} initialLikes={post.likes} />
        </div>
        <SocialShare url={postUrl} title={post.title} description={post.excerpt} />
      </div>

      {/* Author Bio */}
      {author && author.bio && (
        <div className="mt-8 p-6 bg-mint rounded-xl">
          <div className="flex items-start gap-4">
            {author.avatar ? (
              <img
                src={author.avatar}
                alt={author.name}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-dark-purple flex items-center justify-center">
                <User size={24} className="text-black" />
              </div>
            )}
            <div>
              <h3 className="font-bold text-black mb-1">{author.name}</h3>
              <p className="text-black/70 text-sm">{author.bio}</p>
            </div>
          </div>
        </div>
      )}

      {/* Related Posts */}
      <RelatedPosts posts={relatedPosts} />
      </article>
    </>
  );
}
