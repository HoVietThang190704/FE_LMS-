'use client';

import { FormEvent, KeyboardEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { io, type Socket } from 'socket.io-client';
import { AlertTriangle, Loader2, MessageCircle, Send, X } from 'lucide-react';

import { useCurrentUser } from '@/app/hooks/useCurrentUser';

const SOCKET_BASE_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE ||
  'http://localhost:5000';

const SOCKET_PATH = process.env.NEXT_PUBLIC_SOCKET_PATH || '/socket.io';

type SupportChatSender = 'user' | 'admin' | 'system';

type SupportChatMessage = {
  id: string;
  userId: string;
  senderRole: SupportChatSender;
  senderId?: string | null;
  senderName?: string | null;
  content: string;
  createdAt: string;
  clientMessageId?: string;
  pending?: boolean;
  error?: boolean;
};

type SupportChatAck = {
  success?: boolean;
  error?: string;
  messageId?: string;
  clientMessageId?: string;
};

const formatTime = (value: string): string => {
  try {
    return new Intl.DateTimeFormat('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit'
    }).format(new Date(value));
  } catch {
    return value;
  }
};

const buildClientMessageId = () => `client-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export function SupportChatWidget() {
  const { user, displayName } = useCurrentUser();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<SupportChatMessage[]>([]);
  const [draft, setDraft] = useState('');
  const [status, setStatus] = useState<'idle' | 'connecting' | 'online' | 'error'>('idle');
  const [unreadCount, setUnreadCount] = useState(0);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const messageEndRef = useRef<HTMLDivElement | null>(null);

  const socketUrl = useMemo(() => SOCKET_BASE_URL.replace(/\/$/, ''), []);

  const disconnectSocket = useCallback(() => {
    if (socketRef.current) {
      try {
        if (user?.id) {
          socketRef.current.emit('support-chat:leave', { userId: user.id });
        }
        socketRef.current.disconnect();
      } finally {
        socketRef.current = null;
      }
    }
  }, [user?.id]);

  const handleIncomingMessage = useCallback(
    (incoming: SupportChatMessage) => {
      if (!user || incoming.userId !== user.id) {
        return;
      }
      setMessages((prev) => {
        if (incoming.clientMessageId) {
          const existingIndex = prev.findIndex((msg) => msg.clientMessageId === incoming.clientMessageId);
          if (existingIndex !== -1) {
            const updated = [...prev];
            updated[existingIndex] = { ...incoming, pending: false, error: false };
            return updated;
          }
        }
        return [...prev, { ...incoming, pending: false, error: false }];
      });
      if (!isOpen) {
        setUnreadCount((count) => Math.min(count + 1, 99));
      }
    },
    [isOpen, user]
  );

  useEffect(() => {
    if (!user) {
      disconnectSocket();
      setMessages([]);
      setUnreadCount(0);
      setStatus('idle');
      setConnectionError(null);
      return;
    }

    setStatus('connecting');
    setConnectionError(null);

    const socket = io(socketUrl, {
      path: SOCKET_PATH,
      transports: ['websocket'],
      withCredentials: true
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setStatus('online');
      setConnectionError(null);
      socket.emit('support-chat:join', { userId: user.id });
    });

    socket.on('connect_error', (error) => {
      setStatus('error');
      setConnectionError(error?.message || 'Không thể kết nối tới máy chủ hỗ trợ.');
    });

    socket.on('support-chat:message', handleIncomingMessage);

    socket.on('disconnect', () => {
      setStatus('idle');
    });

    return () => {
      socket.emit('support-chat:leave', { userId: user.id });
      socket.off('support-chat:message', handleIncomingMessage);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [disconnectSocket, handleIncomingMessage, socketUrl, user]);

  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleSend = useCallback(
    (event?: FormEvent) => {
      event?.preventDefault();
      if (!user || !socketRef.current || status !== 'online') {
        return;
      }

      const content = draft.trim();
      if (!content) {
        return;
      }

      const clientMessageId = buildClientMessageId();
      const optimisticMessage: SupportChatMessage = {
        id: clientMessageId,
        clientMessageId,
        userId: user.id,
        senderRole: 'user',
        senderId: user.id,
        senderName: displayName,
        content,
        createdAt: new Date().toISOString(),
        pending: true
      };

      setMessages((prev) => [...prev, optimisticMessage]);
      setDraft('');

      socketRef.current.emit(
        'support-chat:send-message',
        {
          userId: user.id,
          content,
          senderId: user.id,
          senderName: displayName,
          senderRole: 'user',
          clientMessageId
        },
        (ack?: SupportChatAck) => {
          if (ack && ack.success === false) {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.clientMessageId === clientMessageId
                  ? { ...msg, pending: false, error: true }
                  : msg
              )
            );
            setConnectionError(ack.error || 'Không gửi được tin nhắn. Vui lòng thử lại.');
          }
        }
      );
    },
    [displayName, draft, status, user]
  );

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {isOpen && (
        <div className="w-[320px] sm:w-[380px] rounded-2xl border border-slate-200 bg-white shadow-2xl">
          <div className="flex items-center justify-between bg-slate-900 px-4 py-3 text-white">
            <div>
              <p className="text-sm font-semibold">Hỗ trợ trực tuyến</p>
              <p className="text-xs text-slate-300">
                {status === 'online' && 'Đã kết nối'}
                {status === 'connecting' && 'Đang kết nối...'}
                {status === 'idle' && 'Sẵn sàng'}
                {status === 'error' && 'Mất kết nối'}
              </p>
            </div>
            <button
              type="button"
              aria-label="Đóng cửa sổ chat"
              onClick={handleToggle}
              className="rounded-full p-1 text-slate-200 transition hover:bg-slate-800"
            >
              <X size={18} />
            </button>
          </div>
          <div className="flex flex-col gap-3 px-4 py-4">
            {!user ? (
              <div className="space-y-4 text-sm text-slate-600">
                <p>Bạn cần đăng nhập để trò chuyện với đội hỗ trợ.</p>
                <Link
                  href="/(auth)/login"
                  className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-3 py-2 text-white"
                >
                  Đăng nhập
                </Link>
              </div>
            ) : (
              <>
                {connectionError && (
                  <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                    <AlertTriangle size={14} />
                    <span>{connectionError}</span>
                  </div>
                )}
                <div className="flex h-72 flex-col gap-3 overflow-y-auto pr-1" role="log" aria-live="polite">
                  {messages.length === 0 && (
                    <div className="mt-6 text-center text-sm text-slate-500">
                      Hãy gửi câu hỏi đầu tiên để đội ngũ hỗ trợ phản hồi.
                    </div>
                  )}
                  {messages.map((message) => {
                    const isSelf = message.senderRole !== 'admin';
                    return (
                      <div key={message.id} className={`flex flex-col gap-1 ${isSelf ? 'items-end' : 'items-start'}`}>
                        <div
                          className={`rounded-2xl px-3 py-2 text-sm shadow-sm ${
                            isSelf
                              ? 'bg-slate-900 text-white'
                              : 'bg-slate-100 text-slate-800'
                          }`}
                        >
                          <p className="whitespace-pre-line">{message.content}</p>
                          <div className="mt-1 flex items-center gap-2 text-[11px] uppercase tracking-wide">
                            <span className="opacity-70">{isSelf ? 'Bạn' : message.senderName || 'Admin'}</span>
                            <span className="opacity-60">{formatTime(message.createdAt)}</span>
                          </div>
                          {message.pending && (
                            <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-200">
                              <Loader2 size={12} className="animate-spin" />
                              <span>Đang gửi...</span>
                            </div>
                          )}
                          {message.error && (
                            <div className="mt-1 text-[11px] text-red-200">Không gửi được. Thử lại.</div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messageEndRef} />
                </div>
                <form onSubmit={handleSend} className="rounded-2xl border border-slate-200 bg-slate-50 p-2">
                  <textarea
                    rows={2}
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={status === 'online' ? 'Nhập tin nhắn...' : 'Đang chờ kết nối...'}
                    className="w-full resize-none rounded-xl border border-transparent bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-slate-300"
                    disabled={status !== 'online'}
                  />
                  <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                    <span>Nhấn Enter để gửi • Shift + Enter xuống dòng</span>
                    <button
                      type="submit"
                      className="inline-flex items-center gap-1 rounded-xl bg-slate-900 px-3 py-1.5 text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                      disabled={status !== 'online' || !draft.trim()}
                    >
                      Gửi
                      <Send size={14} />
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      <button
        type="button"
        aria-label="Mở chat hỗ trợ"
        onClick={handleToggle}
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-slate-900 text-white shadow-xl transition hover:bg-slate-800"
      >
        <MessageCircle size={24} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-semibold text-white">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>
    </div>
  );
}

export default SupportChatWidget;
