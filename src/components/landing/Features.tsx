import { Eye, ClipboardCheck, BarChart3, Users, FileText, ShieldCheck, Gamepad2, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    icon: Gamepad2,
    title: '3D Game Experience',
    description:
      'Navigate realistic warehouse environments in first-person view with WASD controls and identify hazards interactively.',
    gradient: 'from-primary to-blue-400',
  },
  {
    icon: Eye,
    title: '360° Immersive Training',
    description:
      'Explore every corner of virtual warehouses with fully navigable 3D scenes and realistic lighting.',
    gradient: 'from-accent to-yellow-400',
  },
  {
    icon: ClipboardCheck,
    title: 'Quiz Assessments',
    description:
      'Comprehensive safety quizzes with instant grading, detailed feedback, and performance tracking.',
    gradient: 'from-success to-emerald-400',
  },
  {
    icon: BarChart3,
    title: 'Real-Time Analytics',
    description:
      'Monitor team performance with beautiful dashboards showing scores, trends, and completion rates.',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: Users,
    title: 'User Management',
    description:
      'Easily manage staff accounts, assign training modules, and track individual progress.',
    gradient: 'from-cyan-500 to-blue-500',
  },
  {
    icon: FileText,
    title: 'Compliance Reports',
    description:
      'Generate downloadable PDF and CSV reports for safety audits and compliance documentation.',
    gradient: 'from-orange-500 to-red-500',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export const Features = () => {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 hero-pattern" />
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-primary/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-[120px]" />
      
      <div className="container relative mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-16 max-w-2xl text-center"
        >
          <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2 text-sm font-semibold text-accent border border-accent/20">
            <Zap className="h-4 w-4" />
            Powerful Features
          </span>
          <h2 className="mb-4 font-display text-4xl font-bold text-foreground md:text-5xl">
            Complete Safety Training
            <span className="gradient-text-accent"> Solution</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to train, assess, and monitor your warehouse team's safety
            compliance in one powerful platform.
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="group glass-card p-6 hover:border-primary/40 transition-all duration-500"
            >
              <div className={`mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${feature.gradient} text-white shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300`}>
                <feature.icon className="h-7 w-7" />
              </div>
              <h3 className="mb-2 font-display text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
