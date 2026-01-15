import { User, Scene, Quiz, QuizAttempt, HazardAttempt, DashboardStats, UserPerformance, Hazard } from '@/types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Martinez',
    email: 'john.martinez@warehouse.com',
    role: 'staff',
    status: 'active',
    department: 'Receiving',
    createdAt: new Date('2024-01-15'),
    lastLogin: new Date('2025-01-14'),
  },
  {
    id: '2',
    name: 'Sarah Chen',
    email: 'sarah.chen@warehouse.com',
    role: 'staff',
    status: 'active',
    department: 'Shipping',
    createdAt: new Date('2024-02-20'),
    lastLogin: new Date('2025-01-13'),
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike.johnson@warehouse.com',
    role: 'admin',
    status: 'active',
    department: 'Safety',
    createdAt: new Date('2023-06-01'),
    lastLogin: new Date('2025-01-15'),
  },
  {
    id: '4',
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@warehouse.com',
    role: 'staff',
    status: 'active',
    department: 'Inventory',
    createdAt: new Date('2024-03-10'),
    lastLogin: new Date('2025-01-12'),
  },
  {
    id: '5',
    name: 'David Kim',
    email: 'david.kim@warehouse.com',
    role: 'staff',
    status: 'inactive',
    department: 'Receiving',
    createdAt: new Date('2024-01-05'),
    lastLogin: new Date('2024-12-20'),
  },
];

// Scene 1: Main Storage Area - realistic warehouse hazards
export const storageHazards: Hazard[] = [
  { id: 'h1', x: -6, y: 0.02, z: 3, type: 'spill', description: 'Oil spill on floor - slip hazard', severity: 'high', size: 1.5 },
  { id: 'h2', x: 4, y: 2.5, z: -8, type: 'stacking', description: 'Unstable pallet stacking - falling hazard', severity: 'critical', size: 1 },
  { id: 'h3', x: -10, y: 1.5, z: 0, type: 'exit', description: 'Blocked emergency exit with boxes', severity: 'critical', size: 1 },
  { id: 'h4', x: 8, y: 0.3, z: 5, type: 'equipment', description: 'Damaged forklift with flat tire', severity: 'medium', size: 1.2 },
];

// Scene 2: Loading Dock - shipping area hazards
export const loadingHazards: Hazard[] = [
  { id: 'h5', x: -5, y: 0.02, z: 6, type: 'spill', description: 'Water puddle from leaking dock door', severity: 'medium', size: 2 },
  { id: 'h6', x: 6, y: 0, z: -4, type: 'electrical', description: 'Exposed electrical wiring', severity: 'critical', size: 0.5 },
  { id: 'h7', x: 0, y: 3, z: 8, type: 'lighting', description: 'Broken overhead light - dim work area', severity: 'low', size: 1 },
  { id: 'h8', x: -8, y: 1, z: -6, type: 'ppe', description: 'Missing safety signage at dock edge', severity: 'medium', size: 1 },
];

// Scene 3: Chemical Storage - hazmat hazards
export const chemicalHazards: Hazard[] = [
  { id: 'h9', x: -4, y: 0.02, z: -5, type: 'chemical', description: 'Leaking chemical drum - green liquid', severity: 'critical', size: 1.8 },
  { id: 'h10', x: 5, y: 1.2, z: -3, type: 'fire', description: 'Fire extinguisher blocked by barrels', severity: 'high', size: 1 },
  { id: 'h11', x: 0, y: 0, z: 4, type: 'ppe', description: 'Safety shower obstructed', severity: 'high', size: 1 },
  { id: 'h12', x: -7, y: 1.5, z: 2, type: 'stacking', description: 'Improperly stacked chemical containers', severity: 'critical', size: 1 },
  { id: 'h13', x: 8, y: 0.5, z: 0, type: 'electrical', description: 'Damaged electrical panel cover', severity: 'high', size: 0.8 },
  { id: 'h14', x: 3, y: 2.8, z: -7, type: 'lighting', description: 'Flickering emergency light', severity: 'medium', size: 0.6 },
];

export const mockScenes: Scene[] = [
  {
    id: 'scene1',
    name: 'Main Storage Area',
    description: 'Identify hazards in the primary warehouse storage zone',
    imageUrl: '/placeholder.svg',
    hazards: storageHazards,
    duration: 10,
    difficulty: 'beginner',
  },
  {
    id: 'scene2',
    name: 'Loading Dock',
    description: 'Safety assessment of the shipping and receiving area',
    imageUrl: '/placeholder.svg',
    hazards: loadingHazards,
    duration: 15,
    difficulty: 'intermediate',
  },
  {
    id: 'scene3',
    name: 'Chemical Storage',
    description: 'Hazardous materials handling zone inspection',
    imageUrl: '/placeholder.svg',
    hazards: chemicalHazards,
    duration: 20,
    difficulty: 'advanced',
  },
];

