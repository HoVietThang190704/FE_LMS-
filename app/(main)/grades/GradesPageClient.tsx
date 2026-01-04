"use client";

import React, { useEffect, useState } from 'react';
import { Trophy, BookOpen, GraduationCap } from 'lucide-react';
import { getMyGrades } from '@/lib/services/grades.service';
import { STORAGE_KEYS } from '@/lib/shared/constants/storage';
import type { GradeSummary } from '@/lib/types/grades';

interface GradesPageClientProps {
  initialData: GradeSummary;
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

function getLetterGradeColor(grade: string): string {
  if (grade.startsWith('A')) return 'text-green-600 bg-green-50';
  if (grade.startsWith('B')) return 'text-blue-600 bg-blue-50';
  if (grade.startsWith('C')) return 'text-yellow-600 bg-yellow-50';
  if (grade.startsWith('D')) return 'text-orange-600 bg-orange-50';
  return 'text-red-600 bg-red-50';
}

const EMPTY_GRADES: GradeSummary = {
  userId: '',
  totalCredits: 0,
  earnedCredits: 0,
  gpa: 0,
  courses: [],
};

export default function GradesPageClient({ initialData }: GradesPageClientProps) {
  const [data, setData] = useState<GradeSummary>(initialData || EMPTY_GRADES);

  useEffect(() => {
    const token = typeof window !== 'undefined' 
      ? window.localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN) 
      : null;
    if (!token) return;

    getMyGrades()
      .then((payload) => {
        if (payload) setData(payload);
      })
      .catch((error) => {
        console.error('[GradesPage] reload failed', error);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Bảng điểm</h1>
          <p className="text-gray-600 mt-1">Xem kết quả học tập và điểm số của bạn</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <StatCard
            icon={Trophy}
            value={data.gpa.toFixed(2)}
            label="GPA tích lũy"
            bgColor="bg-yellow-100"
            iconColor="text-yellow-600"
          />
          <StatCard
            icon={BookOpen}
            value={`${data.earnedCredits}/${data.totalCredits}`}
            label="Tín chỉ đạt / Tổng"
            bgColor="bg-blue-100"
            iconColor="text-blue-600"
          />
          <StatCard
            icon={GraduationCap}
            value={data.courses.length}
            label="Số môn đã học"
            bgColor="bg-green-100"
            iconColor="text-green-600"
          />
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Kết quả học tập</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mã môn
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tên môn học
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tín chỉ
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trắc nghiệm
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thực hành
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tổng kết
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Xếp loại
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.courses.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      <BookOpen className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                      <p className="text-lg font-medium">Chưa có dữ liệu điểm</p>
                      <p className="text-sm">Bạn chưa đăng ký môn học nào</p>
                    </td>
                  </tr>
                ) : (
                  data.courses.map((grade) => (
                    <tr key={grade.courseId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="bg-blue-50 text-blue-600 text-xs font-semibold px-2.5 py-1 rounded">
                          {grade.courseCode}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{grade.courseName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                        {grade.credits}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                        {grade.quizScore !== null ? grade.quizScore.toFixed(1) : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                        {grade.practiceScore !== null ? grade.practiceScore.toFixed(1) : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-semibold text-gray-900">
                        {grade.total !== null ? grade.total.toFixed(2) : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getLetterGradeColor(grade.grade)}`}>
                          {grade.grade}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
