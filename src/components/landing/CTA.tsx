import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Shield } from 'lucide-react';

export const CTA = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 lg:py-28">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary/95 to-accent/80 p-8 md:p-16">
          {/* Pattern overlay */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />

          <div className="relative z-10 mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/20">
              <Shield className="h-8 w-8 text-accent" />
            </div>

            <h2 className="mb-4 font-display text-3xl font-bold text-primary-foreground md:text-4xl lg:text-5xl">
              Ready to Transform Your Safety Training?
            </h2>

            <p className="mb-8 text-lg text-primary-foreground/80 md:text-xl">
              Join leading warehouses using Safe360 to keep their teams safe and compliant.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                size="xl"
                variant="safety"
                onClick={() => navigate('/login')}
                className="group w-full sm:w-auto"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button
                size="lg"
                variant="hero-outline"
                onClick={() => navigate('/login')}
                className="w-full sm:w-auto"
              >
                Contact Sales
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
