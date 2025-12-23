const DEFAULT_API_BASE = process.env.NEXT_PUBLIC_API_BASE || '';
const DEFAULT_FALLBACK_BASE =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  'http://localhost:5000';

const BASE_URL = DEFAULT_API_BASE || DEFAULT_FALLBACK_BASE;

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  meta?: Record<string, unknown>;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public payload?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function buildApiUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }
  return new URL(path, BASE_URL).toString();
}

export async function fetchFromApi<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = buildApiUrl(path);
  const init: RequestInit = {
    cache: 'no-store',
    credentials: 'include',
    ...options,
  };

  const response = await fetch(url, init);

  const contentType = response.headers.get('content-type') || '';
  const body = contentType.includes('application/json')
    ? ((await response.json()) as ApiResponse<T>)
    : null;

  if (!response.ok) {
    const message = body?.message || `Request failed with status ${response.status}`;
    throw new ApiError(message, response.status, body);
  }

  if (!body) {
    throw new ApiError('API response is not JSON', response.status, null);
  }

  if (!body.success) {
    throw new ApiError(body.message || 'API reported failure', response.status, body);
  }

  return body.data as T;
}
