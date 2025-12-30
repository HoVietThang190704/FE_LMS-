import React from 'react';
import { Clock, Download, MapPin, Users } from 'lucide-react';
import Link from 'next/link';
import { getMessages } from '@/app/i18n';
import { createTranslator } from '@/lib/shared/utils/translator';
import { ROUTES } from '@/lib/shared/constants/routeres';
import ClassroomTabs from '@/components/classroom/ClassroomTabs';

interface PageProps {
  params: Promise<{ id: string }>;
}

type Lesson = {
  title: string;
  duration: string;
  completed: boolean;
};

type Week = {
  title: string;
  lessons: Lesson[];
};

const mockWeeks: Week[] = [
  {
    title: 'Tuần 1-2: Mảng và Chuỗi',
    lessons: [
      { title: 'Mảng cơ bản', duration: '14:20', completed: true },
      { title: 'Kỹ thuật Two Pointers', duration: '16:45', completed: true },
      { title: 'Xử lý chuỗi', duration: '15:30', completed: true },
    ],
  },
  {
    title: 'Tuần 3-4: Danh sách liên kết',
    lessons: [
      { title: 'Danh sách liên kết đơn', duration: '18:15', completed: true },
      { title: 'Danh sách liên kết kép', duration: '16:30', completed: false },
    ],
  },
];

export default async function ClassroomPage({ params }: PageProps) {
  const { id } = await params;
  void id;
  const locale: 'en' | 'vi' = 'vi';
  const messages = getMessages(locale);
  const t = createTranslator(messages);

  const progress = 42;
  const courseCode = 'IT3230';
  const courseName = t('classroom.courseName', 'Cấu trúc dữ liệu và Giải thuật');
  const instructor = 'PGS.TS. Trần Văn Minh';
  const email = 'minh.tv@university.edu.vn';
  const schedule = 'Thứ 5, 13:00-15:00';
  const room = 'D3-301';
  const credits = 4;
  const totalLessons = 5;
  const exercises = await (await import('@/lib/services/exercises/exercise.service')).getExercises();

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
              <p className="text-sm text-gray-600 mt-2 max-w-3xl">
                Nghiên cứu các cấu trúc dữ liệu và giải thuật cơ bản, phân tích độ phức tạp.
              </p>
            </div>
            <div className="w-full md:w-64">
              <div className="flex items-center justify-between text-sm text-gray-700 mb-2">
                <span>{t('stats.learningProgress', 'Tiến độ học tập')}</span>
                <span className="font-semibold">{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="h-2 rounded-full bg-black" style={{ width: `${progress}%` }} />
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-700">
            <div className="flex items-center gap-2"><Clock size={16} /> {schedule}</div>
            <div className="flex items-center gap-2"><MapPin size={16} /> {t('classroom.room', 'Phòng')}: {room}</div>
            <div className="flex items-center gap-2"><Users size={16} /> {t('classroom.credits', 'Số tín chỉ')}: {credits}</div>
          </div>

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              {/* Tabs: Nội dung / Tài nguyên / Bài tập */}
              <ClassroomTabs weeks={mockWeeks} exercises={exercises} messages={messages} />
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
