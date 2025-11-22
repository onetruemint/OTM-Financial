'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  Tag,
  Users,
  LogOut,
  Home,
  Settings,
} from 'lucide-react';

const menuItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/posts', label: 'Posts', icon: FileText },
  { href: '/admin/categories', label: 'Categories', icon: FolderOpen },
  { href: '/admin/tags', label: 'Tags', icon: Tag },
  { href: '/admin/authors', label: 'Authors', icon: Users },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-mint min-h-screen p-4 flex flex-col">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-black">Admin Panel</h1>
      </div>

      <nav className="flex-1">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href ||
              (item.href !== '/admin' && pathname.startsWith(item.href));

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-dark-purple text-black font-medium'
                      : 'text-black/70 hover:bg-blue hover:text-black'
                  }`}
                >
                  <Icon size={18} />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mt-auto space-y-2">
        <Link
          href="/admin/settings"
          className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
            pathname === '/admin/settings'
              ? 'bg-dark-purple text-black font-medium'
              : 'text-black/70 hover:bg-blue hover:text-black'
          }`}
        >
          <Settings size={18} />
          Settings
        </Link>
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-2 rounded-lg text-black/70 hover:bg-blue hover:text-black transition-colors"
        >
          <Home size={18} />
          View Site
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="flex items-center gap-3 px-4 py-2 rounded-lg text-black/70 hover:bg-red hover:text-black transition-colors w-full"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
