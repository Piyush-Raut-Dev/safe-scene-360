import { MainLayout } from '@/components/layout/MainLayout';
import { Hero } from '@/components/landing/Hero';
import { Features } from '@/components/landing/Features';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { CTA } from '@/components/landing/CTA';
import { Footer } from '@/components/landing/Footer';

const Index = () => {
  return (
    <MainLayout>
      <Hero />
      <Features />
      <HowItWorks />
      <CTA />
      <Footer />
    </MainLayout>
  );
};

export default Index;
