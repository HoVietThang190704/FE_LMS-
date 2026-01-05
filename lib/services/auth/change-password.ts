import { INTERNAL_API_ENDPOINTS } from '@/lib/shared/constants/endpoint';
import { STORAGE_KEYS } from '@/lib/shared/constants/storage';
import type { ApiResponse } from '@/lib/shared/utils/api';

export type ChangePasswordInput = {
  currentPassword: string;
  newPassword: string;
};

export const changePassword = async (payload: ChangePasswordInput) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN) : null;

  if (!token) {
    throw new Error('Bạn cần đăng nhập để cập nhật mật khẩu.');
  }

  const response = await fetch(INTERNAL_API_ENDPOINTS.AUTH.CHANGE_PASSWORD, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      oldPassword: payload.currentPassword,
      newPassword: payload.newPassword
    }),
    credentials: 'include'
  });

  let data: ApiResponse | null = null;
  try {
    data = (await response.json()) as ApiResponse;
  } catch {
    // ignore non JSON responses
  }

  if (!response.ok || (data && data.success === false)) {
    const message = data?.message || 'Không thể đổi mật khẩu.';
    throw new Error(message);
  }

  return data?.data ?? null;
};
