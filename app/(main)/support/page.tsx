'use client';

import type { FormEvent } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { getMessages, DEFAULT_LOCALE, type SupportedLocale } from '@/app/i18n';
import { createTicket } from '@/lib/services/tickets';
import type { TicketAttachment } from '@/lib/types/tickets';
import { detectBrowserLocale } from '@/lib/shared/i18n';

import { SupportPageClient } from './support-page.client';
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

type SubmissionStatus = 'idle' | 'success' | 'error';

export default function SupportPage() {
  const [locale, setLocale] = useState<SupportedLocale>(DEFAULT_LOCALE);

  useEffect(() => {
    setLocale(detectBrowserLocale());
  }, []);

  const messages = useMemo(() => getMessages(locale) as Record<string, unknown>, [locale]);
  const copy = useMemo(() => (messages['supportCenter'] as SupportCopy) || {}, [messages]);

  const categories = useMemo(() => copy.form?.categories ?? [], [copy]);
  const priorities = useMemo(() => copy.form?.priorities ?? [], [copy]);
  const channels = useMemo(() => copy.form?.channels ?? [], [copy]);

  const heroMetrics = copy.hero?.metrics ?? [];
  const quickLinks = copy.hero?.quickLinks ?? [];
  const insightItems = copy.insights?.items ?? [];
  const timeline = copy.insights?.timeline ?? [];
  const commitmentItems = copy.insights?.commitmentItems ?? [];

  const initialFormState = useMemo<FormState>(() => ({
    subject: '',
    type: categories[0]?.value ?? 'support',
    priority: priorities[1]?.value ?? priorities[0]?.value ?? 'medium',
    description: '',
    channel: channels[0]?.value ?? 'in-app',
    attachments: [''],
    shareWithOps: true,
  }), [categories, priorities, channels]);

  const [formState, setFormState] = useState<FormState>(initialFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<SubmissionStatus>('idle');
  const [statusMessage, setStatusMessage] = useState(copy.form?.successDescription ?? '');
  const [lastTicketCode, setLastTicketCode] = useState<string | null>(null);

  useEffect(() => {
    setFormState(initialFormState);
    setErrors({});
  }, [initialFormState]);

  useEffect(() => {
    setStatusMessage(copy.form?.successDescription ?? '');
  }, [copy]);

  const selectedCategory = useMemo(() => categories.find((item) => item.value === formState.type), [categories, formState.type]);
  const selectedPriority = useMemo(() => priorities.find((item) => item.value === formState.priority), [priorities, formState.priority]);
  const selectedChannel = useMemo(() => channels.find((item) => item.value === formState.channel), [channels, formState.channel]);

  const handleFieldChange = useCallback((field: keyof FormState, value: string | boolean) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const handleAttachmentChange = useCallback((value: string, index: number) => {
    setFormState((prev) => {
      const next = [...prev.attachments];
      next[index] = value;
      return { ...prev, attachments: next };
    });
  }, []);

  const addAttachmentInput = useCallback(() => {
    setFormState((prev) => ({
      ...prev,
      attachments: [...prev.attachments, ''],
    }));
  }, []);

  const toggleShareVisibility = useCallback(() => {
    setFormState((prev) => ({
      ...prev,
      shareWithOps: !prev.shareWithOps,
    }));
  }, []);

  const resetForm = () => {
    setFormState(initialFormState);
    setErrors({});
  };

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!formState.subject.trim()) {
      nextErrors.subject = copy.form?.subjectRequired ?? '';
    }
    if (!formState.description.trim()) {
      nextErrors.description = copy.form?.detailsRequired ?? copy.form?.subjectRequired ?? '';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    setStatus('idle');
    setStatusMessage('');

    try {
      const attachments: TicketAttachment[] = formState.attachments
        .map((url) => url.trim())
        .filter(Boolean)
        .map((url) => ({ url }));

      const ticket = await createTicket({
        title: formState.subject.trim(),
        description: formState.description.trim(),
        type: formState.type,
        priority: formState.priority,
        isPublic: formState.shareWithOps,
        attachments,
        tags: selectedCategory?.label ? [selectedCategory.label] : undefined,
        channel: selectedChannel?.label,
      });

      setLastTicketCode(ticket.ticketNumber || ticket.id);
      setStatus('success');
      setStatusMessage(copy.form?.successDescription ?? '');
      resetForm();
    } catch (error) {
      setStatus('error');
      setStatusMessage(error instanceof Error ? error.message : copy.form?.errorDescription ?? '');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SupportPageClient
      copy={copy}
      formState={formState}
      errors={errors}
      isSubmitting={isSubmitting}
      status={status}
      statusMessage={statusMessage}
      lastTicketCode={lastTicketCode}
      heroMetrics={heroMetrics}
      quickLinks={quickLinks}
      categories={categories}
      priorities={priorities}
      channels={channels}
      insightItems={insightItems}
      timeline={timeline}
      commitmentItems={commitmentItems}
      selectedCategory={selectedCategory}
      selectedPriority={selectedPriority}
      selectedChannel={selectedChannel}
      onFieldChange={handleFieldChange}
      onAttachmentChange={handleAttachmentChange}
      onAddAttachment={addAttachmentInput}
      onToggleShare={toggleShareVisibility}
      onSubmit={handleSubmit}
    />
  );
}
