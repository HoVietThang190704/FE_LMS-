import React from 'react';
import StatsCard from '@/components/card/StatsCard';
import ClassCard from '@/components/card/ClassCard';
import AssignmentCard from '@/components/card/AssignmentCard';
import { BookOpen, Clock, Trophy, TrendingUp, Bell } from 'lucide-react';
import type { Stats, Course, Assignment, Notification } from '@/lib/types/home';

type HomeUIProps = {
  stats: Stats;
  classes: Course[];
  assignments: Assignment[];
  notifications: Notification[];
};

export default function HomeUI({ stats, classes, assignments, notifications }: HomeUIProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Xin chào, Nguyễn Văn A!</h1>
          <p className="text-gray-600">Chào mừng bạn trở lại với hệ thống học tập</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Môn học đang ký"
            value={`${stats.enrolledCourses} môn`}
            icon={BookOpen}
            bgColor="bg-blue-50"
            iconColor="text-blue-600"
          />
          <StatsCard
            title="Bài tập chưa nộp"
            value={stats.pendingAssignments}
            icon={Clock}
            bgColor="bg-yellow-50"
            iconColor="text-yellow-600"
          />
          <StatsCard
            title="Điểm trung bình"
            value={stats.averageGrade}
            icon={Trophy}
            bgColor="bg-green-50"
            iconColor="text-green-600"
          />
          <StatsCard
            title="Tiến độ học tập"
            value={`${stats.learningProgress}%`}
            icon={TrendingUp}
            bgColor="bg-purple-50"
            iconColor="text-purple-600"
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Lớp học của tôi</h2>
              <div className="space-y-4">
                {classes.map((classItem) => (
                  <ClassCard key={classItem.id} {...classItem} />
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Bài tập sắp hết hạn</h2>
              <div className="space-y-4">
                {assignments.map((assignment) => (
                  <AssignmentCard key={assignment.id} {...assignment} />
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-6">
                <Bell size={20} className="text-gray-900" />
                <h2 className="text-xl font-bold text-gray-900">Thông báo</h2>
              </div>
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div key={notification.id} className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                    <h4 className="text-sm font-semibold text-gray-900 mb-1">{notification.title}</h4>
                    <p className="text-xs text-gray-600 mb-1">{notification.description}</p>
                    <p className="text-xs text-gray-400">{notification.time}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
