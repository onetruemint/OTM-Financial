'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';

interface LikeButtonProps {
  slug: string;
  initialLikes: number;
}

export default function LikeButton({ slug, initialLikes }: LikeButtonProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLike = async () => {
    if (isLiked || isLoading) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/posts/${slug}/like`, {
        method: 'POST',
      });

      if (response.ok) {
        const data = await response.json();
        setLikes(data.likes);
        setIsLiked(true);
      }
    } catch (error) {
      console.error('Error liking post:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={isLiked || isLoading}
      className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
        isLiked
          ? 'bg-red text-black cursor-default'
          : 'bg-mint hover:bg-red text-black'
      }`}
    >
      <Heart
        size={18}
        className={isLiked ? 'fill-dark-red text-dark-red' : ''}
      />
      <span className="font-medium">{likes}</span>
    </button>
  );
}
