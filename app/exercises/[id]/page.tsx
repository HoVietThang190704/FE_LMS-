import { notFound } from 'next/navigation';
import ExercisePage from '@/components/exercises/ExercisePage';
import { getExerciseById } from '@/lib/services/exercises/exercise.service';

interface ExerciseDetailPageProps {
  params: { id: string };
}

export default async function ExerciseDetailPage({ params }: ExerciseDetailPageProps) {
  const { id } = params;
  const exercise = await getExerciseById(id).catch(() => null);

  if (!exercise) {
    notFound();
  }

  return <ExercisePage exercise={exercise} />;
}
