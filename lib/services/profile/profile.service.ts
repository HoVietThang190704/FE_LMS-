import { buildApiUrl } from '@/lib/shared/utils/api';
import type { User, QuizExercise, PracticeExercise, QuizSubmission, PracticeSubmission } from '@/lib/types/profile';
import { STORAGE_KEYS } from '@/lib/shared/constants/storage';


export async function getMyProfile(): Promise<User | null> {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN) : null;
    const url = buildApiUrl('/api/users/me/profile');
    
    const res = await fetch(url, {
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    });

    if (!res.ok) return null;

    const body = await res.json();
    const data = body.data || body;

    return {
      id: data._id || data.id,
      email: data.email,
      fullName: data.fullName,
      role: data.role,
      profile: data.profile,
      isActive: data.isActive,
      isVerified: data.isVerified,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    };
  } catch (error) {
    console.error('[getMyProfile] error:', error);
    return null;
  }
}


export interface TeacherCourse {
  id: string;
  code: string;
  name: string;
  description?: string;
  image?: string;
  status?: 'active' | 'archived';
  instructor?: string;
  enrolled?: number;
  capacity?: number;
  createdAt?: string;
}

export async function getMyCreatedCourses(): Promise<TeacherCourse[]> {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN) : null;
    const url = buildApiUrl('/api/courses?limit=100');
    
    const res = await fetch(url, {
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    });

    if (!res.ok) return [];

    const body = await res.json();
    const courses = body.data || [];

    return courses.map((c: Record<string, unknown>) => ({
      id: (c._id || c.id) as string,
      code: c.code as string,
      name: c.name as string,
      description: c.description as string | undefined,
      image: c.image as string | undefined,
      status: c.status as 'active' | 'archived' | undefined,
      instructor: c.instructor as string | undefined,
      enrolled: c.enrolled as number | undefined,
      capacity: c.capacity as number | undefined,
      createdAt: c.createdAt as string | undefined
    }));
  } catch (error) {
    console.error('[getMyCreatedCourses] error:', error);
    return [];
  }
}

export interface EnrolledCourse {
  id: string;
  courseId: string;
  status: 'pending' | 'approved' | 'rejected';
  enrolledAt?: string;
  course: {
    id: string;
    code: string;
    name: string;
    description?: string;
    image?: string;
    instructor?: string;
    isEnrolled: boolean;
  };
}

export async function getMyEnrolledCourses(): Promise<EnrolledCourse[]> {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN) : null;
    const url = buildApiUrl('/api/enrollments/me');
    
    const res = await fetch(url, {
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    });

    if (!res.ok) return [];

    const body = await res.json();
    const data = body.data || [];

    return data.map((item: Record<string, unknown>) => ({
      id: (item._id || item.id) as string,
      courseId: item.courseId as string,
      status: item.status as string,
      enrolledAt: item.enrolledAt as string | undefined,
      course: item.course as EnrolledCourse['course']
    }));
  } catch (error) {
    console.error('[getMyEnrolledCourses] error:', error);
    return [];
  }
}

export async function getQuizzesByCourse(courseId: string): Promise<QuizExercise[]> {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN) : null;
    const url = buildApiUrl(`/api/quiz-exercises?courseId=${courseId}`);
    
    const res = await fetch(url, {
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    });

    if (!res.ok) return [];

    const body = await res.json();
    const data = body.data || [];

    return data.map((q: Record<string, unknown>) => ({
      id: (q._id || q.id) as string,
      courseId: (q.courseId && typeof q.courseId === 'object' ? (q.courseId as Record<string, unknown>)._id : q.courseId) as string,
      courseName: (q.courseId && typeof q.courseId === 'object' ? (q.courseId as Record<string, unknown>).name : undefined) as string | undefined,
      courseCode: (q.courseId && typeof q.courseId === 'object' ? (q.courseId as Record<string, unknown>).code : undefined) as string | undefined,
      title: q.title as string,
      description: q.description as string | undefined,
      order: q.order as number,
      questions: q.questions as QuizExercise['questions'],
      timeLimit: q.timeLimit as number | undefined,
      passingScore: q.passingScore as number,
      allowRetake: q.allowRetake as boolean,
      maxAttempts: q.maxAttempts as number | undefined,
      shuffleQuestions: q.shuffleQuestions as boolean,
      shuffleOptions: q.shuffleOptions as boolean,
      showResultsImmediately: q.showResultsImmediately as boolean,
      createdAt: q.createdAt as string | undefined,
      updatedAt: q.updatedAt as string | undefined
    }));
  } catch (error) {
    console.error('[getQuizzesByCourse] error:', error);
    return [];
  }
}

