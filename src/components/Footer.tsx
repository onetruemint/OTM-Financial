import Link from 'next/link';
import Image from 'next/image';
import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-mint border-t border-dark-blue/20 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-2">
              <Image
                src="/logo-small.png"
                alt="OTM Financial Logo"
                width={32}
                height={32}
                className="w-8 h-8 rounded-md"
              />
              <h3 className="text-xl font-bold text-black">OTM Financial</h3>
            </Link>
            <p className="text-black/70 text-sm">
              Sharing ideas, stories, and knowledge with the world.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-black mb-3">Quick Links</h4>
            <nav className="flex flex-col gap-2">
              <Link href="/" className="text-black/70 hover:text-dark-blue text-sm transition-colors">
                Home
              </Link>
              <Link href="/blog" className="text-black/70 hover:text-dark-blue text-sm transition-colors">
                Blog
              </Link>
              <Link href="/categories" className="text-black/70 hover:text-dark-blue text-sm transition-colors">
                Categories
              </Link>
            </nav>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-semibold text-black mb-3">Admin</h4>
            <Link
              href="/admin"
              className="text-black/70 hover:text-dark-blue text-sm transition-colors"
            >
              Admin Dashboard
            </Link>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-dark-blue/20 text-center">
          <p className="text-black/70 text-sm flex items-center justify-center gap-1">
            Made with <Heart size={14} className="text-dark-red fill-dark-red" /> using Next.js
          </p>
        </div>
      </div>
    </footer>
  );
}
