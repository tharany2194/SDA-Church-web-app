import './globals.css';
import { Inter } from 'next/font/google';
import ReduxProvider from '../store/Provider';
import { Toaster } from 'react-hot-toast';
import AuthInitializer from '../components/auth/AuthInitializer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata = {
  title: {
    default: 'Grace Church',
    template: '%s | Grace Church',
  },
  description: 'Welcome to Grace Church — a community of faith, hope, and love.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Grace Church',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ReduxProvider>
          <AuthInitializer />
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: { borderRadius: '10px', background: '#333', color: '#fff' },
            }}
          />
        </ReduxProvider>
      </body>
    </html>
  );
}
