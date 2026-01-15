export type UserRole = 'staff' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'active' | 'inactive';
  avatar?: string;
  department?: string;
  createdAt: Date;
  lastLogin?: Date;
}

export interface Hazard {
  id: string;
  x: number;
  y: number;
  type: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface Scene {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  hazards: Hazard[];
  duration: number; // in minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface HazardAttempt {
  id: string;
  sceneId: string;
  userId: string;
  identifiedHazards: string[];
  correctCount: number;
  totalHazards: number;
  accuracyScore: number;
  timestamp: Date;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  category: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
  timeLimit?: number; // in minutes, undefined = untimed
  passingScore: number;
}

export interface QuizAttempt {
  id: string;
  userId: string;
  quizId: string;
  answers: number[];
  score: number;
  percentage: number;
  passed: boolean;
  timestamp: Date;
  timeSpent: number; // in seconds
}

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  averageQuizScore: number;
  averageHazardAccuracy: number;
  completedTrainings: number;
  pendingAssessments: number;
}

export interface UserPerformance {
  userId: string;
  userName: string;
  quizAttempts: number;
  averageQuizScore: number;
  hazardAttempts: number;
  averageHazardAccuracy: number;
  lastActivity: Date;
  trend: 'improving' | 'stable' | 'declining';
}
