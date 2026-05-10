import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

export default function PublicLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 -mt-16">{children}</main>
      <Footer />
    </div>
  );
}
