"use client";

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import LoginView, {
  type AuthCopy,
  type AuthFormValues,
  type AuthMode,
  type AuthStatus
} from './login';
import { ROUTES } from '@/lib/shared/constants/routeres';
import { INTERNAL_API_ENDPOINTS } from '@/lib/shared/constants/endpoint';
import { DEFAULT_LOCALE, getMessages } from '@/app/i18n';
import { STORAGE_KEYS, AUTH_SESSION_EVENT } from '@/lib/shared/constants/storage';
import type { StoredUser } from '@/app/hooks/useCurrentUser';
const authCopy = getMessages(DEFAULT_LOCALE).auth as AuthCopy;

const demoCredentials = {
  email: process.env.NEXT_PUBLIC_DEMO_EMAIL ?? 'any@email.com',
  password: process.env.NEXT_PUBLIC_DEMO_PASSWORD ?? 'anypassword'
};

type LoginResponsePayload = {
  success: boolean;
  message?: string;
  user?: StoredUser;
  accessToken?: string;
  refreshToken?: string;
};

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>('login');
  const [values, setValues] = useState<AuthFormValues>({
    email: '',
    password: '',
    rememberMe: false
  });
  const [status, setStatus] = useState<AuthStatus>({ isSubmitting: false });

  const persistSession = useCallback((payload: LoginResponsePayload | null) => {
    if (typeof window === 'undefined' || !payload) return;

    if (payload.accessToken) {
      window.localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, payload.accessToken);
      document.cookie = `edu.lms.accessToken=${payload.accessToken}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
    }

    if (payload.refreshToken) {
      window.localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, payload.refreshToken);
    }

    if (payload.user) {
      window.localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(payload.user));
    }

    window.dispatchEvent(new Event(AUTH_SESSION_EVENT));
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const storedEmail = window.localStorage.getItem('edu.lms.rememberedEmail');
    if (storedEmail) {
      setValues((prev) => ({ ...prev, email: storedEmail, rememberMe: true }));
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (values.rememberMe) {
      window.localStorage.setItem('edu.lms.rememberedEmail', values.email);
    } else {
      window.localStorage.removeItem('edu.lms.rememberedEmail');
    }
  }, [values.email, values.rememberMe]);

  const handleFieldChange = useCallback((field: keyof AuthFormValues, value: string | boolean) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleModeChange = useCallback(
    (nextMode: AuthMode) => {
      if (nextMode === 'register') {
        router.push(ROUTES.REGISTER);
        return;
      }
      setMode(nextMode);
    },
    [router]
  );

  const handleSubmit = useCallback(async () => {
    const trimmedEmail = values.email.trim();
    if (!trimmedEmail || !values.password.trim()) {
      setStatus({ isSubmitting: false, error: 'Vui lòng nhập đầy đủ thông tin đăng nhập.' });
      return;
    }

    setStatus({ isSubmitting: true });
    try {
      const response = await fetch(INTERNAL_API_ENDPOINTS.AUTH.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: trimmedEmail,
          password: values.password,
          rememberMe: values.rememberMe
        })
      });

      const payload = (await response.json().catch(() => null)) as LoginResponsePayload | null;
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message ?? 'Đăng nhập thất bại, vui lòng thử lại.');
      }

      persistSession(payload);
      setStatus({ isSubmitting: false, success: authCopy.status.success });
      router.push(ROUTES.HOME);
    } catch (error) {
      setStatus({
        isSubmitting: false,
        error: error instanceof Error ? error.message : 'Đăng nhập thất bại, vui lòng thử lại.'
      });
    }
  }, [values, router, persistSession]);

  const handleForgotPassword = useCallback(() => {
    router.push(ROUTES.FORGOT_PASSWORD);
  }, [router]);

  const handleFillDemo = useCallback(() => {
    setValues({ email: demoCredentials.email, password: demoCredentials.password, rememberMe: true });
  }, []);

  const handleSupport = useCallback(() => {
    router.push(ROUTES.SUPPORT);
  }, [router]);

  return (
    <LoginView
      mode={mode}
      content={authCopy}
      values={values}
      status={status}
      demoCredentials={demoCredentials}
      onModeChange={handleModeChange}
      onChange={handleFieldChange}
      onSubmit={handleSubmit}
      onForgotPassword={handleForgotPassword}
      onFillDemo={handleFillDemo}
      onSupport={handleSupport}
    />
  );
}
