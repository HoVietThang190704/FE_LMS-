'use client';

import Link from 'next/link';
import { type FormEvent } from 'react';
import { ShieldCheck, Lock, KeyRound, CheckCircle2, HelpCircle } from 'lucide-react';

import type { StoredUser } from '@/app/hooks/useCurrentUser';
import { ROUTES } from '@/lib/shared/constants/routeres';
import type {
  ChangePasswordCopy,
  FormState,
  SettingsHeroCopy,
  SettingsTipsCopy,
  ValidationError
} from './change-password.types';

const strengthColor = (score: number) => {
  if (score >= 80) return 'bg-emerald-500';
  if (score >= 50) return 'bg-amber-400';
  return 'bg-rose-500';
};

const strengthLabel = (score: number, copy?: ChangePasswordCopy) => {
  if (score >= 80) return copy?.strength?.strong ?? 'Strong';
  if (score >= 50) return copy?.strength?.medium ?? 'Fair';
  return copy?.strength?.weak ?? 'Weak';
};

const LoadingState = () => (
  <div className="min-h-screen bg-slate-50 flex items-center justify-center">
    <div className="h-12 w-12 rounded-full border-2 border-indigo-200 border-t-transparent animate-spin" />
  </div>
);

type ChangePasswordViewProps = {
  heroCopy: SettingsHeroCopy;
  formCopy: ChangePasswordCopy;
  tipsCopy: SettingsTipsCopy;
  signInCta?: string;
  hydrated: boolean;
  user: StoredUser | null;
  form: FormState;
  errors: ValidationError;
  isSubmitting: boolean;
  passwordScore: number;
  onFieldChange: (field: keyof FormState, value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  lastUpdatedDisplay: string;
};

const ChangePasswordView = ({
  heroCopy,
  formCopy,
  tipsCopy,
  signInCta,
  hydrated,
  user,
  form,
  errors,
  isSubmitting,
  passwordScore,
  onFieldChange,
  onSubmit,
  lastUpdatedDisplay
}: ChangePasswordViewProps) => {
  if (!hydrated) {
    return <LoadingState />;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="max-w-xl w-full rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
            <Lock size={22} />
          </div>
          <h1 className="text-2xl font-semibold text-slate-900 mb-3">{heroCopy.title}</h1>
          <p className="text-slate-600 mb-6">{heroCopy.subtitle}</p>
          <Link
            href={ROUTES.LOGIN}
            className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-6 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-500"
          >
            {signInCta || 'Sign in to continue'}
          </Link>
        </div>
      </div>
    );
  }

  const clampedScore = Math.max(0, Math.min(passwordScore, 100));
  const activeDevicesTitle = heroCopy.activeDevicesTitle ?? 'Active devices';
  const activeDevicesHelper = heroCopy.activeDevicesHelper ?? 'Synced across browser sessions';

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="relative isolate overflow-hidden border-b border-white/10 bg-gradient-to-br from-indigo-950 via-slate-950 to-slate-900 text-white">
        <div className="absolute inset-y-0 right-0 w-1/2 opacity-30 blur-3xl" aria-hidden="true">
          <div className="h-full w-full bg-[radial-gradient(circle_at_top,_rgba(129,140,248,0.4),_transparent_60%)]" />
        </div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="flex flex-col gap-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-sm font-medium text-indigo-100 w-fit">
              <ShieldCheck size={16} />
              {heroCopy.badge}
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white mb-3">{heroCopy.title}</h1>
              <p className="text-base sm:text-lg text-indigo-100 max-w-3xl">{heroCopy.subtitle}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-indigo-100">{heroCopy.lastUpdatedLabel}</p>
                <p className="text-xl font-semibold text-white mt-1">{lastUpdatedDisplay}</p>
                <p className="text-xs text-indigo-200 mt-2">{heroCopy.statusPill}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-indigo-100">{activeDevicesTitle}</p>
                <p className="text-xl font-semibold text-white mt-1">1</p>
                <p className="text-xs text-indigo-200 mt-2">{activeDevicesHelper}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <form onSubmit={onSubmit} className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm backdrop-blur">
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                <KeyRound size={14} />
                {formCopy.title}
              </div>
              <h2 className="mt-4 text-2xl font-semibold text-slate-900">{formCopy.title}</h2>
              <p className="mt-1 text-sm text-slate-600">{formCopy.description}</p>
            </div>

            <div className="space-y-5">
              <div>
                <label htmlFor="currentPassword" className="text-sm font-medium text-slate-700">
                  {formCopy.currentPasswordLabel}
                </label>
                <input
                  id="currentPassword"
                  type="password"
                  autoComplete="current-password"
                  value={form.currentPassword}
                  onChange={(event) => onFieldChange('currentPassword', event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                  placeholder="••••••••"
                />
                {errors.currentPassword && (
                  <p className="mt-2 text-xs text-rose-600">{errors.currentPassword}</p>
                )}
              </div>

              <div>
                <label htmlFor="newPassword" className="text-sm font-medium text-slate-700">
                  {formCopy.newPasswordLabel}
                </label>
                <input
                  id="newPassword"
                  type="password"
                  autoComplete="new-password"
                  value={form.newPassword}
                  onChange={(event) => onFieldChange('newPassword', event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                  placeholder="••••••••"
                />
                {errors.newPassword && (
                  <p className="mt-2 text-xs text-rose-600">{errors.newPassword}</p>
                )}

                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs font-medium text-slate-500">
                    <span>{formCopy.strengthLabel}</span>
                    <span className="text-slate-700">{strengthLabel(passwordScore, formCopy)}</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-slate-100">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${strengthColor(passwordScore)}`}
                      style={{ width: `${clampedScore}%` }}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="text-sm font-medium text-slate-700">
                  {formCopy.confirmPasswordLabel}
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  value={form.confirmPassword}
                  onChange={(event) => onFieldChange('confirmPassword', event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                  placeholder="••••••••"
                />
                {errors.confirmPassword && (
                  <p className="mt-2 text-xs text-rose-600">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                {(formCopy.requirements ?? []).map((rule) => (
                  <span key={rule} className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1">
                    <CheckCircle2 size={14} className="text-emerald-500" />
                    {rule}
                  </span>
                ))}
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-indigo-500 disabled:pointer-events-none disabled:opacity-70"
              >
                {isSubmitting ? formCopy.submitting ?? 'Updating...' : formCopy.submit ?? 'Update password'}
              </button>
            </div>
          </form>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm backdrop-blur">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                <ShieldCheck size={18} className="text-emerald-500" />
                {tipsCopy.title}
              </div>
              <p className="mt-2 text-sm text-slate-600">{tipsCopy.subtitle}</p>
              <ul className="mt-4 space-y-3 text-sm text-slate-700">
                {(tipsCopy.items ?? []).map((tip) => (
                  <li key={tip} className="flex gap-3 rounded-2xl bg-slate-50 px-3 py-2">
                    <span className="mt-0.5 text-slate-400">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={ROUTES.SUPPORT}
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-500"
              >
                <HelpCircle size={16} />
                {tipsCopy.supportCta}
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordView;
