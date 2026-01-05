'use client';

import { useEffect, useMemo, useState, type FormEvent } from 'react';

import { changePassword } from '@/lib/services/auth/change-password';
import { useToast } from '@/app/hooks/useToast';
import { useCurrentUser } from '@/app/hooks/useCurrentUser';
import { detectBrowserLocale } from '@/lib/shared/i18n';
import { DEFAULT_LOCALE, getMessages, type SupportedLocale } from '@/app/i18n';

import ChangePasswordView from './ChangePasswordView';
import type { FormState, SettingsCopy, ValidationError } from './change-password.types';

const FALLBACK_COPY: SettingsCopy = {
  hero: {
    badge: 'Security center',
    title: 'Protect your account',
    subtitle: 'Rotate your password regularly to keep assignments, grades, and feedback secure.',
    statusPill: 'Realtime session guard',
    lastUpdatedLabel: 'Last updated',
    neverUpdated: 'Not updated yet',
    activeDevicesTitle: 'Active devices',
    activeDevicesHelper: 'Synced across browser sessions'
  },
  changePassword: {
    title: 'Change password',
    description: 'Use a strong password with at least 8 characters, mixing letters, numbers, and special symbols.',
    currentPasswordLabel: 'Current password',
    newPasswordLabel: 'New password',
    confirmPasswordLabel: 'Confirm new password',
    requirements: [
      'At least 8 characters',
      'Include a number or symbol',
      'Avoid recently used passwords'
    ],
    strengthLabel: 'Password strength',
    strength: {
      weak: 'Weak',
      medium: 'Fair',
      strong: 'Strong'
    },
    submit: 'Update password',
    submitting: 'Updating...'
  },
  tips: {
    title: 'Security reminders',
    subtitle: 'Small habits make a big difference.',
    items: [
      'Enable two-factor authentication when available.',
      'Never reuse passwords across learning spaces.',
      'Sign out after using shared computers.'
    ],
    supportCta: 'Need help regaining access?'
  },
  signInCta: 'Sign in to continue'
};

const computeStrengthScore = (value: string) => {
  if (!value) return 0;
  let score = 0;
  if (value.length >= 8) score += 35;
  if (/[A-Z]/.test(value)) score += 15;
  if (/[0-9]/.test(value)) score += 25;
  if (/[^A-Za-z0-9]/.test(value)) score += 25;
  if (value.length >= 14) score += 10;
  return Math.min(score, 100);
};

export default function ChangePasswordPage() {
  const toast = useToast();
  const { user } = useCurrentUser();
  const [hydrated, setHydrated] = useState(false);
  const [locale, setLocale] = useState<SupportedLocale>(DEFAULT_LOCALE);
  const [form, setForm] = useState<FormState>({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [errors, setErrors] = useState<ValidationError>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<Date | null>(null);

  useEffect(() => {
    setHydrated(true);
    setLocale(detectBrowserLocale());
  }, []);

  const messages = useMemo(() => getMessages(locale) as Record<string, unknown>, [locale]);
  const copy = useMemo(() => (messages.settingsPage as SettingsCopy) ?? FALLBACK_COPY, [messages]);

  const formCopy = copy.changePassword ?? FALLBACK_COPY.changePassword!;
  const tipsCopy = copy.tips ?? FALLBACK_COPY.tips!;
  const heroCopy = copy.hero ?? FALLBACK_COPY.hero!;
  const signInCta = copy.signInCta ?? FALLBACK_COPY.signInCta;

  const passwordScore = useMemo(() => computeStrengthScore(form.newPassword), [form.newPassword]);

  const onChangeField = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validate = (): boolean => {
    const nextErrors: ValidationError = {};
    if (!form.currentPassword.trim()) {
      nextErrors.currentPassword = formCopy.errors?.currentRequired ?? 'Enter your current password.';
    }
    if (!form.newPassword.trim()) {
      nextErrors.newPassword = formCopy.errors?.newRequired ?? 'Enter a new password.';
    }
    if (form.newPassword && form.newPassword === form.currentPassword) {
      nextErrors.newPassword = formCopy.errors?.samePassword ?? 'New password must be different.';
    }
    if (form.confirmPassword.trim() !== form.newPassword.trim()) {
      nextErrors.confirmPassword = formCopy.errors?.mismatch ?? 'Confirmation does not match.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await changePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword
      });
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setErrors({});
      setLastUpdatedAt(new Date());
      toast.success(formCopy.success ?? 'Password updated successfully.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : formCopy.error ?? 'Unable to update password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatLastUpdated = () => {
    if (!lastUpdatedAt) {
      return heroCopy.neverUpdated ?? 'Not updated yet';
    }
    return lastUpdatedAt.toLocaleString(locale === 'vi' ? 'vi-VN' : 'en-US', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  };

  return (
    <ChangePasswordView
      heroCopy={heroCopy}
      formCopy={formCopy}
      tipsCopy={tipsCopy}
      signInCta={signInCta}
      hydrated={hydrated}
      user={user}
      form={form}
      errors={errors}
      isSubmitting={isSubmitting}
      passwordScore={passwordScore}
      onFieldChange={onChangeField}
      onSubmit={handleSubmit}
      lastUpdatedDisplay={formatLastUpdated()}
    />
  );
}
