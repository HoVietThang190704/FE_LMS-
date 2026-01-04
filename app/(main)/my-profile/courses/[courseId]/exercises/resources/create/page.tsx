'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Upload, Link as LinkIcon, Loader2 } from 'lucide-react';
import { createLesson, type LessonResourcePayload } from '@/lib/services/lessons/lessons.service';
import { getMessages, DEFAULT_LOCALE, resolveMessage } from '@/app/i18n';

export default function CreateResourcePage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;

  const messages = getMessages(DEFAULT_LOCALE) as Record<string, Record<string, string>>;

  const [name, setName] = useState('');
  const [resourceType, setResourceType] = useState<'link' | 'file'>('link');
  const [url, setUrl] = useState('');
  const [week, setWeek] = useState(1);

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleUploadFile = async (file: File) => {
    setUploading(true);
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
      const uploadedUrl = payload?.data?.urls?.[0];
      if (!uploadedUrl) throw new Error('Không nhận được URL tệp');

      setUrl(uploadedUrl);
      if (!name) setName(file.name);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tải tệp lên');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Vui lòng nhập tên tài nguyên');
      return;
    }

    if (!url.trim()) {
      setError('Vui lòng nhập URL hoặc tải tệp lên');
      return;
    }

    setSaving(true);
    try {
      const resource: LessonResourcePayload = {
        name: name.trim(),
        type: resourceType,
        url: url.trim(),
      };

      await createLesson(courseId, {
        title: `Tài nguyên: ${name.trim()}`,
        description: `Tài nguyên bổ sung cho khóa học`,
        week,
        order: 999,
        resources: [resource],
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
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link
            href={`/my-profile/courses/${courseId}/exercises`}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft size={20} />
            <span>{messages.exercises?.back || 'Quay lại'}</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            {resolveMessage(messages.exercises?.createResource, 'Thêm tài nguyên')}
          </h1>
          <p className="text-gray-600 mt-1">
            Thêm link hoặc tệp tài liệu cho khóa học
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên tài nguyên *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nhập tên tài nguyên"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tuần
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
                  Loại tài nguyên
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={resourceType === 'link'}
                      onChange={() => setResourceType('link')}
                      className="w-4 h-4 text-blue-600"
                    />
                    <LinkIcon size={18} className="text-gray-500" />
                    <span>Link</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={resourceType === 'file'}
                      onChange={() => setResourceType('file')}
                      className="w-4 h-4 text-blue-600"
                    />
                    <Upload size={18} className="text-gray-500" />
                    <span>File</span>
                  </label>
                </div>
              </div>

              {resourceType === 'link' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL *
                  </label>
                  <div className="flex items-center gap-2">
                    <LinkIcon size={18} className="text-gray-400" />
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="https://example.com/document"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tải tệp lên *
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleUploadFile(file);
                      }}
                      className="flex-1"
                    />
                    {uploading && <Loader2 className="h-5 w-5 animate-spin text-blue-600" />}
                  </div>
                  {url && (
                    <p className="mt-2 text-sm text-green-600 truncate">{url}</p>
                  )}
                </div>
              )}
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
              disabled={saving || uploading}
              className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60"
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>Lưu tài nguyên</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
