"use client";

import React, { useEffect, useState } from 'react';
import { Flame, BookOpen, Award, Target, Clock } from 'lucide-react';
import { getMyProgressReport } from '@/lib/services/grades.service';
import { STORAGE_KEYS } from '@/lib/shared/constants/storage';
import type { ProgressReport, CourseProgressDetail } from '@/lib/types/grades';

interface ReportsPageClientProps {
  initialData: ProgressReport;
}

function StatCard({
  icon: Icon,
  value,
  label,
  bgColor,
  iconColor,
}: {
  icon: React.ElementType;
  value: string | number;
  label: string;
  bgColor: string;
  iconColor: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-full ${bgColor} flex items-center justify-center`}>
          <Icon className={iconColor} size={24} />
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-sm text-gray-500">{label}</p>
        </div>
      </div>
    </div>
  );
}

function getCategoryColor(category: CourseProgressDetail['category']): string {
  switch (category) {
    case 'Xuất sắc':
      return 'text-green-600 bg-green-50';
    case 'Tốt':
      return 'text-blue-600 bg-blue-50';
    default:
      return 'text-yellow-600 bg-yellow-50';
  }
}

function CourseProgressCard({ course }: { course: CourseProgressDetail }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-blue-50 text-blue-600 text-xs font-semibold px-2.5 py-1 rounded">
              {course.courseCode}
            </span>
            <span className={`text-xs font-medium px-2 py-0.5 rounded ${getCategoryColor(course.category)}`}>
              {course.category}
            </span>
          </div>
          <h3 className="text-gray-900 font-semibold text-base mb-1">{course.courseName}</h3>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-purple-600">{course.progressPercent}%</p>
          <p className="text-xs text-gray-500">Tiến độ</p>
        </div>
      </div>

      <div className="mb-4">
        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-2 bg-black rounded-full transition-all duration-300"
            style={{ width: `${Math.min(100, Math.max(0, course.progressPercent))}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <p className="text-lg font-bold text-gray-900">{course.exercisesProgress}</p>
          <p className="text-xs text-gray-500">Bài tập</p>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <Clock size={14} />
          <span>{course.studyTime}</span>
        </div>
        <div className="font-semibold text-green-600">
          Điểm: {course.currentScore.toFixed(1)}
        </div>
      </div>
    </div>
  );
}

const EMPTY_REPORT: ProgressReport = {
  userId: '',
  streakDays: 0,
  lessonsCompleted: 0,
  exercisesCompleted: '0/0',
  averageScore: 0,
  courseProgress: [],
};

export default function ReportsPageClient({ initialData }: ReportsPageClientProps) {
  const [data, setData] = useState<ProgressReport>(initialData || EMPTY_REPORT);

  useEffect(() => {
    const token = typeof window !== 'undefined' 
      ? window.localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN) 
      : null;
    if (!token) return;

    getMyProgressReport()
      .then((payload) => {
        if (payload) setData(payload);
      })
      .catch((error) => {
        console.error('[ReportsPage] reload failed', error);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Báo cáo tiến độ</h1>
          <p className="text-gray-600 mt-1">Theo dõi quá trình học tập của bạn</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={Flame}
            value={`${data.streakDays} ngày`}
            label="Chuỗi học liên tục"
            bgColor="bg-orange-100"
            iconColor="text-orange-600"
          />
          <StatCard
            icon={BookOpen}
            value={data.lessonsCompleted}
            label="Bài học hoàn thành"
            bgColor="bg-blue-100"
            iconColor="text-blue-600"
          />
          <StatCard
            icon={Award}
            value={data.exercisesCompleted}
            label="Bài tập đã làm"
            bgColor="bg-purple-100"
            iconColor="text-purple-600"
          />
          <StatCard
            icon={Target}
            value={data.averageScore > 0 ? `${data.averageScore.toFixed(1)}` : '-'}
            label="Điểm trung bình"
            bgColor="bg-green-100"
            iconColor="text-green-600"
          />
        </div>


        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Tiến độ theo khóa học</h2>
          
          {data.courseProgress.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <BookOpen className="mx-auto h-12 w-12 text-gray-300 mb-4" />
              <p className="text-lg font-medium text-gray-900">Chưa có khóa học nào</p>
              <p className="text-sm text-gray-500">Bạn chưa đăng ký khóa học nào</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.courseProgress.map((course) => (
                <CourseProgressCard key={course.courseId} course={course} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
