'use client';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import LoginModal from './LoginModal';

/**
 * withAuth HOC — wraps a page and shows a login modal for unauthenticated users.
 * Usage: export default withAuth(MyPage, ['admin', 'editor'])
 */
export default function withAuth(WrappedComponent, allowedRoles = []) {
  return function ProtectedPage(props) {
    const { user, isAuthenticated, isInitialized } = useSelector((s) => s.auth);
    const [showLogin, setShowLogin] = useState(false);

    useEffect(() => {
      if (!isInitialized) return;
      if (!isAuthenticated) {
        setShowLogin(true);
      } else {
        setShowLogin(false);
      }
    }, [isAuthenticated, isInitialized]);

    if (!isInitialized) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary-600 border-t-transparent" />
        </div>
      );
    }

    if (!isAuthenticated) {
      return (
        <>
          <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white px-4 py-10">
            <div className="max-w-xl rounded-[2rem] border border-white/10 bg-slate-900/95 p-10 shadow-2xl shadow-black/40 text-center">
              <p className="text-xs uppercase tracking-[0.35em] text-sky-300/80">Sign in required</p>
              <h1 className="mt-4 text-3xl font-semibold">You need to sign in to continue</h1>
              <p className="mt-3 text-sm text-slate-300">This page is protected — sign in using the dialog that appears right here, without leaving the current flow.</p>
              <button
                type="button"
                onClick={() => setShowLogin(true)}
                className="btn-primary mt-8 px-6 py-3"
              >
                Open sign in
              </button>
            </div>
          </div>
          <LoginModal open={showLogin} onClose={() => setShowLogin(false)} />
        </>
      );
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
}
