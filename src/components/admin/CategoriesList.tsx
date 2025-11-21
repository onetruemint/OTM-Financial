'use client';

import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { CategoryData } from '@/lib/data';

interface CategoriesListProps {
  initialCategories: CategoryData[];
}

const colors = ['blue', 'green', 'purple', 'tan', 'red', 'mint'];

const colorClasses: Record<string, string> = {
  blue: 'bg-blue',
  green: 'bg-green',
  purple: 'bg-purple',
  tan: 'bg-tan',
  red: 'bg-red',
  mint: 'bg-mint',
};

interface CategoryWithColor extends CategoryData {
  color?: string;
}

export default function CategoriesList({ initialCategories }: CategoriesListProps) {
  const [categories, setCategories] = useState<CategoryWithColor[]>(initialCategories);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: 'blue',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormData({ name: '', description: '', color: 'blue' });
        setShowForm(false);
        fetchCategories();
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to create category');
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
      const response = await fetch(`/api/categories/${slug}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchCategories();
      } else {
        alert('Failed to delete category');
      }
    } catch (error) {
      alert('An error occurred');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-black mb-2">Categories</h1>
          <p className="text-black/70">Manage your blog categories.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-dark-purple text-black rounded-lg hover:bg-purple transition-colors"
        >
          <Plus size={18} />
          New Category
        </button>
      </div>

      {/* New Category Form */}
      {showForm && (
        <div className="bg-mint rounded-xl p-6 mb-8">
          <h2 className="text-lg font-bold text-black mb-4">Create Category</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
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
              <label htmlFor="description" className="block text-sm font-medium text-black mb-1">
                Description
              </label>
              <input
                type="text"
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                maxLength={200}
                className="w-full px-4 py-2 rounded-lg bg-white border border-dark-blue/30 focus:border-dark-blue focus:outline-none text-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">Color</label>
              <div className="flex flex-wrap gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData({ ...formData, color })}
                    className={`px-4 py-2 rounded-lg capitalize ${colorClasses[color]} ${
                      formData.color === color
                        ? 'ring-2 ring-dark-purple ring-offset-2'
                        : ''
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
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
                {isSubmitting ? 'Creating...' : 'Create Category'}
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

      {/* Categories List */}
      {categories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <div
              key={category._id}
              className={`${colorClasses[category.color || 'mint']} rounded-xl p-4`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-black">{category.name}</h3>
                  {category.description && (
                    <p className="text-black/70 text-sm mt-1">{category.description}</p>
                  )}
                  <p className="text-black/50 text-xs mt-2">/{category.slug}</p>
                </div>
                <button
                  onClick={() => handleDelete(category.slug, category.name)}
                  className="p-1 text-black/50 hover:text-dark-red"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-mint rounded-xl p-8 text-center">
          <p className="text-black/70">No categories yet.</p>
        </div>
      )}
    </div>
  );
}
