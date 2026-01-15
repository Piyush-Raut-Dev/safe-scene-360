import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Shield, ArrowRight, Zap, Target, Award } from 'lucide-react';
import { motion } from 'framer-motion';

export const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen overflow-hidden flex items-center">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-accent/20" />
      
      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--primary) / 0.5) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--primary) / 0.5) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />
      
      {/* Glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/30 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
      
      {/* Floating elements */}
      <motion.div 
        className="absolute top-20 right-20 w-20 h-20 border border-primary/30 rounded-lg"
        animate={{ 
          rotate: [0, 90, 180, 270, 360],
          y: [0, -20, 0, 20, 0]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      <motion.div 
        className="absolute bottom-40 left-20 w-12 h-12 bg-accent/20 rounded-full"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.5, 1, 0.5]
        }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      <div className="container relative mx-auto px-4 py-20">
        <div className="mx-auto max-w-5xl text-center">
          {/* Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-5 py-2.5 backdrop-blur-sm"
          >
            <Zap className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              Next-Gen 3D Safety Training Platform
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-6 font-display text-5xl font-bold tracking-tight text-foreground md:text-6xl lg:text-7xl"
          >
            Immersive{' '}
            <span className="gradient-text">360° Safety</span>
            <br />
            Training for Warehouses
          </motion.h1>

          {/* Description */}
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mb-12 max-w-2xl text-lg text-muted-foreground md:text-xl"
          >
            Experience game-like 3D warehouse environments. Identify hazards, 
            complete assessments, and ensure your team achieves full safety compliance.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Button
              size="xl"
              variant="safety"
              onClick={() => navigate('/login')}
              className="group w-full sm:w-auto glow-effect"
            >
              Start Training
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button
              size="xl"
              variant="outline"
              onClick={() => navigate('/login')}
              className="w-full sm:w-auto border-primary/50 hover:bg-primary/10 hover:border-primary"
            >
              Admin Dashboard
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-20 grid grid-cols-1 gap-6 sm:grid-cols-3"
          >
            {[
              { icon: Target, value: '360°', label: 'Immersive 3D Scenes', color: 'primary' },
              { icon: Shield, value: '100+', label: 'Safety Scenarios', color: 'accent' },
              { icon: Award, value: '98%', label: 'Compliance Rate', color: 'success' },
            ].map((stat, index) => (
              <motion.div 
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                className="group glass-card p-6 hover:border-primary/50 transition-all duration-300"
              >
                <div className={`mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-${stat.color}/20 text-${stat.color} group-hover:scale-110 transition-transform`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div className="font-display text-4xl font-bold gradient-text mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};
