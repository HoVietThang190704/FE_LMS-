export type Stats = {
  enrolledCourses: number;
  pendingAssignments: number;
  averageGrade: string;
  learningProgress: number;
};

export type Course = {
  id: number;
  courseCode: string;
  courseName: string;
  instructor: string;
  progress: number;
  schedule: string;
  room: string;
  lessonProgress: string;
};

export type Assignment = {
  id: number;
  title: string;
  courseCode: string;
  deadline: string;
  status: 'pending' | 'in-progress' | 'completed';
};

export type UserProfile = {
  name: string;
};

export type Notification = {
  id: number;
  title: string;
  description: string;
  time: string;
};
