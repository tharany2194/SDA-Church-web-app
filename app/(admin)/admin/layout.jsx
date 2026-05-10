'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import {
  LayoutDashboard, MessageSquare, Calendar, Image, FileText,
  Users, Heart, LogOut, ChevronRight, Menu, X
} from 'lucide-react';
import { logout } from '../../../store/slices/authSlice';
import { useState } from 'react';
import clsx from 'clsx';
import withAuth from '../../../components/auth/withAuth';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const navItems = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/messages', icon: MessageSquare, label: 'Sermons' },
  { href: '/admin/events', icon: Calendar, label: 'Events' },
  { href: '/admin/gallery', icon: Image, label: 'Gallery' },
  { href: '/admin/articles', icon: FileText, label: 'Articles' },
  { href: '/admin/prayers', icon: Heart, label: 'Prayer Requests' },
  { href: '/admin/users', icon: Users, label: 'Users & Roles', superAdminOnly: true },
];

function AdminLayout({ children }) {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const router = useRouter();
  const { user } = useSelector((s) => s.auth);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await dispatch(logout());
    toast.success('Signed out');
    router.replace('/');
  };

  const filteredNav = navItems.filter(
    (item) => !item.superAdminOnly || user?.role === 'super_admin'
  );

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary-400 flex items-center justify-center">
            <span className="text-white font-bold">✝</span>
          </div>
          <span className="text-white font-bold">Admin Panel</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {filteredNav.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            onClick={() => setSidebarOpen(false)}
            className={clsx(
              'flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors',
              pathname === href
                ? 'bg-white/20 text-white'
                : 'text-gray-300 hover:text-white hover:bg-white/10'
            )}
          >
            <Icon size={18} />
            {label}
          </Link>
        ))}
      </nav>

      {/* User info + logout */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-primary-400 flex items-center justify-center text-white font-medium text-sm">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-white text-sm font-medium truncate max-w-[120px]">{user?.name}</p>
            <p className="text-gray-400 text-xs capitalize">
              {user?.role === 'super_admin' ? '⭐ Super Admin' : user?.role}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-4 py-2 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-60 bg-primary-900 flex-col fixed inset-y-0 left-0">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="w-60 bg-primary-900 flex flex-col">
            <SidebarContent />
          </div>
          <div className="flex-1 bg-black/50" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Main Content */}
      <div className="lg:ml-60 flex-1 flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="bg-white border-b border-gray-200 px-6 h-14 flex items-center justify-between sticky top-0 z-30">
          <button
            className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={20} />
          </button>
          <h1 className="font-semibold text-gray-900 capitalize">
            {navItems.find((n) => n.href === pathname)?.label || 'Admin'}
          </h1>
          <Link href="/" className="text-sm text-primary-600 hover:underline flex items-center gap-1">
            View Site <ChevronRight size={14} />
          </Link>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}

export default withAuth(AdminLayout, ['super_admin', 'admin', 'editor', 'volunteer']);
