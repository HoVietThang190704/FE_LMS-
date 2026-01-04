import type { ApiResponse } from '@/lib/shared/utils/api';
import type { CreateTicketPayload, Ticket } from '@/lib/types/tickets';

const buildDescription = (details: string, channel?: string, tags?: string[]) => {
  const normalized = (details || '').trim();
  const meta: string[] = [];
  if (channel) {
    meta.push(`Preferred channel: ${channel}`);
  }
  if (tags && tags.length) {
    meta.push(`Tags: ${tags.join(', ')}`);
  }
  return meta.length ? `${normalized}\n\n${meta.join('\n')}` : normalized;
};

export type SubmitTicketInput = CreateTicketPayload & {
  channel?: string;
};

export const createTicket = async (payload: SubmitTicketInput): Promise<Ticket> => {
  const { channel, ...rest } = payload;
  const body: CreateTicketPayload = {
    ...rest,
    description: buildDescription(rest.description, channel, rest.tags),
  };

  const response = await fetch('/api/tickets', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(body),
  });

  const data = (await response.json().catch(() => null)) as ApiResponse<Ticket> | null;

  if (!response.ok || !data?.success || !data.data) {
    const message = data?.message || 'Không thể gửi yêu cầu hỗ trợ.';
    throw new Error(message);
  }

  return data.data;
};