export async function getQuizForStudent(quizId: string): Promise<QuizExercise | null> {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN) : null;
    const url = buildApiUrl(`/api/quiz-exercises/${quizId}/student`);
    
    const res = await fetch(url, {
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    });

    if (!res.ok) return null;

    const body = await res.json();
    const q = body.data;

    return {
      id: (q._id || q.id) as string,
      courseId: q.courseId as string,
      title: q.title as string,
      description: q.description,
      order: q.order,
      questions: q.questions,
      timeLimit: q.timeLimit,
      passingScore: q.passingScore,
      allowRetake: q.allowRetake,
      maxAttempts: q.maxAttempts,
      shuffleQuestions: q.shuffleQuestions,
      shuffleOptions: q.shuffleOptions,
      showResultsImmediately: true
    };
  } catch (error) {
    console.error('[getQuizForStudent] error:', error);
    return null;
  }
}

export async function submitQuiz(
  quizId: string, 
  answers: Array<{ questionId: string; selectedOptionId: string }>,
  startedAt: Date
): Promise<QuizSubmission | null> {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN) : null;
    const url = buildApiUrl(`/api/quiz-exercises/${quizId}/submit`);
    
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ answers, startedAt: startedAt.toISOString() })
    });

    if (!res.ok) return null;

    const body = await res.json();
    return body.data;
  } catch (error) {
    console.error('[submitQuiz] error:', error);
    return null;
  }
}

export async function getMyQuizSubmissions(quizId: string): Promise<QuizSubmission[]> {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN) : null;
    const url = buildApiUrl(`/api/quiz-exercises/${quizId}/my-submissions`);
    
    const res = await fetch(url, {
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    });

    if (!res.ok) return [];

    const body = await res.json();
    return body.data || [];
  } catch (error) {
    console.error('[getMyQuizSubmissions] error:', error);
    return [];
  }
}

export async function getPracticesByCourse(courseId: string): Promise<PracticeExercise[]> {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN) : null;
    const url = buildApiUrl(`/api/practice-exercises?courseId=${courseId}`);
    
    const res = await fetch(url, {
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    });

    if (!res.ok) return [];

    const body = await res.json();
    const data = body.data || [];

    return data.map((p: Record<string, unknown>) => ({
      id: (p._id || p.id) as string,
      courseId: (p.courseId && typeof p.courseId === 'object' ? (p.courseId as Record<string, unknown>)._id : p.courseId) as string,
      courseName: (p.courseId && typeof p.courseId === 'object' ? (p.courseId as Record<string, unknown>).name : undefined) as string | undefined,
      courseCode: (p.courseId && typeof p.courseId === 'object' ? (p.courseId as Record<string, unknown>).code : undefined) as string | undefined,
      title: p.title as string,
      description: p.description as string,
      order: p.order as number,
      difficulty: p.difficulty as PracticeExercise['difficulty'],
      language: p.language as string,
      templateCode: p.templateCode as string,
      testCases: p.testCases as PracticeExercise['testCases'],
      constraints: p.constraints as string | undefined,
      hints: p.hints as string[] | undefined,
      sampleInput: p.sampleInput as string | undefined,
      sampleOutput: p.sampleOutput as string | undefined,
      timeLimit: p.timeLimit as number,
      memoryLimit: p.memoryLimit as number,
      createdAt: p.createdAt as string | undefined,
      updatedAt: p.updatedAt as string | undefined
    }));
  } catch (error) {
    console.error('[getPracticesByCourse] error:', error);
    return [];
  }
}

