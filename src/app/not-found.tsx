import Link from 'next/link';
import { Home, Search, BookOpen, TrendingUp } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full text-center">
        <h1 className="text-6xl font-bold text-dark-purple mb-4">404</h1>
        <h2 className="text-2xl font-bold text-black mb-4">Page Not Found</h2>
        <p className="text-black/70 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        {/* Search Form */}
        <form action="/search" method="GET" className="mb-8">
          <div className="relative">
            <input
              type="text"
              name="q"
              placeholder="Search for articles..."
              className="w-full px-4 py-3 pl-12 rounded-lg bg-mint border border-dark-blue/30 focus:border-dark-blue focus:outline-none text-black"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-black/50" size={18} />
          </div>
        </form>

        {/* Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Link
            href="/"
            className="flex flex-col items-center gap-2 p-4 bg-mint rounded-lg hover:bg-blue transition-colors"
          >
            <Home size={24} className="text-dark-blue" />
            <span className="text-sm font-medium text-black">Home</span>
          </Link>
          <Link
            href="/blog"
            className="flex flex-col items-center gap-2 p-4 bg-mint rounded-lg hover:bg-blue transition-colors"
          >
            <BookOpen size={24} className="text-dark-blue" />
            <span className="text-sm font-medium text-black">All Posts</span>
          </Link>
          <Link
            href="/categories"
            className="flex flex-col items-center gap-2 p-4 bg-mint rounded-lg hover:bg-blue transition-colors"
          >
            <TrendingUp size={24} className="text-dark-blue" />
            <span className="text-sm font-medium text-black">Categories</span>
          </Link>
        </div>

        <p className="text-sm text-black/60">
          Need help? Try searching above or browse our{' '}
          <Link href="/categories" className="text-dark-blue hover:underline">
            categories
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
