// Types for Grades page (Bảng điểm)

export interface CourseGrade {
  courseId: string;
  courseCode: string;
  courseName: string;
  credits: number;
  quizScore: number | null;      
  practiceScore: number | null;  
  total: number | null;         
  grade: string;                 
}

export interface GradeSummary {
  userId: string;
  totalCredits: number;
  earnedCredits: number;
  gpa: number;
  courses: CourseGrade[];
}

export interface CourseProgressDetail {
  courseId: string;
  courseCode: string;
  courseName: string;
  category: 'Trung bình' | 'Tốt' | 'Xuất sắc';
  progressPercent: number;
  lessonsProgress: string;
  exercisesProgress: string;
  studyTime: string;
  currentScore: number;
}

export interface ProgressReport {
  userId: string;
  streakDays: number;
  lessonsCompleted: number;
  exercisesCompleted: string;
  averageScore: number;
  courseProgress: CourseProgressDetail[];
}

