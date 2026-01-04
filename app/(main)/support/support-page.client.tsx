"use client";

import type { FormEvent } from 'react';
import { ArrowUpRight, CheckCircle2, Clock, HelpCircle, Paperclip, Plus, Shield, Sparkles } from 'lucide-react';

import type {
  FormState,
  InsightItem,
  SupportCategory,
  SupportChannel,
  SupportCopy,
  SupportMetric,
  SupportPriority,
  SupportQuickLink,
  SupportTimelineItem,
} from './support.types';

type SupportPageClientProps = {
  copy: SupportCopy;
  formState: FormState;
  errors: Record<string, string>;
  isSubmitting: boolean;
  status: 'idle' | 'success' | 'error';
  statusMessage: string;
  lastTicketCode: string | null;
  heroMetrics: SupportMetric[];
  quickLinks: SupportQuickLink[];
  categories: SupportCategory[];
  priorities: SupportPriority[];
  channels: SupportChannel[];
  insightItems: InsightItem[];
  timeline: SupportTimelineItem[];
  commitmentItems: InsightItem[];
  selectedCategory?: SupportCategory;
  selectedPriority?: SupportPriority;
  selectedChannel?: SupportChannel;
  onFieldChange: (field: keyof FormState, value: string | boolean) => void;
  onAttachmentChange: (value: string, index: number) => void;
  onAddAttachment: () => void;
  onToggleShare: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export function SupportPageClient({
  copy,
  formState,
  errors,
  isSubmitting,
  status,
  statusMessage,
  lastTicketCode,
  heroMetrics,
  quickLinks,
  categories,
  priorities,
  channels,
  insightItems,
  timeline,
  commitmentItems,
  selectedCategory,
  selectedPriority,
  selectedChannel,
  onFieldChange,
  onAttachmentChange,
  onAddAttachment,
  onToggleShare,
  onSubmit,
}: SupportPageClientProps) {
  return (
    <div className="space-y-10 px-4 py-8 sm:px-6 lg:px-10">
      <section className="relative overflow-hidden rounded-4xl bg-gradient-to-br from-slate-900 via-slate-900 to-blue-900 px-6 py-10 text-white shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.25),_transparent_55%)]" aria-hidden />
        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.4em] text-white/60">{copy.hero?.eyebrow ?? ''}</p>
            <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">{copy.hero?.title ?? ''}</h1>
            <p className="text-base text-white/80">{copy.hero?.subtitle ?? ''}</p>
            <div className="flex flex-wrap gap-3">
              {quickLinks.map((link, index) => (
                <div key={link.title ?? `quick-link-${index}`} className="group flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/90">
                  <span className="font-medium">{link.title ?? ''}</span>
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </div>
              ))}
            </div>
          </div>
          <div className="grid flex-1 gap-4 rounded-3xl bg-white/10 p-4 text-sm lg:grid-cols-3">
            {heroMetrics.map((metric, index) => (
              <div key={metric.label ?? `metric-${index}`} className="rounded-2xl border border-white/20 bg-white/10 p-4">
                <p className="text-xs uppercase tracking-[0.35em] text-white/60">{metric.label ?? ''}</p>
                <p className="mt-2 text-2xl font-semibold text-white">{metric.value ?? ''}</p>
                <p className="mt-1 text-white/70">{metric.description ?? ''}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-[1.8fr_1fr]">
        <form onSubmit={onSubmit} className="space-y-6 rounded-4xl border border-slate-100 bg-white/90 p-6 shadow-xl">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-slate-400">{copy.form?.tagline ?? ''}</p>
            <h2 className="text-2xl font-semibold text-slate-900">{copy.form?.title ?? ''}</h2>
          </div>

          {status !== 'idle' ? (
            <div className={`rounded-3xl border px-4 py-3 text-sm ${status === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-rose-200 bg-rose-50 text-rose-800'}`}>
              <p className="font-semibold">{status === 'success' ? copy.form?.successTitle ?? '' : copy.form?.errorTitle ?? ''}</p>
              <p className="text-slate-600">{statusMessage}</p>
              {lastTicketCode ? (
                <p className="text-xs text-slate-500">
                  {copy.form?.referenceLabel ? `${copy.form.referenceLabel}: ` : ''}
                  {lastTicketCode}
                </p>
              ) : null}
            </div>
          ) : null}

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">{copy.form?.subjectLabel ?? ''}</label>
            <input
              type="text"
              className={`h-12 w-full rounded-2xl border px-4 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/30 ${errors.subject ? 'border-rose-300' : 'border-slate-200'}`}
              placeholder={copy.form?.subjectPlaceholder ?? ''}
              value={formState.subject}
              onChange={(event) => onFieldChange('subject', event.target.value)}
            />
            {errors.subject ? <p className="text-xs text-rose-500">{errors.subject}</p> : null}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">{copy.form?.typeLabel ?? ''}</label>
              <select
                className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/30"
                value={formState.type}
                onChange={(event) => onFieldChange('type', event.target.value)}
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-slate-500">{selectedCategory?.description ?? ''}</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">{copy.form?.priorityLabel ?? ''}</label>
              <select
                className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/30"
                value={formState.priority}
                onChange={(event) => onFieldChange('priority', event.target.value)}
              >
                {priorities.map((priority) => (
                  <option key={priority.value} value={priority.value}>
                    {priority.label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-slate-500">{selectedPriority?.description ?? copy.form?.priorityHelper ?? ''}</p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">{copy.form?.detailsLabel ?? ''}</label>
            <textarea
              className={`min-h-[140px] w-full rounded-3xl border px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/20 ${errors.description ? 'border-rose-300' : 'border-slate-200'}`}
              placeholder={copy.form?.detailsPlaceholder ?? ''}
              value={formState.description}
              onChange={(event) => onFieldChange('description', event.target.value)}
            />
            {errors.description ? <p className="text-xs text-rose-500">{errors.description}</p> : null}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">{copy.form?.channelLabel ?? ''}</label>
              <select
                className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/30"
                value={formState.channel}
                onChange={(event) => onFieldChange('channel', event.target.value)}
              >
                {channels.map((channel) => (
                  <option key={channel.value} value={channel.value}>
                    {channel.label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-slate-500">{selectedChannel?.description ?? ''}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">{copy.form?.attachmentsLabel ?? ''}</label>
              {formState.attachments.map((value, index) => (
                <input
                  key={`attachment-${index}`}
                  type="url"
                  className="mb-2 h-11 w-full rounded-2xl border border-slate-200 px-3 text-sm"
                  placeholder={copy.form?.attachmentPlaceholder ?? ''}
                  value={value}
                  onChange={(event) => onAttachmentChange(event.target.value, index)}
                />
              ))}
              <button type="button" onClick={onAddAttachment} className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <Plus className="h-4 w-4" />
                {copy.form?.addAttachment ?? ''}
              </button>
              <p className="text-xs text-slate-400">{copy.form?.attachmentsHint ?? ''}</p>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-3xl border border-slate-200 px-4 py-3">
            <div>
              <p className="text-sm font-medium text-slate-900">{copy.form?.shareLabel ?? ''}</p>
              <p className="text-xs text-slate-500">{copy.form?.shareDescription ?? ''}</p>
            </div>
            <button
              type="button"
              onClick={onToggleShare}
              className={`relative h-7 w-12 rounded-full transition ${formState.shareWithOps ? 'bg-blue-600' : 'bg-slate-300'}`}
              aria-pressed={formState.shareWithOps}
            >
              <span
                className={`absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-white transition ${formState.shareWithOps ? 'right-1' : 'left-1'}`}
              />
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Shield className="h-4 w-4" />
              {copy.hero?.eyebrow ?? ''}
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-3xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-slate-800 disabled:opacity-60"
            >
              <Sparkles className="h-4 w-4" />
              {isSubmitting ? copy.form?.submitting ?? '' : copy.form?.submit ?? ''}
            </button>
          </div>
        </form>

        <aside className="space-y-6">
          <div className="space-y-4 rounded-4xl border border-slate-100 bg-white/90 p-6 shadow-md">
            <div className="flex items-center gap-3">
              <HelpCircle className="h-5 w-5 text-blue-600" />
              <p className="text-sm font-semibold text-slate-900">{copy.insights?.title ?? ''}</p>
            </div>
            <ul className="space-y-3 text-sm text-slate-600">
              {insightItems.map((item, index) => (
                <li key={item.title ?? `insight-${index}`} className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-500" />
                  <div>
                    <p className="font-medium text-slate-900">{item.title ?? ''}</p>
                    <p className="text-slate-500">{item.description ?? ''}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4 rounded-4xl border border-slate-100 bg-white/90 p-6 shadow-md">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-amber-500" />
              <p className="text-sm font-semibold text-slate-900">{copy.insights?.timelineTitle ?? ''}</p>
            </div>
            <ol className="space-y-3 text-sm text-slate-600">
              {timeline.map((item, index) => (
                <li key={`${item.label}-${index}`} className="flex gap-3">
                  <span className="mt-0.5 text-xs font-semibold text-slate-400">{String(index + 1).padStart(2, '0')}</span>
                  <div>
                    <p className="font-medium text-slate-900">{item.label ?? ''}</p>
                    <p className="text-slate-500">{item.description ?? ''}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-4xl border border-slate-100 bg-slate-900 p-6 text-white shadow-xl">
            <p className="text-xs uppercase tracking-[0.35em] text-white/60">{copy.insights?.commitmentTitle ?? ''}</p>
            <h3 className="mt-2 text-xl font-semibold">{copy.insights?.commitmentSubtitle ?? ''}</h3>
            <ul className="mt-4 space-y-4 text-sm text-white/80">
              {commitmentItems.map((item, index) => (
                <li key={item.title ?? `commitment-${index}`} className="flex gap-3">
                  <Paperclip className="h-4 w-4 text-white/70" />
                  <div>
                    <p className="font-medium text-white">{item.title ?? ''}</p>
                    <p className="text-white/70">{item.description ?? ''}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
