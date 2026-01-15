import { Eye, ClipboardCheck, BarChart3, Users, FileText, ShieldCheck } from 'lucide-react';

const features = [
  {
    icon: Eye,
    title: '360° Immersive Training',
    description:
      'Navigate realistic warehouse environments and identify hazards in interactive 360-degree scenes.',
  },
  {
    icon: ClipboardCheck,
    title: 'Quiz Assessments',
    description:
      'Comprehensive safety quizzes with instant grading, feedback, and performance tracking.',
  },
  {
    icon: BarChart3,
    title: 'Real-Time Analytics',
    description:
      'Monitor team performance with detailed dashboards showing scores, trends, and completion rates.',
  },
  {
    icon: Users,
    title: 'User Management',
    description:
      'Easily manage staff accounts, assign training modules, and track individual progress.',
  },
  {
    icon: FileText,
    title: 'Compliance Reports',
    description:
      'Generate downloadable PDF and CSV reports for safety audits and compliance documentation.',
  },
  {
    icon: ShieldCheck,
    title: 'Role-Based Access',
    description:
      'Secure role separation between staff users and administrators with appropriate permissions.',
  },
];

export const Features = () => {
  return (
    <section className="py-20 lg:py-28">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <span className="mb-4 inline-block rounded-full bg-accent/10 px-4 py-1.5 text-sm font-semibold text-accent">
            Features
          </span>
          <h2 className="mb-4 font-display text-3xl font-bold text-foreground md:text-4xl">
            Complete Safety Training Solution
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to train, assess, and monitor your warehouse team's safety
            compliance.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="card-elevated group p-6"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 font-display text-xl font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
