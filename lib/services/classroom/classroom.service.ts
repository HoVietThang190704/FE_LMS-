import { fetchFromApi } from '@/lib/shared/utils/api';
import type { ClassroomData, ClassroomLesson, ClassroomResource, ProgressDetails } from '@/lib/types/classroom';

export interface GetClassroomOptions {
  token?: string | null;
}

export async function getClassroom(courseId: string, options?: GetClassroomOptions): Promise<ClassroomData | null> {
  try {
    type LessonPayload = {
      _id: string;
      title: string;
      description?: string;
      week: number;
      order: number;
      durationMinutes?: number;
      resources?: Array<{
        name: string;
        type: 'link' | 'file';
        url: string;
        size?: number;
        mimeType?: string;
      }>;
      isPublished?: boolean;
    };

    type ResourcePayload = ClassroomResource;

    type ApiResponse = {
      course: ClassroomData['course'];
      lessons: LessonPayload[];
      resources: ResourcePayload[];
      progress?: number;
      progressDetails?: ProgressDetails;
    };

    const data = await fetchFromApi<ApiResponse>(`/api/classroom/${courseId}`, {
      token: options?.token
    });

    const lessons: ClassroomLesson[] = (data.lessons || []).map((lesson) => ({
      id: lesson._id,
      title: lesson.title,
      description: lesson.description,
      week: lesson.week,
      order: lesson.order ?? 0,
      durationMinutes: lesson.durationMinutes,
      resources: (lesson.resources || []).map((resource) => ({
        ...resource,
        lessonId: lesson._id,
        lessonTitle: lesson.title,
        week: lesson.week,
      })),
      isPublished: lesson.isPublished ?? true,
    }));

    const resources: ClassroomResource[] = (data.resources || []).map((r) => ({
      ...r,
      lessonId: r.lessonId,
      lessonTitle: r.lessonTitle,
      week: r.week,
    }));

    return {
      course: data.course,
      lessons,
      resources,
      progress: data.progress,
      progressDetails: data.progressDetails,
    };
  } catch (error) {
    console.warn('[getClassroom] failed to load classroom', error);
    return null;
  }
}
