export type CodeLanguage = 'python' | 'java' | 'c' | 'cpp' | 'rust';

export type TestCase = {
  id: string;
  input: string;
  expectedOutput: string;
  visible: boolean;
  explanation?: string;
};

export type Exercise = {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  language: CodeLanguage;
  template: string;
  testCases: TestCase[];
  constraints?: string;
  examples?: Array<{
    input: string;
    output: string;
    explanation?: string;
  }>;
  timeLimit?: number;
  memoryLimit?: number;
};

export type CompileRequest = {
  code: string;
  language: CodeLanguage;
  input?: string;
};

export type CompileResponse = {
  output?: string;
  error?: string;
  success: boolean;
  executionTime?: number;
  memory?: number;
};

export type TestResult = {
  testCaseId: string;
  passed: boolean;
  expected: string;
  actual: string;
  error?: string;
};

export type SubmissionResult = {
  success: boolean;
  passedTests: number;
  totalTests: number;
  results: TestResult[];
  message?: string;
};
