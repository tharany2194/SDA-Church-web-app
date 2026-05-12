import './globals.css';
import { Inter } from 'next/font/google';
import ReduxProvider from '../store/Provider';
import { Toaster } from 'react-hot-toast';
import AuthInitializer from '../components/auth/AuthInitializer';
import ServiceWorkerCleanup from '../components/layout/ServiceWorkerCleanup';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata = {
  title: {
    default: 'Varadarajapuram SDA Church',
    template: '%s | Varadarajapuram SDA Church',
  },
  description: 'Welcome to Varadarajapuram SDA Church — a community of faith, hope, and love.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Varadarajapuram SDA Church',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ServiceWorkerCleanup />
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
