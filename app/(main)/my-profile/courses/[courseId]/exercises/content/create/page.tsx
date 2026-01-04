'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, Trash2, Upload, Link as LinkIcon, Loader2 } from 'lucide-react';
import { createLesson, type LessonResourcePayload } from '@/lib/services/lessons/lessons.service';
import { getMessages, DEFAULT_LOCALE, resolveMessage } from '@/app/i18n';

const defaultResource = (): LessonResourcePayload => ({ name: '', type: 'link', url: '' });

export default function CreateContentPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;

  const messages = getMessages(DEFAULT_LOCALE) as Record<string, Record<string, string>>;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [week, setWeek] = useState(1);
  const [order, setOrder] = useState(0);
  const [durationMinutes, setDurationMinutes] = useState<number | undefined>(45);
  const [resources, setResources] = useState<LessonResourcePayload[]>([defaultResource()]);

  const [saving, setSaving] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [error, setError] = useState('');

  const handleAddResource = () => {
    setResources((prev) => [...prev, defaultResource()]);
  };

  const handleRemoveResource = (index: number) => {
    setResources((prev) => {
      const kept = prev.filter((_, i) => i !== index);
      return kept.length ? kept : [defaultResource()];
    });
  };

  const handleResourceChange = (index: number, field: keyof LessonResourcePayload, value: string) => {
    setResources((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value } as LessonResourcePayload;
      return next;
    });
  };

  const handleUploadFile = async (index: number, file: File) => {
    setUploadingIndex(index);
    setError('');
    try {
      const formData = new FormData();
      formData.append('images', file);

      const res = await fetch('/api/upload/images', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!res.ok) throw new Error('Tải tệp thất bại');
      const payload = await res.json();
      const url = payload?.data?.urls?.[0];
      if (!url) throw new Error('Không nhận được URL tệp');

      setResources((prev) => {
        const next = [...prev];
        const current = next[index] || defaultResource();
        next[index] = {
          ...current,
          name: current.name || file.name,
          type: 'file',
          url,
          mimeType: file.type,
          size: file.size,
        };
        return next;
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tải tệp lên');
    } finally {
      setUploadingIndex(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError(messages.exercises?.titleRequired || 'Vui lòng nhập tiêu đề');
      return;
    }

    setSaving(true);
    try {
      const filteredResources = resources
        .filter((r) => r.name && r.url)
        .map((r) => ({ ...r, type: r.type || 'link' } as LessonResourcePayload));

      await createLesson(courseId, {
        title: title.trim(),
        description: description.trim() || undefined,
        week,
        order,
        durationMinutes,
        resources: filteredResources,
        isPublished: true,
      });

      router.push(`/my-profile/courses/${courseId}/exercises`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link
            href={`/my-profile/courses/${courseId}/exercises`}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft size={20} />
            <span>{messages.exercises?.back || 'Quay lại'}</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            {resolveMessage(messages.exercises?.createContent, 'Tạo nội dung bài học')}
          </h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {messages.exercises?.basicInfo || 'Thông tin cơ bản'}
            </h2>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tiêu đề *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nhập tiêu đề bài học"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mô tả
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Mô tả nội dung bài học"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tuần *
                </label>
                <input
                  type="number"
                  min={1}
                  value={week}
                  onChange={(e) => setWeek(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thứ tự
                </label>
                <input
                  type="number"
                  min={0}
                  value={order}
                  onChange={(e) => setOrder(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thời lượng (phút)
                </label>
                <input
                  type="number"
                  min={1}
                  value={durationMinutes || ''}
                  onChange={(e) => setDurationMinutes(e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="45"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Tài nguyên đính kèm</h2>
              <button
                type="button"
                onClick={handleAddResource}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
              >
                <Plus size={16} />
                <span>Thêm tài nguyên</span>
              </button>
            </div>

            <div className="space-y-4">
              {resources.map((res, idx) => (
                <div key={idx} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <select
                      value={res.type}
                      onChange={(e) => handleResourceChange(idx, 'type', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    >
                      <option value="link">Link</option>
                      <option value="file">File</option>
                    </select>
                    <input
                      type="text"
                      value={res.name}
                      onChange={(e) => handleResourceChange(idx, 'name', e.target.value)}
                      placeholder="Tên tài nguyên"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveResource(idx)}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    {res.type === 'link' ? (
                      <div className="flex items-center gap-2 flex-1">
                        <LinkIcon size={18} className="text-gray-400" />
                        <input
                          type="url"
                          value={res.url}
                          onChange={(e) => handleResourceChange(idx, 'url', e.target.value)}
                          placeholder="https://example.com"
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 flex-1">
                        <Upload size={18} className="text-gray-400" />
                        <input
                          type="file"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleUploadFile(idx, file);
                          }}
                          className="flex-1 text-sm"
                        />
                        {uploadingIndex === idx && <Loader2 className="h-5 w-5 animate-spin text-blue-600" />}
                        {res.url && (
                          <span className="text-sm text-green-600 truncate max-w-xs">{res.url}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-4">
            <Link
              href={`/my-profile/courses/${courseId}/exercises`}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Hủy
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60"
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>Lưu bài học</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