export const mockQuizzes: Quiz[] = [
  {
    id: 'quiz1',
    title: 'Warehouse Safety Fundamentals',
    description: 'Basic safety protocols and emergency procedures',
    passingScore: 70,
    timeLimit: 15,
    questions: [
      {
        id: 'q1',
        question: 'What should you do first when you discover a chemical spill?',
        options: [
          'Clean it up immediately',
          'Alert nearby workers and evacuate the area',
          'Continue working and report it later',
          'Take a photo for documentation',
        ],
        correctAnswer: 1,
        explanation: 'Safety first! Alert others and evacuate before any cleanup attempts.',
        category: 'Emergency Response',
      },
      {
        id: 'q2',
        question: 'What is the maximum height for manual lifting without assistance?',
        options: ['Above shoulder height', 'Above head height', 'Waist to shoulder', 'Any height'],
        correctAnswer: 2,
        explanation: 'Manual lifting should be done between waist and shoulder height to prevent injuries.',
        category: 'Manual Handling',
      },
      {
        id: 'q3',
        question: 'How often should fire extinguishers be inspected?',
        options: ['Monthly', 'Quarterly', 'Annually', 'Only when used'],
        correctAnswer: 0,
        explanation: 'Monthly visual inspections ensure fire extinguishers are ready for use.',
        category: 'Fire Safety',
      },
      {
        id: 'q4',
        question: 'What is the primary purpose of PPE?',
        options: [
          'To look professional',
          'To protect against workplace hazards',
          'To identify employees',
          'For comfort while working',
        ],
        correctAnswer: 1,
        explanation: 'PPE is designed to protect workers from workplace hazards and reduce injury risk.',
        category: 'PPE',
      },
      {
        id: 'q5',
        question: 'When operating a forklift, you should:',
        options: [
          'Drive as fast as possible to save time',
          'Always honk when turning corners',
          'Text while driving if needed',
          'Carry passengers on the forks',
        ],
        correctAnswer: 1,
        explanation: 'Honking at corners alerts pedestrians and other operators of your presence.',
        category: 'Equipment Safety',
      },
    ],
  },
  {
    id: 'quiz2',
    title: 'Hazard Identification',
    description: 'Advanced hazard recognition and risk assessment',
    passingScore: 80,
    timeLimit: 20,
    questions: [
      {
        id: 'q6',
        question: 'Which hazard classification requires immediate evacuation?',
        options: ['Low risk', 'Medium risk', 'High risk', 'Critical/Imminent danger'],
        correctAnswer: 3,
        explanation: 'Critical hazards with imminent danger require immediate evacuation.',
        category: 'Risk Assessment',
      },
      {
        id: 'q7',
        question: 'What color are warning signs typically?',
        options: ['Red and white', 'Yellow and black', 'Blue and white', 'Green and white'],
        correctAnswer: 1,
        explanation: 'Yellow and black is the standard color combination for warning signs.',
        category: 'Safety Signage',
      },
    ],
  },
];

export const mockQuizAttempts: QuizAttempt[] = [
  {
    id: 'qa1',
    userId: '1',
    quizId: 'quiz1',
    answers: [1, 2, 0, 1, 1],
    score: 5,
    percentage: 100,
    passed: true,
    timestamp: new Date('2025-01-10'),
    timeSpent: 480,
  },
  {
    id: 'qa2',
    userId: '2',
    quizId: 'quiz1',
    answers: [1, 0, 0, 1, 0],
    score: 3,
    percentage: 60,
    passed: false,
    timestamp: new Date('2025-01-12'),
    timeSpent: 600,
  },
  {
    id: 'qa3',
    userId: '4',
    quizId: 'quiz1',
    answers: [1, 2, 0, 1, 1],
    score: 5,
    percentage: 100,
    passed: true,
    timestamp: new Date('2025-01-14'),
    timeSpent: 420,
  },
];

export const mockHazardAttempts: HazardAttempt[] = [
  {
    id: 'ha1',
    sceneId: 'scene1',
    userId: '1',
    identifiedHazards: ['h1', 'h2', 'h3'],
    correctCount: 3,
    totalHazards: 4,
    accuracyScore: 75,
    timestamp: new Date('2025-01-11'),
  },
  {
    id: 'ha2',
    sceneId: 'scene1',
    userId: '2',
    identifiedHazards: ['h1', 'h2', 'h3', 'h4'],
    correctCount: 4,
    totalHazards: 4,
    accuracyScore: 100,
    timestamp: new Date('2025-01-13'),
  },
];

export const mockDashboardStats: DashboardStats = {
  totalUsers: 5,
  activeUsers: 4,
  averageQuizScore: 86.7,
  averageHazardAccuracy: 87.5,
  completedTrainings: 12,
  pendingAssessments: 3,
};

export const mockUserPerformance: UserPerformance[] = [
  {
    userId: '1',
    userName: 'John Martinez',
    quizAttempts: 3,
    averageQuizScore: 92,
    hazardAttempts: 2,
    averageHazardAccuracy: 85,
    lastActivity: new Date('2025-01-14'),
    trend: 'improving',
  },
  {
    userId: '2',
    userName: 'Sarah Chen',
    quizAttempts: 2,
    averageQuizScore: 75,
    hazardAttempts: 3,
    averageHazardAccuracy: 90,
    lastActivity: new Date('2025-01-13'),
    trend: 'stable',
  },
  {
    userId: '4',
    userName: 'Emily Rodriguez',
    quizAttempts: 4,
    averageQuizScore: 88,
    hazardAttempts: 2,
    averageHazardAccuracy: 82,
    lastActivity: new Date('2025-01-12'),
    trend: 'improving',
  },
];
