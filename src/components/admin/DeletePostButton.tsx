'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';

interface DeletePostButtonProps {
  slug: string;
  title: string;
}

export default function DeletePostButton({ slug, title }: DeletePostButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/posts/${slug}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.refresh();
      } else {
        alert('Failed to delete post');
      }
    } catch (error) {
      alert('An error occurred');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="p-1 text-black/50 hover:text-dark-red disabled:opacity-50"
      title="Delete"
    >
      <Trash2 size={16} />
    </button>
  );
}
