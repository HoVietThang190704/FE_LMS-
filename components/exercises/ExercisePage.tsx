'use client';

import React, { useState } from 'react';
import type { Exercise, SubmissionResult } from '@/lib/types/exercises';
import CodeEditor from './CodeEditor';
import TestOutputPanel from './TestOutputPanel';
import ProblemStatement from './ProblemStatement';

interface ExercisePageProps {
  exercise: Exercise;
}

export default function ExercisePage({ exercise }: ExercisePageProps) {
  const [testResults, setTestResults] = useState<SubmissionResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 flex overflow-hidden">
        <div className="w-[40%] overflow-hidden border-r border-gray-200">
          <ProblemStatement exercise={exercise} />
        </div>

        <div className="flex-1 flex flex-col border-l border-gray-200 overflow-hidden">
          <div className="flex-[7] overflow-hidden">
            <CodeEditor
              exercise={exercise}
              onTestResults={setTestResults}
              onRunning={setIsRunning}
            />
          </div>

          <div className="flex-[3] overflow-hidden">
            <TestOutputPanel
              results={testResults?.results || []}
              isRunning={isRunning}
              passedTests={testResults?.passedTests || 0}
              totalTests={testResults?.totalTests || 0}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
