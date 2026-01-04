import { buildApiUrl } from '@/lib/shared/utils/api';
import { STORAGE_KEYS } from '@/lib/shared/constants/storage';
import type { ClassroomLesson, ClassroomResource, ClassroomResourceType } from '@/lib/types/classroom';

export type LessonResourcePayload = {
  name: string;
  type: ClassroomResourceType;
  url: string;
  size?: number;
  mimeType?: string;
};

export type CreateLessonPayload = {
  title: string;
  description?: string;
  week: number;
  order?: number;
  durationMinutes?: number;
  resources?: LessonResourcePayload[];
  isPublished?: boolean;
};

export type LessonRecord = {
  _id: string;
  courseId: string;
  title: string;
  description?: string;
  week: number;
  order: number;
  durationMinutes?: number;
  resources?: LessonResourcePayload[];
  isPublished?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

const getAuthHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN) : null;
  return {
    Authorization: token ? `Bearer ${token}` : '',
    'Content-Type': 'application/json',
  } as Record<string, string>;
};

export const mapRecordToLesson = (record: LessonRecord): ClassroomLesson => ({
  id: record._id,
  title: record.title,
  description: record.description,
  week: record.week,
  order: record.order ?? 0,
  durationMinutes: record.durationMinutes,
  isPublished: record.isPublished ?? true,
  resources: (record.resources || []).map((res) => ({
    ...res,
    lessonId: record._id,
    lessonTitle: record.title,
    week: record.week,
  } as ClassroomResource)),
});

export async function getLessonsByCourse(courseId: string): Promise<ClassroomLesson[]> {
  try {
    const url = buildApiUrl(`/api/classroom/${courseId}/lessons`);
    const res = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
      cache: 'no-store',
    });

    if (!res.ok) return [];

    const body = await res.json();
    const data: LessonRecord[] = body.data || [];

    return data.map(mapRecordToLesson).sort((a, b) => (a.week - b.week) || (a.order - b.order));
  } catch (error) {
    console.error('[getLessonsByCourse] error:', error);
    return [];
  }
}

export async function getLessonById(courseId: string, lessonId: string): Promise<ClassroomLesson | null> {
  try {
    const lessons = await getLessonsByCourse(courseId);
    return lessons.find((l) => l.id === lessonId) || null;
  } catch (error) {
    console.error('[getLessonById] error:', error);
    return null;
  }
}

export async function createLesson(courseId: string, payload: CreateLessonPayload): Promise<ClassroomLesson> {
  const url = buildApiUrl(`/api/classroom/${courseId}/lessons`);
  const res = await fetch(url, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  const body = await res.json().catch(() => null);
  if (!res.ok) {
    const detail = Array.isArray(body?.errors)
      ? body.errors.map((e: { message?: string }) => e?.message).filter(Boolean).join('; ')
      : undefined;
    throw new Error(detail || body?.message || 'Không thể tạo bài học');
  }

  const record: LessonRecord = body.data;
  return mapRecordToLesson(record);
}

export async function updateLesson(
  courseId: string,
  lessonId: string,
  payload: Partial<CreateLessonPayload>
): Promise<ClassroomLesson> {
  const url = buildApiUrl(`/api/classroom/${courseId}/lessons/${lessonId}`);
  const res = await fetch(url, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  const body = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(body?.message || 'Không thể cập nhật bài học');
  }

  const record: LessonRecord = body.data;
  return mapRecordToLesson(record);
}

export async function deleteLesson(courseId: string, lessonId: string): Promise<boolean> {
  const url = buildApiUrl(`/api/classroom/${courseId}/lessons/${lessonId}`);
  const res = await fetch(url, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message || 'Không thể xóa bài học');
  }

  return true;
}
