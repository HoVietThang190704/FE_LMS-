import { login } from '@/lib/infra/api/modules/auth.api';
import { apiHandlerWithReq } from '@/lib/utils/api-utils';
import { NextRequest } from 'next/server';

export const POST = apiHandlerWithReq(async (req: NextRequest) => {
	const body = await req.json();
	return login(body);
});
