'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { Exercise } from '@/lib/types/exercises';

interface ProblemStatementProps {
  exercise: Exercise;
}

export default function ProblemStatement({ exercise }: ProblemStatementProps) {
  const [expandedSection, setExpandedSection] = useState<string>('description');

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? '' : section);
  };

  return (
    <div className="h-full bg-white flex flex-col overflow-hidden">
      <div className="p-6 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{exercise.title}</h1>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                exercise.difficulty === 'easy'
                  ? 'bg-green-100 text-green-700'
                  : exercise.difficulty === 'medium'
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-red-100 text-red-700'
              }`}>
                {exercise.difficulty.charAt(0).toUpperCase() + exercise.difficulty.slice(1)}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                {exercise.language.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          <section>
            <button
              onClick={() => toggleSection('description')}
              className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors font-semibold text-gray-900"
            >
              Description
              <ChevronDown
                className={`w-5 h-5 transition-transform ${
                  expandedSection === 'description' ? 'rotate-180' : ''
                }`}
              />
            </button>
            {expandedSection === 'description' && (
              <div className="mt-3 p-4 bg-gray-50 rounded-lg text-gray-700 whitespace-pre-wrap text-sm leading-relaxed">
                {exercise.description}
              </div>
            )}
          </section>

          {exercise.examples && exercise.examples.length > 0 && (
            <section>
              <button
                onClick={() => toggleSection('examples')}
                className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors font-semibold text-gray-900"
              >
                Examples
                <ChevronDown
                  className={`w-5 h-5 transition-transform ${
                    expandedSection === 'examples' ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {expandedSection === 'examples' && (
                <div className="mt-3 space-y-4">
                  {exercise.examples.map((example, idx) => (
                    <div key={idx} className="p-4 bg-gray-50 rounded-lg">
                      <div className="mb-3">
                        <p className="text-xs font-semibold text-gray-600 mb-1">Input:</p>
                        <pre className="bg-white border border-gray-200 rounded p-2 text-xs font-mono text-gray-700 overflow-x-auto">
                          {example.input}
                        </pre>
                      </div>
                      <div className="mb-3">
                        <p className="text-xs font-semibold text-gray-600 mb-1">Output:</p>
                        <pre className="bg-white border border-gray-200 rounded p-2 text-xs font-mono text-gray-700 overflow-x-auto">
                          {example.output}
                        </pre>
                      </div>
                      {example.explanation && (
                        <div>
                          <p className="text-xs font-semibold text-gray-600 mb-1">Explanation:</p>
                          <p className="text-sm text-gray-700">{example.explanation}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {exercise.constraints && (
            <section>
              <button
                onClick={() => toggleSection('constraints')}
                className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors font-semibold text-gray-900"
              >
                Constraints
                <ChevronDown
                  className={`w-5 h-5 transition-transform ${
                    expandedSection === 'constraints' ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {expandedSection === 'constraints' && (
                <div className="mt-3 p-4 bg-gray-50 rounded-lg text-gray-700 text-sm whitespace-pre-wrap">
                  {exercise.constraints}
                </div>
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
