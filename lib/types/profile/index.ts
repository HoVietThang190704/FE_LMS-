// User types
export interface UserProfile {
  avatarUrl?: string;
  phone?: string;
  bio?: string;
  address?: {
    province?: string;
    district?: string;
    commune?: string;
    street?: string;
    detail?: string;
  };
}

export interface User {
  id: string;
  email: string;
  fullName?: string;
  role: 'admin' | 'teacher' | 'student';
  profile?: UserProfile;
  isActive: boolean;
  isVerified: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Quiz Exercise types
export interface QuizOption {
  id: string;
  text: string;
  isCorrect?: boolean; // Only visible to teacher
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
  explanation?: string;
  points: number;
}

export interface QuizExercise {
  id: string;
  courseId: string;
  courseName?: string;
  courseCode?: string;
  title: string;
  description?: string;
  order: number;
  questions: QuizQuestion[];
  timeLimit?: number; // minutes
  passingScore: number;
  allowRetake: boolean;
  maxAttempts?: number;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  showResultsImmediately: boolean;
  startDate?: string;
  endDate?: string;
  isExpired?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface QuizAnswer {
  questionId: string;
  selectedOptionId: string;
  isCorrect?: boolean;
  pointsEarned?: number;
}

export interface QuizSubmission {
  id: string;
  quizId: string;
  studentId: string;
  answers: QuizAnswer[];
  score: number;
  totalPoints: number;
  percentage: number;
  passed: boolean;
  attemptNumber: number;
  startedAt: string;
  submittedAt: string;
  timeSpent: number;
}

export interface PracticeTestCase {
  id: string;
  input: string;
  expectedOutput: string;
  isHidden?: boolean;
  explanation?: string;
  points: number;
}

export interface PracticeExercise {
  id: string;
  courseId: string;
  courseName?: string;
  courseCode?: string;
  title: string;
  description: string;
  order: number;
  difficulty: 'easy' | 'medium' | 'hard';
  language: string;
  templateCode: string;
  testCases: PracticeTestCase[];
  constraints?: string;
  hints?: string[];
  sampleInput?: string;
  sampleOutput?: string;
  timeLimit: number;
  memoryLimit: number;
  startDate?: string;
  endDate?: string;
  isExpired?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface PracticeTestResult {
  testCaseId: string;
  passed: boolean;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  executionTime?: number;
  error?: string;
  pointsEarned: number;
  isHidden?: boolean;
}

export interface PracticeSubmission {
  id: string;
  practiceId: string;
  studentId: string;
  code: string;
  language: string;
  testResults: PracticeTestResult[];
  passedTests: number;
  totalTests: number;
  score: number;
  totalPoints: number;
  percentage: number;
  passed: boolean;
  executionTime?: number;
  memoryUsed?: number;
  error?: string;
  submittedAt: string;
}

export interface CourseWithExercises {
  id: string;
  code: string;
  name: string;
  description?: string;
  image?: string;
  instructor?: string;
  quizzes?: QuizExercise[];
  practices?: PracticeExercise[];
}
