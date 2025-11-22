'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, List } from 'lucide-react';
import { extractHeadings } from '@/lib/utils';

interface TableOfContentsProps {
  content: string;
}

export default function TableOfContents({ content }: TableOfContentsProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const headings = extractHeadings(content);

  if (headings.length < 3) {
    return null;
  }

  return (
    <nav className="bg-mint rounded-xl p-4 mb-8">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full text-left font-bold text-black"
      >
        <span className="flex items-center gap-2">
          <List size={18} />
          Table of Contents
        </span>
        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>
      {isExpanded && (
        <ul className="mt-3 space-y-2">
          {headings.map((heading, index) => (
            <li
              key={index}
              className={heading.level === 3 ? 'ml-4' : ''}
            >
              <a
                href={`#${heading.id}`}
                className="text-sm text-black/70 hover:text-dark-blue transition-colors"
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}
