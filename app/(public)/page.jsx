import HeroSection from '../../components/home/HeroSection';
import LiveStreamSection from '../../components/home/LiveStreamSection';
import VerseOfTheDay from '../../components/home/VerseOfTheDay';
import LatestSermons from '../../components/home/LatestSermons';
import UpcomingEvents from '../../components/home/UpcomingEvents';
import GalleryPreview from '../../components/home/GalleryPreview';

export const metadata = {
  title: 'Home',
  description: 'Welcome to Grace Church – a community of faith, hope, and love.',
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <VerseOfTheDay />
      <LiveStreamSection />
      <LatestSermons />
      <UpcomingEvents />
      <GalleryPreview />
    </>
  );
}
