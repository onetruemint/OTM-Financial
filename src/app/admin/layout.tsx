import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || headersList.get('x-invoke-path') || '';

  // Skip auth check for login page
  const isLoginPage = pathname.includes('/admin/login');

  if (isLoginPage) {
    return <>{children}</>;
  }

  const session = await auth();

  if (!session) {
    redirect('/admin/login');
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 p-8 bg-white">
        {children}
      </div>
    </div>
  );
}
