"use client";

import React, { useMemo, useState } from 'react';
import CourseCard from '@/components/card/CourseCard';
import type { Course } from '@/lib/api/courses';
import SearchBar from '@/components/search/SearchBar';

type TabKey = 'all' | 'enrolled' | 'available';

export default function CoursesPageClient({ initialCourses }: { initialCourses: Course[] }) {
  const [tab, setTab] = useState<TabKey>('all');
  const [q, setQ] = useState('');

  const filtered = useMemo(() => {
    let arr = initialCourses || [];

    if (tab === 'enrolled') {
      arr = arr.filter((c) => (c.tags || []).includes('enrolled'));
    } else if (tab === 'available') {
      arr = arr.filter((c) => !(c.tags || []).includes('enrolled'));
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
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Danh sách khóa học</h1>
          <p className="text-gray-600">Học kỳ 1 năm học 2025-2026</p>
        </div>

        <div className="mb-6">
          <div className="mb-4">
            <SearchBar
              placeholder="Tìm kiếm môn học, mã môn, giảng viên..."
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
            <CourseCard key={c.id} course={c} enrolled={(c.tags || []).includes('enrolled')} />
          ))}
        </div>

        {filtered.length === 0 && <p className="mt-8 text-gray-600">Không có khóa học phù hợp.</p>}
      </div>
    </div>
  );
}
