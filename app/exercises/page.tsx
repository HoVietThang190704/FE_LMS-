import Link from 'next/link';
import { ROUTES } from '@/lib/shared/constants/routeres';

export default function ExercisesPage() {
  const sampleExercises = [
    {
      id: '1',
      title: 'Sum of Two Numbers',
      difficulty: 'easy',
      language: 'python',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Code Exercises</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleExercises.map((exercise) => (
            <Link
              key={exercise.id}
              href={`/exercises/${exercise.id}`}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{exercise.title}</h2>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  exercise.difficulty === 'easy'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {exercise.difficulty}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                  {exercise.language}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
