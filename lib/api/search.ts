import { buildApiUrl } from '@/lib/shared/utils/api';

export interface CourseSearchResult {
  id: string;
  code: string;
  name: string;
  description?: string;
  tags?: string[];
  instructor?: string;
  image?: string;
  credits?: number;
  enrolled?: number;
  capacity?: number;
  visibility?: string;
  status?: string;
  score?: number;
}

export interface SearchResponse {
  success: boolean;
  data: {
    results: CourseSearchResult[];
    total: number;
    took: number;
  };
  meta?: {
    page: number;
    limit: number;
    totalPages: number;
    query: string;
    elasticsearchAvailable: boolean;
  };
}

export interface SuggestionsResponse {
  success: boolean;
  data: string[];
}

export async function searchCourses(
  query: string,
  page = 1,
  limit = 10
): Promise<SearchResponse> {
  const url = buildApiUrl(
    `/api/search/courses?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`
  );

  try {
    const res = await fetch(url, {
      cache: 'no-store',
      credentials: 'include',
    });

    if (!res.ok) {
      throw new Error(`Search failed (${res.status})`);
    }

    return await res.json();
  } catch (error) {
    console.error('Search error:', error);
    return {
      success: false,
      data: { results: [], total: 0, took: 0 },
    };
  }
}

export async function getSearchSuggestions(
  query: string,
  limit = 5
): Promise<string[]> {
  if (!query.trim()) return [];

  const url = buildApiUrl(
    `/api/search/suggestions?q=${encodeURIComponent(query)}&limit=${limit}`
  );

  try {
    const res = await fetch(url, {
      cache: 'no-store',
      credentials: 'include',
    });

    if (!res.ok) {
      return [];
    }

    const data: SuggestionsResponse = await res.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Suggestions error:', error);
    return [];
  }
}
