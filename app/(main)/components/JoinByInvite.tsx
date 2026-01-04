"use client";

import { useState } from 'react';
import Popup from '@/components/ui/Popup';
import { enrollCourseByInvitation } from '@/lib/api/enrollments';
import { useT } from '@/lib/shared/i18n';

export type JoinByInviteProps = {
  buttonLabel?: string;
  title?: string;
  description?: string;
  inputPlaceholder?: string;
  submitLabel?: string;
  cancelLabel?: string;
};

const deriveErrorMessage = (error: unknown, fallback: string) => {
  if (!error) return fallback;
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === 'string') return error;
  return fallback;
};

export default function JoinByInvite({
  buttonLabel,
  title,
  description,
  inputPlaceholder,
  submitLabel,
  cancelLabel
}: JoinByInviteProps) {
  const { t } = useT();
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const resetState = () => {
    setCode('');
    setMessage(null);
    setErrorMessage(null);
    setLoading(false);
  };

  const handleSubmit = async () => {
    if (!code.trim()) {
      setErrorMessage(buttonLabel ?? title ?? t('joinByInvite.messages.missingCode'));
      return;
    }
    setLoading(true);
    setErrorMessage(null);
    setMessage(null);
    try {
      const result = await enrollCourseByInvitation(code.trim());
      const status = result.enrollment?.status;
      if (status === 'pending') {
        setMessage(t('joinByInvite.messages.pendingApproval'));
      } else {
        setMessage(t('joinByInvite.messages.success'));
      }
    } catch (error) {
      setErrorMessage(deriveErrorMessage(error, t('joinByInvite.messages.failure')));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-lg bg-black px-4 py-2 -mt-3 sm:font-semibold text-white shadow-sm hover:bg-slate-800"
      >
        { t('joinByInvite.buttonLabel')}
      </button>

      <Popup
        open={open}
        onClose={() => {
          setOpen(false);
          resetState();
        }}
        title={title}
        size="sm"
        headerDivider
      >
        <div className="space-y-3">
          <p className="text-sm text-slate-600">{description ?? t('joinByInvite.description')}</p>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder={inputPlaceholder ?? t('joinByInvite.placeholder')}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
            disabled={loading}
          />
          {errorMessage ? <p className="text-xs text-rose-600">{errorMessage}</p> : null}
          {message ? <p className="text-xs text-emerald-600">{message}</p> : null}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              resetState();
            }}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            disabled={loading}
          >
            {cancelLabel ?? t('joinByInvite.cancel')}
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-60"
            disabled={loading}
          >
            {loading ? t('joinByInvite.messages.processing') : (submitLabel ?? t('joinByInvite.submit'))}
          </button>
        </div>
      </Popup>
    </>
  );
}
