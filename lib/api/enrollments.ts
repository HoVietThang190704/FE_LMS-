import { fetchFromApi } from '@/lib/shared/utils/api';
import { STORAGE_KEYS } from '@/lib/shared/constants/storage';
import type { Course } from './courses';

export type EnrollmentRecord = {
  id?: string;
  courseId: string;
  userId?: string;
  status?: 'pending' | 'approved' | 'rejected';
  enrolledAt?: string | Date;
  course?: Course;
};

export async function enrollCourse(courseId: string, sectionId?: string): Promise<{ enrollment: EnrollmentRecord; course: Course }> {
  const token = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN) : null;

  return fetchFromApi('/api/enrollments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ courseId, sectionId }),
  });
}

export async function enrollCourseByInvitation(invitationCode: string, sectionId?: string): Promise<{ enrollment: EnrollmentRecord; course: Course }> {
  const token = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN) : null;

  return fetchFromApi('/api/enrollments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ invitationCode, sectionId }),
  });
}

export async function getMyEnrollments(): Promise<EnrollmentRecord[]> {
  return fetchFromApi('/api/enrollments/me');
}
