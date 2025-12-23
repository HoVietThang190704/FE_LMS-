import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, MapPin, Users } from 'lucide-react';
import type { Course } from '@/lib/api/courses';
import { createTranslator } from '@/lib/shared/utils/translator';
import { ROUTES } from '@/lib/shared/constants/routeres';

interface Props {
  course: Course;
  enrolled?: boolean;
  messages?: Record<string, unknown>;
  locale?: 'en' | 'vi';
}

export default function CourseCard({ course, enrolled = false, messages = {}, locale = 'vi' }: Props) {
  const t = createTranslator(messages || {});
  const credits = course.credits ?? 3;
  const instructor = course.instructor ?? t('courseCard.noInstructor','Chưa cập nhật');
  const schedule = course.schedule ?? '';
  const room = course.room ?? '';
  const enrolledCount = course.enrolled ?? 0;
  const capacity = course.capacity ?? 60;

  const rawImage = course.image?.trim();
  const imageSrc = rawImage
    ? rawImage.startsWith('http') || rawImage.startsWith('/')
      ? rawImage
      : `/images/demo/${rawImage}`
    : `/images/demo/default.svg`;

  return (
    <Link href={ROUTES.COURSE_DETAIL(String(course.id))} className="block">
      <article className="bg-white rounded-3xl gap-4 border border-gray-200 hover:shadow-md transition-shadow overflow-hidden cursor-pointer">
        <div className="relative h-44 w-full bg-gray-100">
          <Image
            src={imageSrc}
            alt={course.name}
            fill
            className="object-cover"
          />

          <span className={`absolute top-3 left-3 text-xs font-semibold px-2 py-1 rounded-3xl ${enrolled ? 'bg-amber-900 text-white' : 'bg-white text-gray-700'}`}>
            {enrolled ? t('courseCard.registered','Đã đăng ký') : t('courseCard.available','Có thể đăng ký')}
          </span>

          <div className="absolute top-3 right-3 text-sm text-white bg-black bg-opacity-50 rounded-3xl px-2 py-1">
            {credits} {t('courseCard.creditsShort','tc')}
          </div>

          <span className="absolute left-3 bottom-3 bg-blue-50 text-blue-600 text-xs font-semibold px-2.5 py-1 rounded">
            {course.code}
          </span>
        </div>

        <div className="p-5 flex flex-col justify-between min-h-[260px]">
          <div>
            <h3 className="text-gray-900 font-semibold text-base mb-1">{course.name}</h3>
            {course.description && <p className="text-gray-600 text-sm mb-3">{course.description}</p>}

      <div className="p-5 flex flex-col justify-between min-h-[220px]">
        <div>
          <h3 className="text-gray-900 font-semibold text-base mb-1 break-words">{course.name}</h3>
          {course.description && <p className="text-gray-600 text-sm mb-3 break-words">{course.description}</p>}

          <p className="text-gray-600 text-sm mb-2 break-words">{instructor}</p>

              {room && (
                <div className="flex items-center gap-2">
                  <MapPin size={16} />
                  <span>{room}</span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Users size={16} />
              <span>{enrolledCount}/{capacity} {t('courseCard.students','sinh viên')}</span>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <div className="block text-center bg-black text-white rounded-md py-2">
              {t('courseCard.enter','Vào lớp học')}
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
