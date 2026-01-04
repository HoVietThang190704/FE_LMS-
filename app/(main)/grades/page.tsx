import React from 'react';
import { cookies } from 'next/headers';
import GradesPageClient from './GradesPageClient';
import { getMyGrades } from '@/lib/services/grades.service';
import type { GradeSummary } from '@/lib/types/grades';

const FALLBACK_GRADES: GradeSummary = {
  userId: '',
  totalCredits: 0,
  earnedCredits: 0,
  gpa: 0,
  courses: [],
};

async function loadGradesData(token: string | null): Promise<GradeSummary> {
  try {
    return await getMyGrades(token);
  } catch (error) {
    console.error('[GradesPage] Failed to load grades data', error);
    return FALLBACK_GRADES;
  }
}

export default async function GradesPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('edu.lms.accessToken')?.value || null;
  const initialData = await loadGradesData(token);

  return <GradesPageClient initialData={initialData} />;
}
