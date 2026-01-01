'use client';

import React, { useState, useCallback } from 'react';
import { ChevronLeft, Play, RotateCcw } from 'lucide-react';
import type { ExerciseProblem } from '@/lib/types/exams';
import type { CodeLanguage } from '@/lib/types/exercises';
import { submitSolution, getCodeTemplate } from '@/lib/services/exercises/compiler.service';
import LanguageSelector from '@/components/exercises/LanguageSelector';
import TestOutputPanel from '@/components/exercises/TestOutputPanel';

interface PracticalExerciseEditorProps {
  exercise: ExerciseProblem;
  onBack: () => void;
  messages?: Record<string, unknown>;
}

interface TestResult {
  testCaseId: string;
  passed: boolean;
  expected: string;
  actual: string;
  error?: string;
}

interface SubmissionResult {
  success: boolean;
  passedTests: number;
  totalTests: number;
  results: TestResult[];
  message?: string;
}

export default function PracticalExerciseEditor({
  exercise,
  onBack,
  messages,
}: PracticalExerciseEditorProps) {
  const [code, setCode] = useState(exercise.temp_code);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<CodeLanguage>('python');
  const [testResults, setTestResults] = useState<SubmissionResult | null>(null);

  const handleRun = useCallback(async () => {
    setIsRunning(true);
    try {
      const mappedTestCases = (exercise.testcase || []).map((tc, idx) => ({
        id: String(idx),
        input: tc.input,
        expectedOutput: tc.expectedOutput,
        visible: tc.visible ?? false,
      }));

      const result = await submitSolution(code, selectedLanguage, mappedTestCases);
      setTestResults(result);
    } catch (error) {
      setTestResults({
        success: false,
        passedTests: 0,
        totalTests: exercise.testcase?.length || 0,
        results: [],
        message: 'Error executing code',
      });
    } finally {
      setIsRunning(false);
    }
  }, [code, selectedLanguage, exercise.testcase]);

  const handleLanguageChange = (language: CodeLanguage) => {
    setSelectedLanguage(language);
    const template = getCodeTemplate(language);
    setCode(template);
  };

  const handleReset = () => {
    setCode(exercise.temp_code);
    setTestResults(null);
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ChevronLeft size={20} />
          <span className="font-medium">Quay lại</span>
        </button>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-900">{exercise.title}</h2>
          <p className="text-sm text-gray-600 mt-1">{exercise.description}</p>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-[40%] overflow-y-auto border-r border-gray-200 bg-white p-6">
          <div className="prose prose-sm max-w-none">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Mô tả bài toán
            </h3>
            <p className="text-gray-700 mb-6">{exercise.description}</p>

            {exercise.testcase && exercise.testcase.length > 0 && (
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-3">
                  Ví dụ test case
                </h4>
                <div className="space-y-4">
                  {exercise.testcase.map((tc, idx) => (
                    <div
                      key={idx}
                      className="bg-gray-50 border border-gray-200 rounded-lg p-3"
                    >
                      <p className="text-xs font-semibold text-gray-600 mb-2">
                        Ví dụ {idx + 1}
                      </p>
                      <div className="space-y-2 text-xs">
                        <div>
                          <span className="font-medium text-gray-700">Input:</span>
                          <pre className="bg-white border border-gray-200 rounded mt-1 p-2 overflow-x-auto text-gray-600">
                            {tc.input}
                          </pre>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Output:</span>
                          <pre className="bg-white border border-gray-200 rounded mt-1 p-2 overflow-x-auto text-gray-600">
                            {tc.expectedOutput}
                          </pre>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col border-l border-gray-200 overflow-hidden">
          <div className="flex-[7] overflow-hidden bg-white">
            <div className="flex flex-col h-full">
              <div className="px-4 py-3 border-b border-gray-200 flex items-center gap-3 bg-gray-50">
                <LanguageSelector
                  value={selectedLanguage}
                  onChange={handleLanguageChange}
                />
                <button
                  onClick={handleRun}
                  disabled={isRunning}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm"
                >
                  <Play className="w-4 h-4" />
                  Run Tests
                </button>
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium text-sm"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </button>
              </div>

              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="flex-1 px-4 py-4 font-mono text-sm text-gray-900 bg-white border-none outline-none resize-none"
                placeholder="Write your code here..."
                spellCheck="false"
              />
            </div>
          </div>

          <div className="flex-[3] overflow-hidden">
            <TestOutputPanel
              results={testResults?.results || []}
              isRunning={isRunning}
              passedTests={testResults?.passedTests || 0}
              totalTests={testResults?.totalTests || exercise.testcase?.length || 0}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
