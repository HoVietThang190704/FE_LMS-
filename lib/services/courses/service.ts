import type { Course, CoursesResponse } from '@/lib/api/courses';

const DEFAULT_API_BASE = process.env.NEXT_PUBLIC_API_BASE || '';
const DEFAULT_FALLBACK_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:5000';

export async function getPublicCourses({ page = 1, limit = 50, keyword = '' } = {}): Promise<CoursesResponse> {
  const path = `/api/courses/public?page=${page}&limit=${limit}${keyword ? `&keyword=${encodeURIComponent(keyword)}` : ''}`;
  // Ensure an absolute URL so Node/Edge runtimes can parse it
  const backendUrl = new URL(path, DEFAULT_API_BASE || DEFAULT_FALLBACK_BASE).toString();
  const r = await fetch(backendUrl, { cache: 'no-store' });
  if (!r.ok) throw new Error(`Failed to fetch public courses (${r.status})`);

  const body = await r.json();

  const data: Course[] = (body.data || []).map((c: Record<string, unknown>) => {
    const v = c as Record<string, unknown>;
    const id = (v['_id'] as string) || (v['id'] as string) || String(v['code'] as string || '');
    return {
      id,
      code: (v['code'] as string) || '',
      name: (v['name'] as string) || '',
      description: v['description'] as string | undefined,
      tags: v['tags'] as string[] | undefined,
      status: v['status'] as 'active' | 'archived' | undefined,
      visibility: v['visibility'] as 'public' | 'private' | undefined,
      requireApproval: Boolean(v['requireApproval']),
      credits: v['credits'] as number | undefined,
      instructor: v['instructor'] as string | undefined,
      schedule: v['schedule'] as string | undefined,
      room: v['room'] as string | undefined,
      enrolled: v['enrolled'] as number | undefined,
      capacity: v['capacity'] as number | undefined,
      image: v['image'] as string | undefined,
      startDate: v['startDate'] as string | undefined,
      endDate: v['endDate'] as string | undefined,
      isExpired: (v['isExpired'] as boolean) ?? (v['endDate'] ? new Date(v['endDate'] as string) < new Date() : false),
    } as Course;
  });

  return { data, meta: body.meta };
}

export async function getCourseDetail(id: string): Promise<Course> {
  const path = `/api/courses/${id}`;
  const backendUrl = new URL(path, DEFAULT_API_BASE || DEFAULT_FALLBACK_BASE).toString();
  const r = await fetch(backendUrl, { cache: 'no-store' });
  if (!r.ok) throw new Error(`Failed to fetch course (${r.status})`);

  const body = await r.json();
  const c = body.data as Record<string, unknown>;
  const course: Course = {
    id: (c['_id'] as string) || (c['id'] as string) || String((c['code'] as string) || ''),
    code: (c['code'] as string) || '',
    name: (c['name'] as string) || '',
    description: c['description'] as string | undefined,
    tags: c['tags'] as string[] | undefined,
    status: c['status'] as 'active' | 'archived' | undefined,
    visibility: c['visibility'] as 'public' | 'private' | undefined,
    requireApproval: Boolean(c['requireApproval']),
    credits: c['credits'] as number | undefined,
    instructor: c['instructor'] as string | undefined,
    schedule: c['schedule'] as string | undefined,
    room: c['room'] as string | undefined,
    enrolled: c['enrolled'] as number | undefined,
    capacity: c['capacity'] as number | undefined,
    image: c['image'] as string | undefined,
  };

  return course;
}
