import HeroSection from '../../components/home/HeroSection';
import LiveStreamSection from '../../components/home/LiveStreamSection';
import VerseOfTheDay from '../../components/home/VerseOfTheDay';
import UpcomingEvents from '../../components/home/UpcomingEvents';

export const metadata = {
  title: 'Home',
  description: 'Welcome to Varadarajapuram SDA Church – a community of faith, hope, and love.',
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <VerseOfTheDay />
      <LiveStreamSection />
      <UpcomingEvents />
    </>
  );
}
