import type { NextRequest } from 'next/server';

import { changePassword, type ChangePasswordPayload } from '@/lib/infra/api/modules/auth.api';
import { apiHandlerWithReq } from '@/lib/utils/api-utils';
import { ApiError } from '@/lib/shared/utils/api';
import { HttpStatusCode } from '@/lib/shared/constants/http';

const isValidPayload = (payload: unknown): payload is ChangePasswordPayload => {
  if (!payload || typeof payload !== 'object') return false;
  const value = payload as Record<string, unknown>;
  return typeof value.oldPassword === 'string' && typeof value.newPassword === 'string';
};

export const POST = apiHandlerWithReq(async (req: NextRequest) => {
  const body = await req.json();

  if (!isValidPayload(body)) {
    throw new ApiError('Invalid payload', HttpStatusCode.BAD_REQUEST);
  }

  const authHeader = req.headers.get('authorization');
  if (!authHeader) {
    throw new ApiError('Unauthorized', HttpStatusCode.UNAUTHORIZED);
  }

  return changePassword(body, authHeader);
});
