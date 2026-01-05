import { backendFetch } from '@/lib/infra/api/httpClient';
import { EXTERNAL_API_ENDPOINTS } from '@/lib/shared/constants/endpoint';

export type LoginPayload = {
  email: string;
  password: string;
  rememberMe?: boolean;
};

export type RegisterPayload = {
  email: string;
  password: string;
  userName?: string;
  phone?: string;
};

export type ChangePasswordPayload = {
  oldPassword: string;
  newPassword: string;
};

const forwardJson = async <TBody extends Record<string, unknown>, TResult = unknown>(
  url: string,
  payload: TBody,
  options?: { headers?: Record<string, string> }
): Promise<TResult> => {
  const { data } = await backendFetch(url, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers ?? {})
    },
    parseJson: true
  });

  return data as TResult;
};

export const login = (payload: LoginPayload) => forwardJson(EXTERNAL_API_ENDPOINTS.AUTH.LOGIN, payload);

export const register = (payload: RegisterPayload) => forwardJson(EXTERNAL_API_ENDPOINTS.AUTH.REGISTER, payload);

export const changePassword = (payload: ChangePasswordPayload, token?: string) =>
  forwardJson(EXTERNAL_API_ENDPOINTS.AUTH.CHANGE_PASSWORD, payload, token
    ? { headers: { Authorization: token } }
    : undefined);
