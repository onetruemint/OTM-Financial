import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex items-center flex-wrap gap-1 text-sm text-black/60">
        <li>
          <Link
            href="/"
            className="flex items-center hover:text-dark-blue transition-colors"
          >
            <Home size={14} />
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-1">
            <ChevronRight size={14} />
            {item.href ? (
              <Link
                href={item.href}
                className="hover:text-dark-blue transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-black">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
