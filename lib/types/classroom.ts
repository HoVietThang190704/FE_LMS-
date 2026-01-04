export type ClassroomResourceType = 'link' | 'file';

export type ClassroomResource = {
  name: string;
  type: ClassroomResourceType;
  url: string;
  lessonId: string;
  lessonTitle: string;
  week: number;
  size?: number;
  mimeType?: string;
};

export type ClassroomLesson = {
  id: string;
  title: string;
  description?: string;
  week: number;
  order: number;
  durationMinutes?: number;
  resources: ClassroomResource[];
  isPublished: boolean;
};

export type ClassroomCourseMeta = {
  id: string;
  code: string;
  name: string;
  description?: string;
  instructor?: string;
  schedule?: string;
  room?: string;
  credits?: number;
  totalLessons?: number;
};

export type ExerciseProgressDetail = {
  total: number;
  completed: number;
  passed: number;
};

export type LessonProgressDetail = {
  total: number;
  completed: number;
};

export type ProgressDetails = {
  totalExercises: number;
  completedExercises: number;
  quizProgress: ExerciseProgressDetail;
  practiceProgress: ExerciseProgressDetail;
  lessonProgress: LessonProgressDetail;
};

export type ClassroomData = {
  course: ClassroomCourseMeta;
  lessons: ClassroomLesson[];
  resources: ClassroomResource[];
  progress?: number;
  progressDetails?: ProgressDetails;
};
