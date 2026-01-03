import type { Exam, ExerciseProblem } from '@/lib/types/exams';
import { fetchFromApi } from '@/lib/shared/utils/api';
import { EXERCISE_PROBLEM_API, EXAM_API } from '@/lib/shared/constants/exercise-endpoints';

export async function getExerciseProblems(courseId: string): Promise<ExerciseProblem[]> {
  try {
    const data = await fetchFromApi<ExerciseProblem[]>(EXERCISE_PROBLEM_API.GET_PROBLEMS_BY_COURSE(courseId));
    return data || [];
  } catch {
    return [];
  }
}

export async function getExerciseProblemById(id: string): Promise<ExerciseProblem | null> {
  try {
    const data = await fetchFromApi<ExerciseProblem>(EXERCISE_PROBLEM_API.GET_PROBLEM(id));
    return data || null;
  } catch {
    return null;
  }
}

export async function getExams(courseId: string): Promise<Exam[]> {
  try {
    const data = await fetchFromApi<Exam[]>(EXAM_API.GET_EXAMS_BY_COURSE(courseId));
    return data || [];
  } catch {
    return [];
  }
}

export async function getExamById(id: string): Promise<Exam | null> {
  try {
    const data = await fetchFromApi<Exam>(EXAM_API.GET_EXAM(id));
    return data || null;
  } catch {
    return null;
  }
}
