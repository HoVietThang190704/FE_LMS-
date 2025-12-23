import { getPublicCourses } from '@/lib/services/courses/service';
import { apiHandlerWithReq } from '@/lib/utils/api-utils';
import { API_QUERY_PARAMS } from '@/lib/shared/constants/endpoints';
import type { NextRequest } from 'next/server';

export const GET = apiHandlerWithReq(async (req: NextRequest) => {
  // Use req.nextUrl which is available in Next.js Request on the server and contains parsed search params
  const keyword = req.nextUrl.searchParams.get(API_QUERY_PARAMS.KEYWORD) || '';
  const page = Number(req.nextUrl.searchParams.get(API_QUERY_PARAMS.PAGE) || '1');
  const limit = Number(req.nextUrl.searchParams.get(API_QUERY_PARAMS.LIMIT) || '50');

  const res = await getPublicCourses({ page, limit, keyword });
  return res;
});
