import { fetchFromApi } from '@/lib/shared/utils/api';
import { GradeSummary, ProgressReport } from '@/lib/types/grades';

export async function getMyGrades(token?: string | null): Promise<GradeSummary> {
  return fetchFromApi<GradeSummary>('/api/grades', { token });
}

export async function getMyProgressReport(token?: string | null): Promise<ProgressReport> {
  return fetchFromApi<ProgressReport>('/api/reports/progress', { token });
}
