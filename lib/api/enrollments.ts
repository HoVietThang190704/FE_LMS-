import { fetchFromApi } from '@/lib/shared/utils/api';
import type { Course } from './courses';

export type EnrollmentRecord = {
  id?: string;
  courseId: string;
  userId?: string;
  enrolledAt?: string | Date;
  course?: Course;
};

export async function enrollCourse(courseId: string, sectionId?: string): Promise<{ enrollment: EnrollmentRecord; course: Course }> {
  return fetchFromApi('/api/enrollments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ courseId, sectionId }),
  });
}

export async function getMyEnrollments(): Promise<EnrollmentRecord[]> {
  return fetchFromApi('/api/enrollments/me');
}
