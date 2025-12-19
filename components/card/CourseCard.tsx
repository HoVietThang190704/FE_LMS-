import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, MapPin, Users } from 'lucide-react';
import type { Course } from '@/lib/api/courses';
import { ROUTES } from '@/lib/shared/constants/routeres';

interface Props {
  course: Course;
  enrolled?: boolean; 
}

export default function CourseCard({ course, enrolled = false }: Props) {
  const credits = course.credits ?? 3;
  const instructor = course.instructor ?? 'Chưa cập nhật';
  const schedule = course.schedule ?? '';
  const room = course.room ?? '';
  const enrolledCount = course.enrolled ?? 0;
  const capacity = course.capacity ?? 60;

  const imageSrc = (course as { image?: string }).image
    ? `/images/demo/${(course as { image?: string }).image}`
    : `/images/demo/default.svg`;

  return (
    <article className="bg-white rounded-3xl border border-gray-200 hover:shadow-md transition-shadow overflow-hidden">
      <div className="relative h-40 w-full bg-gray-100">
        <Image
          src={imageSrc}
          alt={course.name}
          fill
          className="object-cover"
        />

        <span className={`absolute top-3 left-3 text-xs font-semibold px-2 py-1 rounded-3xl ${enrolled ? 'bg-amber-900 text-white' : 'bg-white text-gray-700'}`}>
          {enrolled ? 'Đã đăng ký' : 'Có thể đăng ký'}
        </span>

        <div className="absolute top-3 right-3 text-sm text-white bg-black bg-opacity-50 rounded-3xl px-2 py-1">
          {credits} tín chỉ
        </div>

        <span className="absolute left-3 bottom-3 bg-blue-50 text-blue-600 text-xs font-semibold px-2.5 py-1 rounded">
          {course.code}
        </span>
      </div>

      <div className="p-5 flex flex-col justify-between h-[220px]">
        <div>
          <h3 className="text-gray-900 font-semibold text-base mb-1">{course.name}</h3>
          {course.description && <p className="text-gray-600 text-sm mb-3">{course.description}</p>}

          <p className="text-gray-600 text-sm mb-2">{instructor}</p>

          <div className="space-y-2 text-sm text-gray-600">
            {schedule && (
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>{schedule}</span>
              </div>
            )}

            {room && (
              <div className="flex items-center gap-2">
                <MapPin size={16} />
                <span>{room}</span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <Users size={16} />
              <span>{enrolledCount}/{capacity} sinh viên</span>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <Link href={ROUTES.COURSE_DETAIL(String(course.id))} className="block text-center bg-black text-white rounded-md py-2">
            Vào lớp học
          </Link>
        </div>
      </div>
    </article>
  );
}
