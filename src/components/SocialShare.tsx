'use client';

import { Twitter, Facebook, Linkedin, Link as LinkIcon, Check } from 'lucide-react';
import { useState } from 'react';

interface SocialShareProps {
  url: string;
  title: string;
  description?: string;
}

export default function SocialShare({ url, title, description }: SocialShareProps) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-black/60 mr-2">Share:</span>
      <a
        href={shareLinks.twitter}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-full bg-mint hover:bg-blue transition-colors"
        aria-label="Share on Twitter"
      >
        <Twitter size={16} className="text-black" />
      </a>
      <a
        href={shareLinks.facebook}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-full bg-mint hover:bg-blue transition-colors"
        aria-label="Share on Facebook"
      >
        <Facebook size={16} className="text-black" />
      </a>
      <a
        href={shareLinks.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-full bg-mint hover:bg-blue transition-colors"
        aria-label="Share on LinkedIn"
      >
        <Linkedin size={16} className="text-black" />
      </a>
      <button
        onClick={copyToClipboard}
        className="p-2 rounded-full bg-mint hover:bg-blue transition-colors"
        aria-label="Copy link"
      >
        {copied ? (
          <Check size={16} className="text-green-600" />
        ) : (
          <LinkIcon size={16} className="text-black" />
        )}
      </button>
    </div>
  );
}