export async function getPracticeForStudent(practiceId: string): Promise<PracticeExercise | null> {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN) : null;
    const url = buildApiUrl(`/api/practice-exercises/${practiceId}/student`);
    
    const res = await fetch(url, {
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    });

    if (!res.ok) return null;

    const body = await res.json();
    const p = body.data;

    return {
      id: (p._id || p.id) as string,
      courseId: p.courseId as string,
      title: p.title as string,
      description: p.description as string,
      order: p.order as number,
      difficulty: p.difficulty as PracticeExercise['difficulty'],
      language: p.language as string,
      templateCode: p.templateCode as string,
      testCases: p.testCases as PracticeExercise['testCases'],
      constraints: p.constraints,
      hints: p.hints,
      sampleInput: p.sampleInput,
      sampleOutput: p.sampleOutput,
      timeLimit: p.timeLimit,
      memoryLimit: p.memoryLimit
    };
  } catch (error) {
    console.error('[getPracticeForStudent] error:', error);
    return null;
  }
}

export async function submitPractice(
  practiceId: string,
  code: string,
  language: string
): Promise<PracticeSubmission | null> {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN) : null;
    const url = buildApiUrl(`/api/practice-exercises/${practiceId}/submit`);
    
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ code, language })
    });

    const body = await res.json();
    
    if (!res.ok) {
      console.error('[submitPractice] API error:', body);
      throw new Error(body.message || 'Failed to submit practice');
    }

    return body.data;
  } catch (error) {
    console.error('[submitPractice] error:', error);
    throw error;
  }
}

export async function getMyPracticeSubmissions(practiceId: string): Promise<PracticeSubmission[]> {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN) : null;
    const url = buildApiUrl(`/api/practice-exercises/${practiceId}/my-submissions`);
    
    const res = await fetch(url, {
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    });

    if (!res.ok) return [];

    const body = await res.json();
    return body.data || [];
  } catch (error) {
    console.error('[getMyPracticeSubmissions] error:', error);
    return [];
  }
}

export async function getMyBestPracticeSubmission(practiceId: string): Promise<PracticeSubmission | null> {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN) : null;
    const url = buildApiUrl(`/api/practice-exercises/${practiceId}/my-best`);
    
    const res = await fetch(url, {
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    });

    if (!res.ok) return null;

    const body = await res.json();
    return body.data || null;
  } catch (error) {
    console.error('[getMyBestPracticeSubmission] error:', error);
    return null;
  }
}

export async function createQuiz(data: Partial<QuizExercise>): Promise<QuizExercise | null> {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN) : null;
    const url = buildApiUrl('/api/quiz-exercises');
    
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to create quiz');
    }

    const body = await res.json();
    return body.data;
  } catch (error) {
    console.error('[createQuiz] error:', error);
    throw error;
  }
}

export async function updateQuiz(quizId: string, data: Partial<QuizExercise>): Promise<QuizExercise | null> {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN) : null;
    const url = buildApiUrl(`/api/quiz-exercises/${quizId}`);
    
    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to update quiz');
    }

    const body = await res.json();
    return body.data;
  } catch (error) {
    console.error('[updateQuiz] error:', error);
    throw error;
  }
}

export async function deleteQuiz(quizId: string): Promise<boolean> {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN) : null;
    const url = buildApiUrl(`/api/quiz-exercises/${quizId}`);
    
    const res = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': token ? `Bearer ${token}` : ''
      }
    });

    return res.ok;
  } catch (error) {
    console.error('[deleteQuiz] error:', error);
    return false;
  }
}

export async function createPractice(data: Partial<PracticeExercise>): Promise<PracticeExercise | null> {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN) : null;
    const url = buildApiUrl('/api/practice-exercises');
    
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to create practice');
    }

    const body = await res.json();
    return body.data;
  } catch (error) {
    console.error('[createPractice] error:', error);
    throw error;
  }
}

export async function updatePractice(practiceId: string, data: Partial<PracticeExercise>): Promise<PracticeExercise | null> {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN) : null;
    const url = buildApiUrl(`/api/practice-exercises/${practiceId}`);
    
    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to update practice');
    }

    const body = await res.json();
    return body.data;
  } catch (error) {
    console.error('[updatePractice] error:', error);
    throw error;
  }
}

export async function deletePractice(practiceId: string): Promise<boolean> {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN) : null;
    const url = buildApiUrl(`/api/practice-exercises/${practiceId}`);
    
    const res = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': token ? `Bearer ${token}` : ''
      }
    });

    return res.ok;
  } catch (error) {
    console.error('[deletePractice] error:', error);
    return false;
  }
}
