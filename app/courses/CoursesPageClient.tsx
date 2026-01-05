"use client";

import React, { useMemo, useRef, useState } from 'react';
import Popup from '@/components/ui/Popup';
import { fetchFromApi, buildApiUrl } from '@/lib/shared/utils/api';
import { STORAGE_KEYS } from '@/lib/shared/constants/storage';
import CourseCard from '@/components/card/CourseCard';
import type { Course } from '@/lib/api/courses';
import SearchBar from '@/components/search/SearchBar';
import { useT } from '@/lib/shared/i18n';

type TabKey = 'all' | 'enrolled' | 'available';

export default function CoursesPageClient({ initialCourses }: { initialCourses: Course[] }) {
  const [tab, setTab] = useState<TabKey>('all');
  const [q, setQ] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    code: '',
    name: '',
    description: '',
    image: '',
    tagsInput: '',
    credits: '',
    instructor: '',
    schedule: '',
    room: '',
    capacity: '',
    invitationCode: '',
    visibility: 'public' as 'public' | 'private',
    requireApproval: false,
    startDate: '',
    endDate: '',
  });

  const { t } = useT();
  const [syllabus, setSyllabus] = useState<Array<{ title: string; description: string }>>([
    { title: '', description: '' }
  ]);
  const [createError, setCreateError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imageUploadError, setImageUploadError] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let arr = initialCourses || [];

    if (tab === 'enrolled') {
      arr = arr.filter((c) => Boolean(c.isEnrolled || (c.tags || []).includes('enrolled')));
    } else if (tab === 'available') {
      arr = arr.filter((c) => !Boolean(c.isEnrolled || (c.tags || []).includes('enrolled')));
    }

    if (q.trim()) {
      const key = q.trim().toLowerCase();
      arr = arr.filter(
        (c) =>
          c.name?.toLowerCase().includes(key) ||
          c.code?.toLowerCase().includes(key) ||
          (c.instructor || '').toLowerCase().includes(key)
      );
    }

    return arr;
  }, [initialCourses, tab, q]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Danh sách khóa học</h1>
            <p className="text-gray-600">Học kỳ 1 năm học 2025-2026</p>
          </div>
          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="inline-flex items-center justify-center rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
          >
            {t('createCourse.create')}
          </button>
        </div>

        <div className="mb-6">
          <div className="mb-4">
            <SearchBar
              placeholder={t('courses.searchPlaceholder')}
              onSearch={(val) => setQ(val)}
              defaultValue={q}
              className="w-full"
            />
          </div>

          <div className="flex gap-2">
            <button onClick={() => setTab('all')} className={`px-2 py-1 rounded-md ${tab === 'all' ? 'bg-black text-white' : 'bg-white border'}`}>
              Đăng ký
            </button>
            <button onClick={() => setTab('enrolled')} className={`px-2 py-1 rounded-md ${tab === 'enrolled' ? 'bg-black text-white' : 'bg-white border'}`}>
              Đã đăng ký
            </button>
            <button onClick={() => setTab('available')} className={`px-2 py-1 rounded-md ${tab === 'available' ? 'bg-black text-white' : 'bg-white border'}`}>
              Có thể đăng ký
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((c) => (
            <CourseCard key={c.id} course={c} enrolled={Boolean(c.isEnrolled || (c.tags || []).includes('enrolled'))} />
          ))}
        </div>

        {filtered.length === 0 && <p className="mt-8 text-gray-600">Không có khóa học phù hợp.</p>}
      </div>

      <Popup
        open={isCreateOpen}
        onClose={() => {
          setIsCreateOpen(false);
          setCreateError(null);
        }}
        title={t('createCourse.title')}
        size="md"
        headerDivider
      >
        <div className="space-y-3 max-h-[75vh] overflow-y-auto pr-1">
          <div className="grid gap-1">
            <label className="text-sm font-medium text-slate-700">{t('createCourse.codeLabel')}</label>
            <input
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
              value={createForm.code}
              onChange={(e) => setCreateForm((p) => ({ ...p, code: e.target.value.toUpperCase() }))}
              placeholder={t('createCourse.codePlaceholder')}
            />
          </div>
          <div className="grid gap-1">
            <label className="text-sm font-medium text-slate-700">{t('createCourse.nameLabel')}</label>
            <input
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
              value={createForm.name}
              onChange={(e) => setCreateForm((p) => ({ ...p, name: e.target.value }))}
              placeholder={t('createCourse.namePlaceholder')}
            />
          </div>
          <div className="grid gap-1">
            <label className="text-sm font-medium text-slate-700">{t('createCourse.descriptionLabel')}</label>
            <textarea
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
              value={createForm.description}
              onChange={(e) => setCreateForm((p) => ({ ...p, description: e.target.value }))}
              rows={3}
              placeholder={t('createCourse.descriptionPlaceholder')}
            />
          </div>
          <div className="grid gap-1">
            <label className="text-sm font-medium text-slate-700">{t('createCourse.imageLabel')}</label>
            <input
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
              value={createForm.image}
              onChange={(e) => setCreateForm((p) => ({ ...p, image: e.target.value }))}
              placeholder="https://.../thumbnail.jpg"
            />
            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-700">
              <button
                type="button"
                className="rounded-lg border border-slate-200 px-3 py-2 font-semibold hover:bg-slate-50"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingImage}
              >
                {isUploadingImage ? t('createCourse.uploading') ?? 'Đang tải ảnh...' : t('createCourse.chooseImage')}
              </button>
              {createForm.image ? <span className="text-xs text-slate-500 truncate max-w-[180px]">{createForm.image}</span> : null}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setIsUploadingImage(true);
                  setImageUploadError(null);
                  try {
                    const formData = new FormData();
                    formData.append('images', file);
                    const uploadUrl = buildApiUrl('/api/upload/images');
                    const accessToken = typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN) : null;
                    const headers = new Headers();
                    if (accessToken) {
                      headers.set('Authorization', `Bearer ${accessToken}`);
                    }
                    const response = await fetch(uploadUrl, {
                      method: 'POST',
                      body: formData,
                      credentials: 'include',
                      headers,
                    });
                    const json = await response.json().catch(() => ({}));
                    if (!response.ok || !json?.data?.urls?.[0]) {
                      throw new Error(json?.message || 'Không thể tải ảnh lên');
                    }
                    setCreateForm((p) => ({ ...p, image: json.data.urls[0] }));
                  } catch ( err) {
                    const msg = err instanceof Error ? err.message : 'Không thể tải ảnh lên';
                    setImageUploadError(msg || t('createCourse.errors.uploadFailed'));
                  } finally {
                    setIsUploadingImage(false);
                    if (e.target) e.target.value = '';
                  }
                }}
              />
              {imageUploadError ? <span className="text-xs text-rose-600">{imageUploadError}</span> : null}
            </div>
          </div>
          <div className="grid gap-1">
            <label className="text-sm font-medium text-slate-700">{t('createCourse.tagsLabel')}</label>
            <input
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
              value={createForm.tagsInput}
              onChange={(e) => setCreateForm((p) => ({ ...p, tagsInput: e.target.value }))}
              placeholder="web,react,node"
            />
          </div>
          <div className="grid gap-2 sm:grid-cols-2 sm:gap-4">
            <div className="grid gap-1">
              <label className="text-sm font-medium text-slate-700">{t('createCourse.creditsLabel')}</label>
              <input
                type="number"
                min={0}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
                value={createForm.credits}
                onChange={(e) => setCreateForm((p) => ({ ...p, credits: e.target.value }))}
                placeholder="3"
              />
            </div>
            <div className="grid gap-1">
              <label className="text-sm font-medium text-slate-700">{t('createCourse.capacityLabel')}</label>
              <input
                type="number"
                min={0}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
                value={createForm.capacity}
                onChange={(e) => setCreateForm((p) => ({ ...p, capacity: e.target.value }))}
                placeholder="60"
              />
            </div>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 sm:gap-4">
            <div className="grid gap-1">
              <label className="text-sm font-medium text-slate-700">{t('createCourse.instructorLabel')}</label>
              <input
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
                value={createForm.instructor}
                onChange={(e) => setCreateForm((p) => ({ ...p, instructor: e.target.value }))}
                placeholder="Nguyễn Văn A"
              />
            </div>
            <div className="grid gap-1">
              <label className="text-sm font-medium text-slate-700">{t('createCourse.scheduleLabel')}</label>
              <input
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
                value={createForm.schedule}
                onChange={(e) => setCreateForm((p) => ({ ...p, schedule: e.target.value }))}
                placeholder="Mon, Wed 07:00 - 09:00"
              />
            </div>
          </div>
          <div className="grid gap-1">
            <label className="text-sm font-medium text-slate-700">{t('createCourse.roomLabel')}</label>
            <input
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
              value={createForm.room}
              onChange={(e) => setCreateForm((p) => ({ ...p, room: e.target.value }))}
              placeholder="B101"
            />
          </div>

          <div className="grid gap-2 sm:grid-cols-2 sm:gap-4">
            <div className="grid gap-1">
              <label className="text-sm font-medium text-slate-700">Ngày bắt đầu</label>
              <input
                type="datetime-local"
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
                value={createForm.startDate}
                onChange={(e) => setCreateForm((p) => ({ ...p, startDate: e.target.value }))}
              />
            </div>
            <div className="grid gap-1">
              <label className="text-sm font-medium text-slate-700">Ngày kết thúc</label>
              <input
                type="datetime-local"
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
                value={createForm.endDate}
                onChange={(e) => setCreateForm((p) => ({ ...p, endDate: e.target.value }))}
                min={createForm.startDate}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700">{t('createCourse.syllabus.heading')}</span>
              <button
                type="button"
                className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                onClick={() => setSyllabus((prev) => [...prev, { title: '', description: '' }])}
              >
                {t('createCourse.syllabus.addItem')}
              </button>
            </div>
            <div className="space-y-3">
              {syllabus.map((item, idx) => (
                <div key={idx} className="rounded-lg border border-slate-200 p-3 space-y-2 bg-slate-50">
                  <div className="grid gap-1">
                    <label className="text-xs font-medium text-slate-700">{t('createCourse.syllabus.itemTitleLabel')}</label>
                    <input
                      className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
                      value={item.title}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSyllabus((prev) => prev.map((x, i) => (i === idx ? { ...x, title: val } : x)));
                      }}
                      placeholder={t('createCourse.syllabus.itemTitlePlaceholder')}
                    />
                  </div>
                  <div className="grid gap-1">
                    <label className="text-xs font-medium text-slate-700">{t('createCourse.syllabus.itemDescLabel')}</label>
                    <textarea
                      className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
                      value={item.description}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSyllabus((prev) => prev.map((x, i) => (i === idx ? { ...x, description: val } : x)));
                      }}
                      rows={2}
                      placeholder={t('createCourse.syllabus.itemDescPlaceholder')}
                    />
                  </div>
                  {syllabus.length > 1 && (
                    <button
                      type="button"
                      className="text-xs font-semibold text-rose-600 hover:text-rose-700"
                      onClick={() => setSyllabus((prev) => prev.filter((_, i) => i !== idx))}
                    >
                      {t('createCourse.syllabus.removeItem')}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-2 text-sm text-slate-700">
            <span className="font-medium">Chế độ hiển thị</span>
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="visibility"
                value="public"
                checked={createForm.visibility === 'public'}
                onChange={() => setCreateForm((p) => ({ ...p, visibility: 'public' }))}
              />
              <span>{t('createCourse.visibilityPublic')}</span>
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="visibility"
                value="private"
                checked={createForm.visibility === 'private'}
                onChange={() => setCreateForm((p) => ({ ...p, visibility: 'private', requireApproval: false }))}
              />
              <span>{t('createCourse.visibilityPrivate')}</span>
            </label>
          </div>
          <label className="inline-flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={createForm.requireApproval}
              onChange={(e) => setCreateForm((p) => ({ ...p, requireApproval: e.target.checked }))}
              disabled={createForm.visibility === 'private'}
            />
            <span>{t('createCourse.requireApproval')}</span>
          </label>

          <div className="grid gap-1">
            <label className="text-sm font-medium text-slate-700">{t('createCourse.invitationCodeLabel')}</label>
            <input
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none"
              value={createForm.invitationCode}
              onChange={(e) => setCreateForm((p) => ({ ...p, invitationCode: e.target.value.toUpperCase() }))}
              placeholder="ABCD1234"
            />
          </div>

          {createError ? <p className="text-xs text-rose-600">{createError}</p> : null}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            onClick={() => {
              setIsCreateOpen(false);
              setCreateError(null);
            }}
            disabled={isSubmitting}
          >
            {t('createCourse.cancel')}
          </button>
          <button
            type="button"
            className="rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 disabled:opacity-60"
            disabled={isSubmitting}
            onClick={async () => {
              if (!createForm.code.trim() || !createForm.name.trim()) {
                setCreateError(t('createCourse.errors.requiredCodeName'));
                return;
              }
              setIsSubmitting(true);
              setCreateError(null);
              try {
                const tags = createForm.tagsInput
                  .split(',')
                  .map((t) => t.trim())
                  .filter(Boolean);
                const parsedCredits = Number(createForm.credits);
                const parsedCapacity = Number(createForm.capacity);
                const cleanSyllabus = syllabus
                  .map((item) => ({
                    title: item.title.trim(),
                    description: item.description.trim() || undefined,
                  }))
                  .filter((item) => item.title.length > 0);

                const payload = {
                  code: createForm.code.trim().toUpperCase(),
                  name: createForm.name.trim(),
                  description: createForm.description.trim() || undefined,
                  image: createForm.image.trim() || undefined,
                  tags: tags.length ? tags : undefined,
                  credits: Number.isFinite(parsedCredits) && parsedCredits > 0 ? parsedCredits : undefined,
                  instructor: createForm.instructor.trim() || undefined,
                  schedule: createForm.schedule.trim() || undefined,
                  room: createForm.room.trim() || undefined,
                  capacity: Number.isFinite(parsedCapacity) && parsedCapacity > 0 ? parsedCapacity : undefined,
                  syllabus: cleanSyllabus.length ? cleanSyllabus : undefined,
                  visibility: createForm.visibility,
                  requireApproval: createForm.visibility === 'public' ? createForm.requireApproval : false,
                  invitationCode: createForm.invitationCode.trim() || undefined,
                  startDate: createForm.startDate ? new Date(createForm.startDate).toISOString() : undefined,
                  endDate: createForm.endDate ? new Date(createForm.endDate).toISOString() : undefined,
                };
                const accessToken = typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN) : null;
                await fetchFromApi('/api/courses', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
                  },
                  body: JSON.stringify(payload),
                });
                setIsCreateOpen(false);
                setCreateForm({
                  code: '',
                  name: '',
                  description: '',
                  image: '',
                  tagsInput: '',
                  credits: '',
                  instructor: '',
                  schedule: '',
                  room: '',
                  capacity: '',
                  invitationCode: '',
                  visibility: 'public',
                  requireApproval: false,
                  startDate: '',
                  endDate: '',
                });
                setSyllabus([{ title: '', description: '' }]);
                setImageUploadError(null);
              } catch (error) {
                const msg = (error instanceof Error && typeof error.message === 'string') ? error.message : t('createCourse.errors.createFailed');
                setCreateError(msg);
              } finally {
                setIsSubmitting(false);
              }
            }}
          >
            {isSubmitting ? t('createCourse.uploading') ?? 'Đang tạo...' : t('createCourse.create')}
          </button>
        </div>
      </Popup>
    </div>
  );
}
