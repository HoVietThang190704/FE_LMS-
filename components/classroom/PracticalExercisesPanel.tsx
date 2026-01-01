'use client';

import React, { useState, useEffect } from 'react';
import type { ExerciseProblem } from '@/lib/types/exams';
import { getExerciseProblems } from '@/lib/services/exercises/exam.service';
import { createTranslator } from '@/lib/shared/utils/translator';
import PracticalExerciseEditor from './PracticalExerciseEditor';

interface PracticalExercisesPanelProps {
  courseId: string;
  messages?: Record<string, unknown>;
}

export default function PracticalExercisesPanel({
  courseId,
  messages,
}: PracticalExercisesPanelProps) {
  const [exercises, setExercises] = useState<ExerciseProblem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedExercise, setSelectedExercise] = useState<ExerciseProblem | null>(null);
  const t = createTranslator(messages || {});

  useEffect(() => {
    const loadExercises = async () => {
      setLoading(true);
      try {
        const data = await getExerciseProblems(courseId);
        setExercises(data);
      } catch {
        setExercises([]);
      } finally {
        setLoading(false);
      }
    };
    loadExercises();
  }, [courseId]);

  if (selectedExercise) {
    return (
      <PracticalExerciseEditor
        exercise={selectedExercise}
        onBack={() => setSelectedExercise(null)}
        messages={messages}
      />
    );
  }

  if (loading) {
    return <div className="text-sm text-gray-500">Đang tải...</div>;
  }

  if (!exercises || exercises.length === 0) {
    return <div className="text-sm text-gray-500">Không có bài tập thực hành.</div>;
  }

  return (
    <div className="space-y-3">
      {exercises.map((exercise) => (
        <div
          key={exercise._id}
          className="border border-gray-200 rounded-lg p-4 bg-white hover:border-gray-300 transition-colors cursor-pointer"
          onClick={() => setSelectedExercise(exercise)}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-gray-900 mb-1">{exercise.title}</h4>
              <p className="text-sm text-gray-600 line-clamp-2">
                {exercise.description}
              </p>
              <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
                  Bài {exercise.order}
                </span>
                <span className="text-gray-400">
                  {exercise.testcase?.length || 0} test case
                </span>
              </div>
            </div>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm flex-shrink-0">
              Làm bài
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
