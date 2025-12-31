import type { Exercise, CodeLanguage } from '@/lib/types/exercises';
import { fetchFromApi } from '@/lib/shared/utils/api';
import { EXERCISE_API } from '@/lib/shared/constants/exercise-endpoints';

type BackendTestCase = {
  id: string;
  input: string;
  expectedOutput: string;
  visible?: boolean;
  explanation?: string;
};

type BackendExercise = {
  _id?: string;
  id?: string;
  title?: string;
  description?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  language?: string;
  template?: string;
  testCases?: BackendTestCase[];
  constraints?: string;
  examples?: Array<{ input: string; output: string; explanation?: string }>;
  timeLimit?: number;
  memoryLimit?: number;
};

export async function getExerciseById(id: string): Promise<Exercise> {
  const data = await fetchFromApi<BackendExercise>(EXERCISE_API.GET_EXERCISE(id));
  const ex = data as BackendExercise;

  return {
    id: (ex._id || ex.id) as string,
    title: ex.title || '',
    description: ex.description || '',
    difficulty: ex.difficulty || 'easy',
    language: (ex.language || 'python') as CodeLanguage,
    template: ex.template || '',
    testCases: (ex.testCases || []).map((t) => ({
      id: t.id,
      input: t.input,
      expectedOutput: t.expectedOutput,
      visible: !!t.visible,
      explanation: t.explanation,
    })),
    constraints: ex.constraints,
    examples: ex.examples || [],
    timeLimit: ex.timeLimit,
    memoryLimit: ex.memoryLimit,
  } as Exercise;
}

export async function getExercises(): Promise<Exercise[]> {
  const data = await fetchFromApi<BackendExercise[]>(EXERCISE_API.GET_EXERCISES);
  return (data || []).map((ex) => ({
    id: (ex._id || ex.id) as string,
    title: ex.title || '',
    description: ex.description || '',
    difficulty: ex.difficulty || 'easy',
    language: (ex.language || 'python') as CodeLanguage,
    template: ex.template || '',
    testCases: (ex.testCases || []).map((t) => ({
      id: t.id,
      input: t.input,
      expectedOutput: t.expectedOutput,
      visible: !!t.visible,
      explanation: t.explanation,
    })),
    constraints: ex.constraints,
    examples: ex.examples || [],
    timeLimit: ex.timeLimit,
    memoryLimit: ex.memoryLimit,
  }));
}
