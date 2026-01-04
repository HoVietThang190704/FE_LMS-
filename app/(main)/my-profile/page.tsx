'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { User, BookOpen, GraduationCap, Edit, Plus, ChevronRight } from 'lucide-react';
import { useCurrentUser } from '@/app/hooks/useCurrentUser';
import { getMyProfile, getMyCreatedCourses, getMyEnrolledCourses } from '@/lib/services/profile/profile.service';
import type { User as UserType } from '@/lib/types/profile';
import type { TeacherCourse, EnrolledCourse } from '@/lib/services/profile/profile.service';
import { getMessages, DEFAULT_LOCALE } from '@/app/i18n';
import { ROUTES } from '@/lib/shared/constants/routeres';

export default function MyProfilePage() {
  const { user: currentUser } = useCurrentUser();
  const [profile, setProfile] = useState<UserType | null>(null);
  const [createdCourses, setCreatedCourses] = useState<TeacherCourse[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'created' | 'enrolled'>('created');
  
  const messages = getMessages(DEFAULT_LOCALE) as Record<string, Record<string, string>>;

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [profileData, created, enrolled] = await Promise.all([
          getMyProfile(),
          getMyCreatedCourses(),
          getMyEnrolledCourses()
        ]);
        
        setProfile(profileData);
        setCreatedCourses(created);
        setEnrolledCourses(enrolled);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        setLoading(false);
      }
    }

    if (currentUser) {
      fetchData();
    }
  }, [currentUser]);

  const isTeacher = profile?.role === 'teacher' || profile?.role === 'admin';

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">{messages.myProfile?.notLoggedIn || 'Vui lòng đăng nhập để xem hồ sơ'}</p>
          <Link href={ROUTES.LOGIN} className="text-blue-600 hover:underline">
            {messages.userMenu?.login || 'Đăng nhập'}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="relative">
              {profile.profile?.avatarUrl ? (
                <Image
                  src={profile.profile.avatarUrl}
                  alt={profile.fullName || 'Avatar'}
                  width={120}
                  height={120}
                  className="rounded-full object-cover border-4 border-blue-100"
                />
              ) : (
                <div className="w-[120px] h-[120px] bg-blue-600 rounded-full flex items-center justify-center border-4 border-blue-100">
                  <User size={48} className="text-white" />
                </div>
              )}
            </div>

            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                {profile.fullName || profile.email}
              </h1>
              <p className="text-gray-600 mb-2">{profile.email}</p>
              <div className="flex flex-wrap justify-center sm:justify-start gap-2 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  isTeacher ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {profile.role === 'teacher' 
                    ? (messages.myProfile?.teacher || 'Giảng viên')
                    : profile.role === 'admin'
                    ? (messages.myProfile?.admin || 'Quản trị viên')
                    : (messages.myProfile?.student || 'Học viên')
                  }
                </span>
                {profile.isVerified && (
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
                    {messages.myProfile?.verified || 'Đã xác minh'}
                  </span>
                )}
              </div>
              {profile.profile?.bio && (
                <p className="text-gray-600 text-sm max-w-lg">{profile.profile.bio}</p>
              )}
            </div>

            <Link
              href={ROUTES.SETTINGS_PROFILE}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Edit size={16} />
              <span>{messages.myProfile?.editProfile || 'Chỉnh sửa'}</span>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <div className="flex">
              {isTeacher && (
                <button
                  onClick={() => setActiveTab('created')}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'created'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <BookOpen size={18} />
                  <span>{messages.myProfile?.createdCourses || 'Khóa học đã tạo'}</span>
                  <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                    {createdCourses.length}
                  </span>
                </button>
              )}
              <button
                onClick={() => setActiveTab('enrolled')}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'enrolled'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <GraduationCap size={18} />
                <span>{messages.myProfile?.enrolledCourses || 'Khóa học đang học'}</span>
                <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                  {enrolledCourses.length}
                </span>
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'created' && isTeacher ? (
              <CreatedCoursesTab courses={createdCourses} messages={messages} />
            ) : (
              <EnrolledCoursesTab courses={enrolledCourses} messages={messages} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function CreatedCoursesTab({ 
  courses, 
  messages 
}: { 
  courses: TeacherCourse[]; 
  messages: Record<string, Record<string, string>>;
}) {
  if (courses.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen size={48} className="mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500 mb-4">{messages.myProfile?.noCreatedCourses || 'Bạn chưa tạo khóa học nào'}</p>
        <Link
          href="/courses/create"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} />
          <span>{messages.myProfile?.createCourse || 'Tạo khóa học mới'}</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <div
          key={course.id}
          className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
        >
          {course.image && (
            <div className="h-40 relative">
              <Image
                src={course.image}
                alt={course.name}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-medium text-gray-500 bg-gray-200 px-2 py-0.5 rounded">
                {course.code}
              </span>
              <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                course.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
              }`}>
                {course.status === 'active' 
                  ? (messages.courseDetail?.active || 'Đang hoạt động')
                  : (messages.courseDetail?.archived || 'Đã lưu trữ')
                }
              </span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{course.name}</h3>
            {course.description && (
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{course.description}</p>
            )}
            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
              <span>{course.enrolled || 0}/{course.capacity || 60} {messages.courseCard?.students || 'sinh viên'}</span>
            </div>
            <div className="flex gap-2">
              <Link
                href={`/my-profile/courses/${course.id}/exercises`}
                className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
              >
                <span>{messages.myProfile?.manageExercises || 'Quản lý bài tập'}</span>
                <ChevronRight size={16} />
              </Link>
              <Link
                href={`/courses/${course.id}`}
                className="px-3 py-2 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 transition-colors"
              >
                {messages.myProfile?.view || 'Xem'}
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function EnrolledCoursesTab({ 
  courses, 
  messages 
}: { 
  courses: EnrolledCourse[]; 
  messages: Record<string, Record<string, string>>;
}) {
  if (courses.length === 0) {
    return (
      <div className="text-center py-12">
        <GraduationCap size={48} className="mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500 mb-4">{messages.myProfile?.noEnrolledCourses || 'Bạn chưa đăng ký khóa học nào'}</p>
        <Link
          href={ROUTES.COURSES}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <span>{messages.myProfile?.exploreCourses || 'Khám phá khóa học'}</span>
          <ChevronRight size={18} />
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((enrollment) => (
        <div
          key={enrollment.id}
          className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
        >
          {enrollment.course.image && (
            <div className="h-40 relative">
              <Image
                src={enrollment.course.image}
                alt={enrollment.course.name}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-medium text-gray-500 bg-gray-200 px-2 py-0.5 rounded">
                {enrollment.course.code}
              </span>
              <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                enrollment.status === 'approved' 
                  ? 'bg-green-100 text-green-700' 
                  : enrollment.status === 'pending'
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-red-100 text-red-700'
              }`}>
                {enrollment.status === 'approved' 
                  ? (messages.myProfile?.approved || 'Đã duyệt')
                  : enrollment.status === 'pending'
                  ? (messages.myProfile?.pending || 'Chờ duyệt')
                  : (messages.myProfile?.rejected || 'Bị từ chối')
                }
              </span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{enrollment.course.name}</h3>
            {enrollment.course.description && (
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{enrollment.course.description}</p>
            )}
            {enrollment.course.instructor && (
              <p className="text-sm text-gray-500 mb-4">
                {messages.courseDetail?.instructor || 'Giảng viên'}: {enrollment.course.instructor}
              </p>
            )}
            <div className="flex gap-2">
              {enrollment.status === 'approved' && (
                <Link
                  href={`/classroom/${enrollment.course.id}`}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <span>{messages.myProfile?.doExercises || 'Làm bài tập'}</span>
                  <ChevronRight size={16} />
                </Link>
              )}
              <Link
                href={`/courses/${enrollment.course.id}`}
                className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                  enrollment.status === 'approved' 
                    ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    : 'flex-1 bg-gray-200 text-gray-700 hover:bg-gray-300 text-center'
                }`}
              >
                {messages.myProfile?.view || 'Xem'}
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
