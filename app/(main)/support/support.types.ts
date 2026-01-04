import type { TicketPriority, TicketType } from '@/lib/types/tickets';

export type SupportMetric = {
  label?: string;
  value?: string;
  description?: string;
};

export type SupportQuickLink = {
  title?: string;
  description?: string;
  cta?: string;
};

export type SupportCategory = {
  value: TicketType;
  label: string;
  description?: string;
};

export type SupportPriority = {
  value: TicketPriority;
  label: string;
  description?: string;
};

export type SupportChannel = {
  value: string;
  label: string;
  description?: string;
};

export type SupportTimelineItem = {
  label?: string;
  description?: string;
};

export type InsightItem = {
  title?: string;
  description?: string;
};

export type SupportCopy = {
  hero?: {
    eyebrow?: string;
    title?: string;
    subtitle?: string;
    metrics?: SupportMetric[];
    quickLinks?: SupportQuickLink[];
  };
  form?: {
    title?: string;
    tagline?: string;
    subtitle?: string;
    subjectLabel?: string;
    subjectPlaceholder?: string;
    subjectRequired?: string;
    detailsRequired?: string;
    typeLabel?: string;
    priorityLabel?: string;
    priorityHelper?: string;
    detailsLabel?: string;
    detailsPlaceholder?: string;
    channelLabel?: string;
    attachmentsLabel?: string;
    attachmentPlaceholder?: string;
    attachmentsHint?: string;
    addAttachment?: string;
    shareLabel?: string;
    shareDescription?: string;
    submit?: string;
    submitting?: string;
    successTitle?: string;
    successDescription?: string;
    errorTitle?: string;
    errorDescription?: string;
    referenceLabel?: string;
    categories?: SupportCategory[];
    priorities?: SupportPriority[];
    channels?: SupportChannel[];
  };
  insights?: {
    title?: string;
    items?: InsightItem[];
    timelineTitle?: string;
    timeline?: SupportTimelineItem[];
    commitmentTitle?: string;
    commitmentSubtitle?: string;
    commitmentItems?: InsightItem[];
  };
};

export type FormState = {
  subject: string;
  type: TicketType;
  priority: TicketPriority;
  description: string;
  channel: string;
  attachments: string[];
  shareWithOps: boolean;
};
