import Link from 'next/link';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-dark-purple mb-4">404</h1>
        <h2 className="text-2xl font-bold text-black mb-4">Page Not Found</h2>
        <p className="text-black/70 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-dark-purple text-black font-medium rounded-lg hover:bg-purple transition-colors"
        >
          <Home size={18} />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
