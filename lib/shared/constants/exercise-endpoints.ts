import { buildApiUrl } from '@/lib/shared/utils/api';

const PISTOL_API_BASE = process.env.NEXT_PUBLIC_PISTOL_API_BASE || 'https://api.judge0.com';

export const COMPILER_API = {
  SUBMIT: `${PISTOL_API_BASE}/submissions`,
  CHECK: (token: string) => `${PISTOL_API_BASE}/submissions/${token}`,
};

export const EXERCISE_API = {
  GET_EXERCISE: (id: string) => buildApiUrl(`/api/exercises/${id}`),
  GET_EXERCISES: buildApiUrl('/api/exercises'),
  SUBMIT_SOLUTION: buildApiUrl('/api/exercises/submit'),
  GET_SUBMISSION: (id: string) => buildApiUrl(`/api/submissions/${id}`),
};

export const EXERCISE_PROBLEM_API = {
  GET_PROBLEMS: buildApiUrl('/api/exercise-problems'),
  GET_PROBLEM: (id: string) => buildApiUrl(`/api/exercise-problems/${id}`),
  GET_PROBLEMS_BY_COURSE: (courseId: string) => buildApiUrl(`/api/exercise-problems?courseId=${courseId}`),
};

export const EXAM_API = {
  GET_EXAMS: buildApiUrl('/api/exams'),
  GET_EXAM: (id: string) => buildApiUrl(`/api/exams/${id}`),
  GET_EXAMS_BY_COURSE: (courseId: string) => buildApiUrl(`/api/exams?courseId=${courseId}`),
};
