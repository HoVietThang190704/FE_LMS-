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
};

export type CoursesResponse = {
  data: Course[];
  meta?: { total: number; page: number; limit: number; totalPages: number };
};

const DEFAULT_API_BASE = process.env.NEXT_PUBLIC_API_BASE || '';

export async function getCourses({ page = 1, limit = 50, keyword = '' } = {}): Promise<CoursesResponse> {
  const url = `${DEFAULT_API_BASE}/api/courses?page=${page}&limit=${limit}${keyword ? `&keyword=${encodeURIComponent(keyword)}` : ''}`;

  try {
    const res = await fetch(url, { cache: 'no-store', credentials: 'include' });
    if (!res.ok) throw new Error(`Failed to fetch courses (${res.status})`);

    const body = await res.json();

    // Backend uses { data, meta }
    type RawCourse = { _id?: string; id?: string; code?: string; name?: string; description?: string; tags?: string[]; status?: 'active' | 'archived' };
    return {
      data: (body.data || []).map((c: RawCourse) => ({
        id: c._id || c.id || String(c.code || ''),
        code: c.code || '',
        name: c.name || '',
        description: c.description,
        tags: c.tags,
        status: c.status,
      })),

      meta: body.meta,
    };
  } catch (err) {
    // Fallback to empty list on error — caller can decide to use local mocks if desired
    console.warn('[getCourses] fetch failed, returning empty array', err);
    return { data: [] };
  }
}
