import Link from 'next/link';
import dbConnect from '@/lib/mongodb';
import { Post, Category, Tag, Author } from '@/models';
import { FileText, FolderOpen, Tag as TagIcon, Users, Plus } from 'lucide-react';

async function getStats() {
  await dbConnect();

  const [postsCount, publishedCount, categoriesCount, tagsCount, authorsCount] = await Promise.all([
    Post.countDocuments(),
    Post.countDocuments({ published: true }),
    Category.countDocuments(),
    Tag.countDocuments(),
    Author.countDocuments(),
  ]);

  const recentPosts = await Post.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .select('title slug published createdAt')
    .lean();

  return {
    postsCount,
    publishedCount,
    draftsCount: postsCount - publishedCount,
    categoriesCount,
    tagsCount,
    authorsCount,
    recentPosts: JSON.parse(JSON.stringify(recentPosts)),
  };
}

export default async function AdminDashboard() {
  const stats = await getStats();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black mb-2">Dashboard</h1>
        <p className="text-black/70">Welcome to your blog admin panel.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <FileText size={24} className="text-dark-blue" />
            <span className="text-2xl font-bold text-black">{stats.postsCount}</span>
          </div>
          <p className="text-black/70 text-sm">Total Posts</p>
          <p className="text-xs text-black/50 mt-1">
            {stats.publishedCount} published, {stats.draftsCount} drafts
          </p>
        </div>

        <div className="bg-green rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <FolderOpen size={24} className="text-dark-green" />
            <span className="text-2xl font-bold text-black">{stats.categoriesCount}</span>
          </div>
          <p className="text-black/70 text-sm">Categories</p>
        </div>

        <div className="bg-purple rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <TagIcon size={24} className="text-dark-purple" />
            <span className="text-2xl font-bold text-black">{stats.tagsCount}</span>
          </div>
          <p className="text-black/70 text-sm">Tags</p>
        </div>

        <div className="bg-tan rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <Users size={24} className="text-dark-tan" />
            <span className="text-2xl font-bold text-black">{stats.authorsCount}</span>
          </div>
          <p className="text-black/70 text-sm">Authors</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-black mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/posts/new"
            className="flex items-center gap-2 px-4 py-2 bg-dark-purple text-black rounded-lg hover:bg-purple transition-colors"
          >
            <Plus size={18} />
            New Post
          </Link>
          <Link
            href="/admin/categories"
            className="flex items-center gap-2 px-4 py-2 bg-mint text-black rounded-lg hover:bg-dark-green transition-colors"
          >
            <Plus size={18} />
            New Category
          </Link>
          <Link
            href="/admin/tags"
            className="flex items-center gap-2 px-4 py-2 bg-mint text-black rounded-lg hover:bg-dark-green transition-colors"
          >
            <Plus size={18} />
            New Tag
          </Link>
        </div>
      </div>

      {/* Recent Posts */}
      <div>
        <h2 className="text-xl font-bold text-black mb-4">Recent Posts</h2>
        {stats.recentPosts.length > 0 ? (
          <div className="bg-mint rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-blue/20">
                  <th className="text-left px-4 py-3 text-sm font-medium text-black/70">Title</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-black/70">Status</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-black/70">Actions</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentPosts.map((post: { _id: string; title: string; slug: string; published: boolean }) => (
                  <tr key={post._id} className="border-b border-dark-blue/10 last:border-b-0">
                    <td className="px-4 py-3 text-black">{post.title}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          post.published
                            ? 'bg-dark-green text-black'
                            : 'bg-tan text-black'
                        }`}
                      >
                        {post.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/posts/${post.slug}`}
                        className="text-dark-blue hover:text-dark-purple text-sm"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-mint rounded-xl p-6 text-center">
            <p className="text-black/70">No posts yet.</p>
            <Link
              href="/admin/posts/new"
              className="text-dark-blue hover:text-dark-purple text-sm"
            >
              Create your first post
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
