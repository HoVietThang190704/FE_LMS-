import { fetchFromApi, buildApiUrl } from '@/lib/shared/utils/api';

export type SyllabusItem = { title: string; description?: string };

export type Course = {
  id: string;
  code: string;
  name: string;
  description?: string;
  tags?: string[];
  status?: 'active' | 'archived';
  credits?: number;
  instructor?: string;
  schedule?: string;
  room?: string;
  enrolled?: number;
  capacity?: number;
  image?: string;
  syllabus?: SyllabusItem[];
};

export type CoursesResponse = {
  data: Course[];
  meta?: { total: number; page: number; limit: number; totalPages: number };
};

export async function getCourses({ page = 1, limit = 50, keyword = '' } = {}): Promise<CoursesResponse> {
  const url = buildApiUrl(`/api/courses/public?page=${page}&limit=${limit}${keyword ? `&keyword=${encodeURIComponent(keyword)}` : ''}`);

  try {
    const res = await fetch(url, { cache: 'no-store', credentials: 'include' });
    if (!res.ok) throw new Error(`Failed to fetch courses (${res.status})`);

    const body = await res.json();

    // Backend uses { data, meta }
    type RawCourse = { _id?: string; id?: string; code?: string; name?: string; description?: string; tags?: string[]; status?: 'active' | 'archived'; image?: string; createdAt?: string; updatedAt?: string };
    return {
      data: (body.data || []).map((c: RawCourse) => ({
        id: c._id || c.id || String(c.code || ''),
        code: c.code || '',
        name: c.name || '',
        description: c.description,
        tags: c.tags,
        status: c.status,
        image: c.image,
      })),

      meta: body.meta,
    };
  } catch (err) {
    // Fallback to empty list on error — caller can decide to use local mocks if desired
    console.warn('[getCourses] fetch failed, returning empty array', err);
    return { data: [] };
  }
}

export async function getPublicCourseById(id: string): Promise<Course | null> {
  try {
    const response = await fetchFromApi<{ _id?: string; id?: string; code?: string; name?: string; description?: string; tags?: string[]; status?: 'active' | 'archived'; image?: string; createdAt?: string; updatedAt?: string }>(`/api/courses/public/${id}`);
    const c = response;

    return {
      id: c._id || c.id || String(c.code || ''),
      code: c.code || '',
      name: c.name || '',
      description: c.description,
      tags: c.tags,
      status: c.status,
      image: c.image,
      credits: c.credits,
      instructor: c.instructor,
      schedule: c.schedule,
      room: c.room,
      enrolled: c.enrolled,
      capacity: c.capacity,
      syllabus: c.syllabus,
    };
  } catch (err) {
    console.warn('[getPublicCourseById] fetch failed', err);
    return null;
  }
}
