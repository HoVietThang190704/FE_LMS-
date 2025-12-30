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
