'use client';

import { useState } from 'react';
import { Plus, User } from 'lucide-react';
import type { AuthorData } from '@/lib/data';

interface AuthorsListProps {
  initialAuthors: AuthorData[];
}

export default function AuthorsList({ initialAuthors }: AuthorsListProps) {
  const [authors, setAuthors] = useState<AuthorData[]>(initialAuthors);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    avatar: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchAuthors = async () => {
    try {
      const response = await fetch('/api/authors');
      const data = await response.json();
      setAuthors(data);
    } catch (error) {
      console.error('Error fetching authors:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/authors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormData({ name: '', email: '', bio: '', avatar: '' });
        setShowForm(false);
        fetchAuthors();
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to create author');
      }
    } catch (error) {
      setError('An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-black mb-2">Authors</h1>
          <p className="text-black/70">Manage your blog authors.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-dark-purple text-black rounded-lg hover:bg-purple transition-colors"
        >
          <Plus size={18} />
          New Author
        </button>
      </div>

      {/* New Author Form */}
      {showForm && (
        <div className="bg-mint rounded-xl p-6 mb-8">
          <h2 className="text-lg font-bold text-black mb-4">Create Author</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-black mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-4 py-2 rounded-lg bg-white border border-dark-blue/30 focus:border-dark-blue focus:outline-none text-black"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-black mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full px-4 py-2 rounded-lg bg-white border border-dark-blue/30 focus:border-dark-blue focus:outline-none text-black"
                />
              </div>
            </div>

            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-black mb-1">
                Bio
              </label>
              <textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={3}
                maxLength={500}
                className="w-full px-4 py-2 rounded-lg bg-white border border-dark-blue/30 focus:border-dark-blue focus:outline-none text-black resize-none"
              />
            </div>

            <div>
              <label htmlFor="avatar" className="block text-sm font-medium text-black mb-1">
                Avatar URL
              </label>
              <input
                type="url"
                id="avatar"
                value={formData.avatar}
                onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-white border border-dark-blue/30 focus:border-dark-blue focus:outline-none text-black"
                placeholder="https://example.com/avatar.jpg"
              />
            </div>

            {error && (
              <div className="bg-red text-black text-sm p-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-dark-purple text-black font-medium rounded-lg hover:bg-purple transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Creating...' : 'Create Author'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-2 bg-white text-black rounded-lg hover:bg-blue transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Authors List */}
      {authors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {authors.map((author) => (
            <div key={author._id} className="bg-mint rounded-xl p-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-dark-purple flex items-center justify-center">
                  <User size={20} className="text-black" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-black">{author.name}</h3>
                  <p className="text-black/70 text-sm">{author.email}</p>
                  {author.bio && (
                    <p className="text-black/60 text-sm mt-2 line-clamp-2">{author.bio}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-mint rounded-xl p-8 text-center">
          <p className="text-black/70">No authors yet.</p>
        </div>
      )}
    </div>
  );
}
