import './globals.css';
import { Inter, Libre_Baskerville } from 'next/font/google';
import ReduxProvider from '../store/Provider';
import { Toaster } from 'react-hot-toast';
import AuthInitializer from '../components/auth/AuthInitializer';
import ServiceWorkerCleanup from '../components/layout/ServiceWorkerCleanup';
import LoginModalLayer from '../components/auth/LoginModalLayer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const libreBaskerville = Libre_Baskerville({
  weight: ['400', '700'],
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-libre-baskerville',
});

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
    <html lang="en" className={`${inter.variable} ${libreBaskerville.variable}`} suppressHydrationWarning>
      <body className={libreBaskerville.className} suppressHydrationWarning>
        <ServiceWorkerCleanup />
        <ReduxProvider>
          <AuthInitializer />
          {children}
          <LoginModalLayer />
          <Toaster
            position="top-right"
            containerStyle={{ zIndex: 999999 }}
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
