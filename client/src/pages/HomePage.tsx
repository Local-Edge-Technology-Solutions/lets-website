import CustomCursor from '@/components/CustomCursor';
import ScrollProgress from '@/components/ScrollProgress';
import LoadingPortal from '@/components/LoadingPortal';
import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import Solutions from '@/components/Solutions';
import ProcessMethodology from '@/components/ProcessMethodology';
import FounderBios from '@/components/FounderBios';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import StickyCtaButton from '@/components/StickyCtaButton';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <CustomCursor />
      <ScrollProgress />
      <LoadingPortal />
      <Navigation />

      <main>
        <Hero />
        <Solutions />
        <ProcessMethodology />
        <FounderBios />
        <ContactSection />
      </main>

      <Footer />
      <StickyCtaButton />
      {/* Chat needs an AI key and a Netlify function before it can come back. */}
      {/* <ChatWidget /> */}
    </div>
  );
}
