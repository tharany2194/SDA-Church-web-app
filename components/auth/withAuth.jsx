'use client';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

/**
 * withAuth HOC — wraps a page and redirects unauthenticated users.
 * Usage: export default withAuth(MyPage, ['admin', 'editor'])
 */
export default function withAuth(WrappedComponent, allowedRoles = []) {
  return function ProtectedPage(props) {
    const { user, isAuthenticated, isInitialized } = useSelector((s) => s.auth);
    const router = useRouter();

    useEffect(() => {
      if (!isInitialized) return;
      if (!isAuthenticated) {
        router.replace('/login');
        return;
      }
      if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
        router.replace('/');
      }
    }, [isAuthenticated, isInitialized, router, user]);

    if (!isInitialized || !isAuthenticated) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary-600 border-t-transparent" />
        </div>
      );
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
}
