import type { Exercise } from '@/lib/types/exercises';
import { CODE_TEMPLATES } from './compiler.service';

export async function getExerciseById(id: string): Promise<Exercise> {
  const mockExercise: Exercise = {
    id,
    title: 'Sum of Two Numbers',
    description: 'Write a program that takes two numbers as input and outputs their sum.',
    difficulty: 'easy',
    language: 'python',
    template: CODE_TEMPLATES.python,
    testCases: [
      {
        id: '1',
        input: '3\n5',
        expectedOutput: '8',
        visible: true,
        explanation: 'Sum of 3 and 5 is 8',
      },
      {
        id: '2',
        input: '10\n20',
        expectedOutput: '30',
        visible: true,
      },
      {
        id: '3',
        input: '-5\n5',
        expectedOutput: '0',
        visible: false,
      },
    ],
    constraints: '-1000 ≤ a, b ≤ 1000',
    examples: [
      {
        input: '3\n5',
        output: '8',
        explanation: 'Simply add the two numbers together',
      },
    ],
    timeLimit: 10000,
    memoryLimit: 256000,
  };

  return mockExercise;
}

export function getExercises(): Promise<Exercise[]> {
  return Promise.resolve([]);
}
