import { notFound } from 'next/navigation';
import ExercisePage from '@/components/exercises/ExercisePage';
import { getExerciseById } from '@/lib/services/exercises/exercise.service';

interface ExerciseDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ExerciseDetailPage({ params }: ExerciseDetailPageProps) {
  const { id } = await params;

  try {
    const exercise = await getExerciseById(id);
    return <ExercisePage exercise={exercise} />;
  } catch (error) {
    notFound();
  }
}
