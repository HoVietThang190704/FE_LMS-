'use client';

import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Check, X } from 'lucide-react';
import type { TestResult } from '@/lib/types/exercises';

interface TestOutputPanelProps {
  results: TestResult[];
  isRunning: boolean;
  passedTests: number;
  totalTests: number;
}

export default function TestOutputPanel({
  results,
  isRunning,
  passedTests,
  totalTests,
}: TestOutputPanelProps) {
  const [expandedTests, setExpandedTests] = useState<Set<string>>(new Set());

  const toggleTest = (testId: string) => {
    const newExpanded = new Set(expandedTests);
    if (newExpanded.has(testId)) {
      newExpanded.delete(testId);
    } else {
      newExpanded.add(testId);
    }
    setExpandedTests(newExpanded);
  };

  if (isRunning) {
    return (
      <div className="h-full bg-white border-t border-gray-200 p-4 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">Running tests...</p>
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="h-full bg-white border-t border-gray-200 p-4 flex items-center justify-center">
        <p className="text-gray-500 text-sm">Run your code to see test results</p>
      </div>
    );
  }

  return (
    <div className="h-full bg-white border-t border-gray-200 overflow-y-auto">
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Test Results</h3>
          <span className={`text-sm font-medium px-3 py-1 rounded ${
            passedTests === totalTests
              ? 'bg-green-100 text-green-700'
              : 'bg-yellow-100 text-yellow-700'
          }`}>
            {passedTests}/{totalTests} passed
          </span>
        </div>
      </div>

      <div className="space-y-2 p-4">
        {results.map((result, index) => (
          <div
            key={result.testCaseId}
            className={`border rounded-lg overflow-hidden ${
              result.passed
                ? 'border-green-200 bg-green-50'
                : 'border-red-200 bg-red-50'
            }`}
          >
            <button
              onClick={() => toggleTest(result.testCaseId)}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-opacity-80 transition-colors"
            >
              <div className="flex items-center gap-3">
                {result.passed ? (
                  <Check className="w-5 h-5 text-green-600" />
                ) : (
                  <X className="w-5 h-5 text-red-600" />
                )}
                <span className="font-medium text-gray-900">Test Case {index + 1}</span>
              </div>
              {expandedTests.has(result.testCaseId) ? (
                <ChevronUp className="w-5 h-5 text-gray-600" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-600" />
              )}
            </button>

            {expandedTests.has(result.testCaseId) && (
              <div className="px-4 pb-3 space-y-3 border-t border-current border-opacity-10">
                <div>
                  <p className="text-xs font-semibold text-gray-600 mb-1">Expected Output:</p>
                  <pre className="bg-white border border-gray-200 rounded p-2 text-xs font-mono text-gray-700 overflow-x-auto">
                    {result.expected}
                  </pre>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-600 mb-1">Actual Output:</p>
                  <pre className="bg-white border border-gray-200 rounded p-2 text-xs font-mono text-gray-700 overflow-x-auto">
                    {result.actual || '(empty)'}
                  </pre>
                </div>
                {result.error && (
                  <div>
                    <p className="text-xs font-semibold text-red-600 mb-1">Error:</p>
                    <pre className="bg-white border border-red-200 rounded p-2 text-xs font-mono text-red-700 overflow-x-auto">
                      {result.error}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
