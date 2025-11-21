import Link from 'next/link';
import PostCard from '@/components/PostCard';
import dbConnect from '@/lib/mongodb';
import { Post, Category } from '@/models';
import { IPost, ICategory } from '@/types';
import { ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getLatestPosts(): Promise<IPost[]> {
  await dbConnect();

  const posts = await Post.find({ published: true })
    .populate('author', 'name avatar')
    .populate('category', 'name slug color')
    .populate('tags', 'name slug')
    .sort({ createdAt: -1 })
    .limit(7)
    .lean();

  return JSON.parse(JSON.stringify(posts));
}

async function getCategories(): Promise<ICategory[]> {
  await dbConnect();

  const categories = await Category.find().sort({ name: 1 }).lean();

  return JSON.parse(JSON.stringify(categories));
}

const colorMap: Record<string, string> = {
  blue: 'bg-blue hover:bg-dark-blue',
  green: 'bg-green hover:bg-dark-green',
  purple: 'bg-purple hover:bg-dark-purple',
  tan: 'bg-tan hover:bg-dark-tan',
  red: 'bg-red hover:bg-dark-red',
  mint: 'bg-mint hover:bg-dark-green',
};

export default async function Home() {
  const [posts, categories] = await Promise.all([
    getLatestPosts(),
    getCategories(),
  ]);

  const featuredPost = posts[0];
  const recentPosts = posts.slice(1, 7);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">
          Welcome to <span className="text-dark-purple">OneTrueMint Financial</span>
        </h1>
        <p className="text-lg text-black/70 max-w-2xl mx-auto">
          Discover stories, ideas, and knowledge from writers on any topic.
        </p>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-black mb-4">Featured Post</h2>
          <PostCard post={featuredPost} featured />
        </section>
      )}

      {/* Categories */}
      {categories.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-black">Explore Categories</h2>
            <Link
              href="/categories"
              className="text-dark-blue hover:text-dark-purple flex items-center gap-1 text-sm"
            >
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <Link
                key={category._id}
                href={`/category/${category.slug}`}
                className={`px-4 py-2 rounded-full text-black font-medium transition-colors ${
                  colorMap[category.color] || colorMap.blue
                }`}
              >
                {category.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Recent Posts */}
      {recentPosts.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-black">Recent Posts</h2>
            <Link
              href="/blog"
              className="text-dark-blue hover:text-dark-purple flex items-center gap-1 text-sm"
            >
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentPosts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        </section>
      )}

      {/* Empty State */}
      {posts.length === 0 && (
        <section className="text-center py-16">
          <div className="bg-mint rounded-2xl p-8 max-w-md mx-auto">
            <h2 className="text-xl font-bold text-black mb-2">No posts yet</h2>
            <p className="text-black/70">
              Check back soon for new content!
            </p>
          </div>
        </section>
      )}
    </div>
  );
}
