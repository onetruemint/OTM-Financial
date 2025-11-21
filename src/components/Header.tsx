'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Search, Menu, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="bg-white border-b border-mint sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Image
              src="/logo-small.png"
              alt="OTM Financial Logo"
              width={40}
              height={40}
              className="w-10 h-10 rounded-md"
            />
            <span className="text-2xl font-bold text-black">
              OTM Financial
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-black hover:text-dark-blue transition-colors">
              Home
            </Link>
            <Link href="/blog" className="text-black hover:text-dark-blue transition-colors">
              Blog
            </Link>
            <Link href="/categories" className="text-black hover:text-dark-blue transition-colors">
              Categories
            </Link>
          </nav>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center">
            <div className="relative">
              <input
                type="text"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 px-4 py-2 pr-10 rounded-full bg-mint border border-transparent focus:border-dark-blue focus:outline-none text-black placeholder-black/50"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-black/50 hover:text-dark-blue"
              >
                <Search size={18} />
              </button>
            </div>
          </form>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-black"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-mint pt-4">
            <nav className="flex flex-col gap-4">
              <Link
                href="/"
                className="text-black hover:text-dark-blue transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/blog"
                className="text-black hover:text-dark-blue transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Blog
              </Link>
              <Link
                href="/categories"
                className="text-black hover:text-dark-blue transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Categories
              </Link>
            </nav>
            <form onSubmit={handleSearch} className="mt-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 pr-10 rounded-full bg-mint border border-transparent focus:border-dark-blue focus:outline-none text-black placeholder-black/50"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-black/50 hover:text-dark-blue"
                >
                  <Search size={18} />
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </header>
  );
}
