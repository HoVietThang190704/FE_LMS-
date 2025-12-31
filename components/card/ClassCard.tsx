import React from 'react';
import Link from 'next/link';
import { Calendar, MapPin } from 'lucide-react';

interface ClassCardProps {
  courseCode: string;
  courseName: string;
  instructor: string;
  progress: number;
  schedule: string;
  room: string;
  lessonProgress: string;
  lessonLabel: string;
  enterLabel: string;
  actionHref?: string;
}

export default function ClassCard({
  courseCode,
  courseName,
  instructor,
  progress,
  schedule,
  room,
  lessonProgress,
  lessonLabel,
  enterLabel,
  actionHref,
}: ClassCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition">
      <div className="flex items-start justify-between mb-3 gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-blue-50 text-blue-600 text-xs font-semibold px-2.5 py-1 rounded">
              {courseCode}
            </span>
            <span className="text-purple-700 text-sm font-semibold">{progress}%</span>
          </div>
          <h3 className="text-gray-900 font-semibold text-base mb-1 break-words">{courseName}</h3>
          <p className="text-gray-600 text-sm">{instructor}</p>
        </div>
        <span className="text-xs text-gray-500 whitespace-nowrap">{lessonProgress} {lessonLabel}</span>
      </div>

      <div className="mb-3 w-full bg-gray-100 rounded-full h-2 overflow-hidden">
        <div
          className="h-full bg-black rounded-full transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
        <div className="flex items-center gap-2">
          <Calendar size={16} />
          <span>{schedule}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin size={16} />
          <span>{room}</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">{lessonProgress} {lessonLabel}</span>
        {actionHref ? (
          <Link
            href={actionHref}
            className="bg-black text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            {enterLabel}
          </Link>
        ) : (
          <button className="bg-black text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors">
            {enterLabel}
          </button>
        )}
      </div>
    </div>
  );
}
