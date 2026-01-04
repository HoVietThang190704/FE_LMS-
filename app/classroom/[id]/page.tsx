import React from 'react';
import { cookies } from 'next/headers';
import { Clock, Download, MapPin, Users } from 'lucide-react';
import Link from 'next/link';
import { getMessages } from '@/app/i18n';
import { createTranslator } from '@/lib/shared/utils/translator';
import { ROUTES } from '@/lib/shared/constants/routeres';
import ClassroomTabs from '@/components/classroom/ClassroomTabs';
import ClassroomProgress from '@/components/classroom/ClassroomProgress';
import { getClassroom } from '@/lib/services/classroom/classroom.service';
import type { ClassroomLesson } from '@/lib/types/classroom';

interface PageProps {
  params: Promise<{ id: string }>;
}

type Week = {
  title: string;
  week: number;
  lessons: ClassroomLesson[];
};

export default async function ClassroomPage({ params }: PageProps) {
  const { id } = await params;
  const locale: 'en' | 'vi' = 'vi';
  const messages = getMessages(locale);
  const t = createTranslator(messages);
  
  // Lấy token từ cookies để gửi kèm API request (cho Server Component)
  const cookieStore = await cookies();
  const token = cookieStore.get('edu.lms.accessToken')?.value || null;
  
  const classroom = await getClassroom(id, { token });

  const lessons = classroom?.lessons || [];
  const resources = classroom?.resources || [];
  const groupedWeeks = lessons.reduce<Map<number, ClassroomLesson[]>>((acc, lesson) => {
    const current = acc.get(lesson.week) || [];
    current.push(lesson);
    acc.set(lesson.week, current);
    return acc;
  }, new Map());

  const weeks: Week[] = Array.from(groupedWeeks.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([weekNumber, lessonList]) => ({
      title: `Tuần ${weekNumber}`,
      week: weekNumber,
      lessons: lessonList.sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    }));

  const progress = classroom?.progress ?? 0;
  const progressDetails = classroom?.progressDetails;
  const courseCode = classroom?.course.code || id;
  const courseName = classroom?.course.name || t('classroom.courseName', 'Lớp học');
  const instructor = classroom?.course.instructor || t('classroom.instructorUnknown', 'Chưa cập nhật giảng viên');
  const email = t('classroom.emailUnknown', 'Chưa cập nhật email');
  const schedule = classroom?.course.schedule || t('classroom.scheduleUnknown', 'Chưa cập nhật lịch học');
  const room = classroom?.course.room || t('classroom.roomUnknown', 'Chưa cập nhật phòng học');
  const credits = classroom?.course.credits || 0;
  const totalLessons = classroom?.course.totalLessons || lessons.length;
  const description = classroom?.course.description || t('classroom.descriptionFallback', 'Khóa học chưa có mô tả.');

  return (
    <div className="min-h-screen bg-gray-50" data-locale={locale}>
      <div className="max-w-6xl mx-auto px-6 py-8">
        <Link href={ROUTES.HOME} className="text-sm text-gray-500 hover:underline flex items-center gap-2 mb-4">
          ← {t('nav.home', 'Trang chủ')}
        </Link>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="text-xs font-semibold text-purple-700 bg-purple-50 px-2 py-1 rounded-full inline-block mb-2">{courseCode}</div>
              <h1 className="text-2xl font-bold text-gray-900">{courseName}</h1>
              <p className="text-gray-600 mt-1">{instructor} · {email}</p>
              <p className="text-sm text-gray-600 mt-2 max-w-3xl">{description}</p>
            </div>
            <div className="w-full md:w-64">
              <ClassroomProgress
                courseId={id}
                totalLessons={totalLessons}
                initialProgress={progress}
                progressDetails={progressDetails}
              />
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-700">
            <div className="flex items-center gap-2"><Clock size={16} /> {schedule}</div>
            <div className="flex items-center gap-2"><MapPin size={16} /> {t('classroom.room', 'Phòng')}: {room}</div>
            <div className="flex items-center gap-2"><Users size={16} /> {t('classroom.credits', 'Số tín chỉ')}: {credits}</div>
          </div>

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ClassroomTabs
                weeks={weeks}
                resources={resources}
                courseId={id}
                messages={messages}
              />
            </div>

            <div className="space-y-4">
              <div className="border border-gray-200 rounded-xl p-4 bg-white">
                <h4 className="font-semibold text-gray-900 mb-3">{t('classroom.courseInfo', 'Thông tin môn học')}</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>{t('classroom.instructor', 'Giảng viên')}: {instructor}</li>
                  <li>Email: {email}</li>
                  <li>{t('classroom.credits', 'Số tín chỉ')}: {credits}</li>
                  <li>{t('classroom.schedule', 'Lịch học')}: {schedule}</li>
                  <li>{t('classroom.room', 'Phòng học')}: {room}</li>
                  <li>{t('classroom.totalLessons', 'Tổng số bài học')}: {totalLessons}</li>
                </ul>
                <button className="w-full mt-4 bg-black text-white rounded-lg py-2 flex items-center justify-center gap-2 text-sm font-semibold">
                  <Download size={16} /> {t('classroom.downloadAll', 'Tải tất cả tài liệu')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
