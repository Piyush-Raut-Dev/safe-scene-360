import { LogIn, Eye, ClipboardList, Award } from 'lucide-react';

const steps = [
  {
    icon: LogIn,
    step: '01',
    title: 'Login Securely',
    description: 'Staff and admins access the platform with role-based authentication.',
  },
  {
    icon: Eye,
    step: '02',
    title: 'Explore 360° Scenes',
    description: 'Navigate immersive warehouse environments and identify safety hazards.',
  },
  {
    icon: ClipboardList,
    step: '03',
    title: 'Complete Quizzes',
    description: 'Take timed assessments to test your safety knowledge and understanding.',
  },
  {
    icon: Award,
    step: '04',
    title: 'Track Progress',
    description: 'View scores, get feedback, and monitor improvement over time.',
  },
];

export const HowItWorks = () => {
  return (
    <section className="bg-muted/50 py-20 lg:py-28">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
            How It Works
          </span>
          <h2 className="mb-4 font-display text-3xl font-bold text-foreground md:text-4xl">
            Simple, Effective Training
          </h2>
          <p className="text-lg text-muted-foreground">
            Get your team safety-certified in four easy steps.
          </p>
        </div>

        <div className="relative">
          {/* Connection line */}
          <div className="absolute left-1/2 top-0 hidden h-full w-0.5 -translate-x-1/2 bg-border lg:block" />

          <div className="grid gap-8 lg:grid-cols-4">
            {steps.map((item, index) => (
              <div key={item.step} className="relative text-center">
                {/* Step circle */}
                <div className="relative z-10 mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-card shadow-lg ring-4 ring-background">
                  <div className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-accent font-display text-sm font-bold text-accent-foreground">
                    {item.step}
                  </div>
                  <item.icon className="h-8 w-8 text-primary" />
                </div>

                <h3 className="mb-2 font-display text-xl font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
