'use client';

import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { TagData } from '@/lib/data';

interface TagsListProps {
  initialTags: TagData[];
}

export default function TagsList({ initialTags }: TagsListProps) {
  const [tags, setTags] = useState<TagData[]>(initialTags);
  const [newTagName, setNewTagName] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchTags = async () => {
    try {
      const response = await fetch('/api/tags');
      const data = await response.json();
      setTags(data);
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagName.trim()) return;

    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/tags', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newTagName.trim() }),
      });

      if (response.ok) {
        setNewTagName('');
        fetchTags();
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to create tag');
      }
    } catch (error) {
      setError('An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (slug: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/tags/${slug}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchTags();
      } else {
        alert('Failed to delete tag');
      }
    } catch (error) {
      alert('An error occurred');
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black mb-2">Tags</h1>
        <p className="text-black/70">Manage your blog tags.</p>
      </div>

      {/* New Tag Form */}
      <div className="bg-mint rounded-xl p-6 mb-8">
        <h2 className="text-lg font-bold text-black mb-4">Create Tag</h2>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            placeholder="Tag name"
            required
            className="flex-1 px-4 py-2 rounded-lg bg-white border border-dark-blue/30 focus:border-dark-blue focus:outline-none text-black"
          />
          <button
            type="submit"
            disabled={isSubmitting || !newTagName.trim()}
            className="flex items-center justify-center gap-2 px-6 py-2 bg-dark-purple text-black font-medium rounded-lg hover:bg-purple transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={18} />
            {isSubmitting ? 'Adding...' : 'Add Tag'}
          </button>
        </form>
        {error && (
          <div className="bg-red text-black text-sm p-3 rounded-lg mt-4">
            {error}
          </div>
        )}
      </div>

      {/* Tags List */}
      {tags.length > 0 ? (
        <div className="flex flex-wrap gap-3">
          {tags.map((tag) => (
            <div
              key={tag._id}
              className="flex items-center gap-2 px-4 py-2 bg-mint rounded-full group"
            >
              <span className="text-black">#{tag.name}</span>
              <button
                onClick={() => handleDelete(tag.slug, tag.name)}
                className="text-black/30 hover:text-dark-red opacity-0 group-hover:opacity-100 transition-opacity"
                title="Delete"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-mint rounded-xl p-8 text-center">
          <p className="text-black/70">No tags yet.</p>
        </div>
      )}
    </div>
  );
}
