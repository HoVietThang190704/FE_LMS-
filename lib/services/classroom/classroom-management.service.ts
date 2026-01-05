import { buildApiUrl } from '@/lib/shared/utils/api';
import { STORAGE_KEYS } from '@/lib/shared/constants/storage';

export interface CourseStudent {
  enrollmentId: string;
  userId: string;
  email: string;
  fullName: string;
  avatarUrl: string | null;
  role: string;
  isActive: boolean;
  status: 'pending' | 'approved' | 'rejected';
  enrolledAt: string;
}

export interface StudentGrade {
  userId: string;
  email: string;
  fullName: string;
  avatarUrl: string | null;
  quizScore: number | null;
  practiceScore: number | null;
  total: number | null;
  grade: string;
  enrolledAt: string;
}

export interface StudentsResponse {
  data: CourseStudent[];
  meta: {
    total: number;
    courseId: string;
    courseName: string;
    courseCode: string;
  };
}

export interface GradesResponse {
  data: StudentGrade[];
  meta: {
    total: number;
    courseId: string;
    courseName: string;
    courseCode: string;
    totalQuizzes: number;
    totalPractices: number;
  };
}

export interface AddStudentResult {
  enrollmentId: string;
  userId: string;
  email: string;
  fullName: string;
  status: string;
}

export interface BulkAddResult {
  success: string[];
  notFound: string[];
  alreadyEnrolled: string[];
  failed: string[];
}

function getAuthHeaders(): HeadersInit {
  const token = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN) : null;
  return {
    'Authorization': token ? `Bearer ${token}` : '',
    'Content-Type': 'application/json'
  };
}

export async function getCourseStudents(courseId: string): Promise<StudentsResponse | null> {
  try {
    const url = buildApiUrl(`/api/classroom-management/${courseId}/students`);
    const res = await fetch(url, {
      headers: getAuthHeaders(),
      cache: 'no-store'
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Failed to fetch students');
    }

    return await res.json();
  } catch (error) {
    console.error('[getCourseStudents] error:', error);
    return null;
  }
}

export async function getCourseGrades(courseId: string): Promise<GradesResponse | null> {
  try {
    const url = buildApiUrl(`/api/classroom-management/${courseId}/grades`);
    const res = await fetch(url, {
      headers: getAuthHeaders(),
      cache: 'no-store'
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Failed to fetch grades');
    }

    return await res.json();
  } catch (error) {
    console.error('[getCourseGrades] error:', error);
    return null;
  }
}


export async function addStudentByEmail(courseId: string, email: string): Promise<{ success: boolean; data?: AddStudentResult; message?: string }> {
  try {
    const url = buildApiUrl(`/api/classroom-management/${courseId}/add-student`);
    const res = await fetch(url, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ email })
    });

    const result = await res.json();

    if (!res.ok) {
      return { success: false, message: result.message || 'Failed to add student' };
    }

    return { success: true, data: result.data };
  } catch (error) {
    console.error('[addStudentByEmail] error:', error);
    return { success: false, message: 'Network error' };
  }
}

export async function addStudentsBulk(courseId: string, emails: string[]): Promise<{ success: boolean; data?: BulkAddResult; message?: string }> {
  try {
    const url = buildApiUrl(`/api/classroom-management/${courseId}/add-students-bulk`);
    const res = await fetch(url, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ emails })
    });

    const result = await res.json();

    if (!res.ok) {
      return { success: false, message: result.message || 'Failed to add students' };
    }

    return { success: true, data: result.data };
  } catch (error) {
    console.error('[addStudentsBulk] error:', error);
    return { success: false, message: 'Network error' };
  }
}

export async function removeStudentFromCourse(courseId: string, userId: string): Promise<{ success: boolean; message?: string }> {
  try {
    const url = buildApiUrl(`/api/classroom-management/${courseId}/remove-student/${userId}`);
    const res = await fetch(url, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    const result = await res.json();

    if (!res.ok) {
      return { success: false, message: result.message || 'Failed to remove student' };
    }

    return { success: true, message: result.message };
  } catch (error) {
    console.error('[removeStudentFromCourse] error:', error);
    return { success: false, message: 'Network error' };
  }
}


export function parseEmailsFromText(text: string): string[] {
  const parts = text.split(/[\n,;\t]+/);
  const emails: string[] = [];

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  for (const part of parts) {
    const trimmed = part.trim().toLowerCase();
    if (trimmed && emailRegex.test(trimmed)) {
      emails.push(trimmed);
    }
  }

  return [...new Set(emails)]; 
}
