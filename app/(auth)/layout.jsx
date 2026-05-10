import Navbar from '../../components/layout/Navbar';

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-church-cream">
      <Navbar />
      <div className="flex items-center justify-center py-12 px-4">
        {children}
      </div>
    </div>
  );
}
