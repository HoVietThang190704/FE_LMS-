export type Exam = {
  _id: string;
  exam_id?: string;
  courseId: string;
  title: string;
  order: number;
  description: string;
  correct_answer: string | number;
  createdAt: string;
  updatedAt: string;
};

export type ExerciseProblem = {
  _id: string;
  exercise_id?: string;
  courseId: string;
  title: string;
  order: number;
  description: string;
  temp_code: string;
  testcase: Array<{
    input: string;
    expectedOutput: string;
    visible?: boolean;
  }>;
  createdAt: string;
  updatedAt: string;
};
