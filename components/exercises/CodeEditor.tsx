'use client';

import React, { useState, useCallback } from 'react';
import { Play, RotateCcw } from 'lucide-react';
import type { Exercise, CodeLanguage } from '@/lib/types/exercises';
import { submitSolution, getCodeTemplate } from '@/lib/services/exercises/compiler.service';
import LanguageSelector from './LanguageSelector';

interface CodeEditorProps {
  exercise: Exercise;
  onTestResults: (results: any) => void;
  onRunning: (isRunning: boolean) => void;
}

export default function CodeEditor({
  exercise,
  onTestResults,
  onRunning,
}: CodeEditorProps) {
  const [code, setCode] = useState(exercise.template);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<CodeLanguage>(exercise.language);

  const handleRun = useCallback(async () => {
    setIsRunning(true);
    onRunning(true);
    try {
      const result = await submitSolution(
        code,
        selectedLanguage,
        exercise.testCases
      );
      onTestResults(result);
    } catch (error) {
      console.error('Execution error:', error);
    } finally {
      setIsRunning(false);
      onRunning(false);
    }
  }, [code, selectedLanguage, exercise.testCases, onTestResults, onRunning]);

  const handleLanguageChange = (language: CodeLanguage) => {
    setSelectedLanguage(language);
    const template = getCodeTemplate(language);
    setCode(template);
  };

  const handleReset = () => {
    const template = getCodeTemplate(selectedLanguage);
    setCode(template);
  };

  return (
    <div className="h-full bg-white flex flex-col">
      <div className="px-4 py-3 border-b border-gray-200 flex items-center gap-3 bg-gray-50">
        <LanguageSelector value={selectedLanguage} onChange={handleLanguageChange} />
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
  );
}
