export type TicketType = 'support' | 'bug' | 'feature' | 'question' | 'refund' | 'other';
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TicketStatus = 'open' | 'in_progress' | 'on_hold' | 'resolved' | 'closed' | 'rejected';

export type TicketAttachment = {
  url: string;
  filename?: string;
  mimeType?: string;
  size?: number;
};

export type Ticket = {
  id: string;
  ticketNumber?: string | null;
  title: string;
  description?: string;
  type: TicketType;
  priority: TicketPriority;
  status: TicketStatus;
  createdBy?: string;
  createdByName?: string | null;
  assignedTo?: string | null;
  assignedToName?: string | null;
  relatedOrderId?: string | null;
  relatedShopId?: string | null;
  attachments?: TicketAttachment[];
  tags?: string[];
  resolutionMessage?: string | null;
  isPublic?: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateTicketPayload = {
  title: string;
  description: string;
  type: TicketType;
  priority: TicketPriority;
  isPublic?: boolean;
  relatedOrderId?: string;
  relatedShopId?: string;
  attachments?: TicketAttachment[];
  tags?: string[];
};
