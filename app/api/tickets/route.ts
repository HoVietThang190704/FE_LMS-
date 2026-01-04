import { NextRequest } from 'next/server';

import { apiHandlerWithReq } from '@/lib/utils/api-utils';
import { backendFetch } from '@/lib/infra/api/httpClient';
import { EXTERNAL_API_ENDPOINTS } from '@/lib/shared/constants/endpoint';

const buildHeaders = (token?: string) => {
  const headers = new Headers();
  headers.set('Content-Type', 'application/json');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  return headers;
};

export const POST = apiHandlerWithReq(async (req: NextRequest) => {
  const token = req.cookies.get('edu.lms.accessToken')?.value;
  const payload = await req.json();
  const headers = buildHeaders(token);

  const { data } = await backendFetch(EXTERNAL_API_ENDPOINTS.TICKET.LIST, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
    parseJson: true,
  });

  return data ?? { success: true };
});
