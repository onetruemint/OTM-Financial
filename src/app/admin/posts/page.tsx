import Link from 'next/link';
import dbConnect from '@/lib/mongodb';
import { Post } from '@/models';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { format } from 'date-fns';
import DeletePostButton from '@/components/admin/DeletePostButton';

async function getPosts() {
  await dbConnect();

  const posts = await Post.find()
    .populate('author', 'name')
    .populate('category', 'name')
    .sort({ createdAt: -1 })
    .lean();

  return JSON.parse(JSON.stringify(posts));
}

export default async function AdminPostsPage() {
  const posts = await getPosts();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-black mb-2">Posts</h1>
          <p className="text-black/70">Manage your blog posts.</p>
        </div>
        <Link
          href="/admin/posts/new"
          className="flex items-center gap-2 px-4 py-2 bg-dark-purple text-black rounded-lg hover:bg-purple transition-colors"
        >
          <Plus size={18} />
          New Post
        </Link>
      </div>

      {posts.length > 0 ? (
        <div className="bg-mint rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-blue/20">
                <th className="text-left px-4 py-3 text-sm font-medium text-black/70">Title</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-black/70">Author</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-black/70">Category</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-black/70">Status</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-black/70">Date</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-black/70">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post: {
                _id: string;
                title: string;
                slug: string;
                author?: { name: string };
                category?: { name: string };
                published: boolean;
                createdAt: string;
              }) => (
                <tr key={post._id} className="border-b border-dark-blue/10 last:border-b-0">
                  <td className="px-4 py-3 text-black font-medium">{post.title}</td>
                  <td className="px-4 py-3 text-black/70 text-sm">
                    {post.author?.name || 'Unknown'}
                  </td>
                  <td className="px-4 py-3 text-black/70 text-sm">
                    {post.category?.name || 'None'}
                  </td>
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
                  <td className="px-4 py-3 text-black/70 text-sm">
                    {format(new Date(post.createdAt), 'MMM d, yyyy')}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {post.published && (
                        <Link
                          href={`/blog/${post.slug}`}
                          className="p-1 text-black/50 hover:text-dark-blue"
                          title="View"
                        >
                          <Eye size={16} />
                        </Link>
                      )}
                      <Link
                        href={`/admin/posts/${post.slug}`}
                        className="p-1 text-black/50 hover:text-dark-purple"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </Link>
                      <DeletePostButton slug={post.slug} title={post.title} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-mint rounded-xl p-8 text-center">
          <p className="text-black/70 mb-4">No posts yet.</p>
          <Link
            href="/admin/posts/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-dark-purple text-black rounded-lg hover:bg-purple transition-colors"
          >
            <Plus size={18} />
            Create your first post
          </Link>
        </div>
      )}
    </div>
  );
}
