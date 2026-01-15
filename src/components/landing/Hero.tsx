import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Shield, Eye, ClipboardCheck, ArrowRight } from 'lucide-react';

export const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-accent/80" />
      
      {/* Pattern overlay */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="container relative mx-auto px-4 py-24 lg:py-32">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-2 backdrop-blur-sm">
            <Shield className="h-4 w-4 text-accent" />
            <span className="text-sm font-medium text-primary-foreground">
              Next-Gen Safety Training Platform
            </span>
          </div>

          {/* Headline */}
          <h1 className="mb-6 font-display text-4xl font-bold tracking-tight text-primary-foreground md:text-5xl lg:text-6xl">
            360° Warehouse Safety
            <span className="block text-accent">Training & Monitoring</span>
          </h1>

          {/* Description */}
          <p className="mx-auto mb-10 max-w-2xl text-lg text-primary-foreground/80 md:text-xl">
            Immersive 360-degree scenes, interactive hazard identification, and comprehensive
            quizzes to ensure your warehouse team is safety-certified and compliant.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="xl"
              variant="safety"
              onClick={() => navigate('/login')}
              className="group w-full sm:w-auto"
            >
              Start Training
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button
              size="xl"
              variant="hero-outline"
              onClick={() => navigate('/login')}
              className="w-full sm:w-auto"
            >
              Admin Login
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="rounded-xl border border-primary-foreground/10 bg-primary-foreground/5 p-6 backdrop-blur-sm">
              <div className="mb-2 font-display text-3xl font-bold text-accent">360°</div>
              <div className="text-sm text-primary-foreground/70">Immersive Scenes</div>
            </div>
            <div className="rounded-xl border border-primary-foreground/10 bg-primary-foreground/5 p-6 backdrop-blur-sm">
              <div className="mb-2 font-display text-3xl font-bold text-accent">100+</div>
              <div className="text-sm text-primary-foreground/70">Safety Scenarios</div>
            </div>
            <div className="rounded-xl border border-primary-foreground/10 bg-primary-foreground/5 p-6 backdrop-blur-sm">
              <div className="mb-2 font-display text-3xl font-bold text-accent">98%</div>
              <div className="text-sm text-primary-foreground/70">Compliance Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            className="fill-background"
          />
        </svg>
      </div>
    </section>
  );
};
