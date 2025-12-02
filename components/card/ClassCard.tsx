import React from 'react';
import { Calendar, MapPin } from 'lucide-react';

interface ClassCardProps {
  courseCode: string;
  courseName: string;
  instructor: string;
  progress: number;
  schedule: string;
  room: string;
  lessonProgress: string;
}

export default function ClassCard({
  courseCode,
  courseName,
  instructor,
  progress,
  schedule,
  room,
  lessonProgress,
}: ClassCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-blue-50 text-blue-600 text-xs font-semibold px-2.5 py-1 rounded">
              {courseCode}
            </span>
            <span className="text-blue-600 text-sm font-semibold">{progress}%</span>
          </div>
          <h3 className="text-gray-900 font-semibold text-base mb-1">{courseName}</h3>
          <p className="text-gray-600 text-sm">{instructor}</p>
        </div>
      </div>
      <div className="mb-4">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gray-900 h-2 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
        <div className="flex items-center gap-1">
          <Calendar size={16} />
          <span>{schedule}</span>
        </div>
        <div className="flex items-center gap-1">
          <MapPin size={16} />
          <span>{room}</span>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">{lessonProgress} bài học</span>
        <button className="bg-black text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors">
          Vào lớp
        </button>
      </div>
    </div>
  );
}
