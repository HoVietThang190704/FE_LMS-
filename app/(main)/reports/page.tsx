import React from 'react';
import { cookies } from 'next/headers';
import ReportsPageClient from './ReportsPageClient';
import { getMyProgressReport } from '@/lib/services/grades.service';
import type { ProgressReport } from '@/lib/types/grades';

const FALLBACK_REPORT: ProgressReport = {
  userId: '',
  streakDays: 0,
  lessonsCompleted: 0,
  exercisesCompleted: '0/0',
  averageScore: 0,
  courseProgress: [],
};

async function loadReportData(token: string | null): Promise<ProgressReport> {
  try {
    return await getMyProgressReport(token);
  } catch (error) {
    console.error('[ReportsPage] Failed to load report data', error);
    return FALLBACK_REPORT;
  }
}

export default async function ReportsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('edu.lms.accessToken')?.value || null;
  const initialData = await loadReportData(token);

  return <ReportsPageClient initialData={initialData} />;
}
