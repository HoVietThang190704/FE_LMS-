'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, Edit, Trash2, FileText, Code, ChevronDown, ChevronUp, BookOpen, Link as LinkIcon, Clock, FileUp } from 'lucide-react';
import { getQuizzesByCourse, getPracticesByCourse, deleteQuiz, deletePractice } from '@/lib/services/profile/profile.service';
import { getLessonsByCourse, deleteLesson } from '@/lib/services/lessons/lessons.service';
import type { QuizExercise, PracticeExercise } from '@/lib/types/profile';
import type { ClassroomLesson, ClassroomResource } from '@/lib/types/classroom';
import { getMessages, DEFAULT_LOCALE, resolveMessage } from '@/app/i18n';

export default function CourseExercisesPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  
  const [quizzes, setQuizzes] = useState<QuizExercise[]>([]);
  const [practices, setPractices] = useState<PracticeExercise[]>([]);
  const [lessons, setLessons] = useState<ClassroomLesson[]>([]);
  const [resources, setResources] = useState<ClassroomResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<'content' | 'resources' | 'quiz' | 'practice' | null>('content');
  const [deleting, setDeleting] = useState<string | null>(null);
  
  const messages = getMessages(DEFAULT_LOCALE) as Record<string, Record<string, string>>;

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [quizData, practiceData, lessonData] = await Promise.all([
          getQuizzesByCourse(courseId),
          getPracticesByCourse(courseId),
          getLessonsByCourse(courseId)
        ]);
        setQuizzes(quizData);
        setPractices(practiceData);
        setLessons(lessonData);
        
        // Extract all resources from lessons
        const allResources = lessonData.flatMap((lesson) =>
          (lesson.resources || []).map((res) => ({
            ...res,
            lessonId: lesson.id,
            lessonTitle: lesson.title,
            week: lesson.week,
          }))
        );
        setResources(allResources);
      } catch (error) {
        console.error('Error fetching exercises:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [courseId]);

  const handleDeleteQuiz = async (quizId: string) => {
    if (!confirm(messages.exercises?.confirmDelete || 'Bạn có chắc muốn xóa bài tập này?')) return;
    
    setDeleting(quizId);
    const success = await deleteQuiz(quizId);
    if (success) {
      setQuizzes(prev => prev.filter(q => q.id !== quizId));
    }
    setDeleting(null);
  };

  const handleDeletePractice = async (practiceId: string) => {
    if (!confirm(messages.exercises?.confirmDelete || 'Bạn có chắc muốn xóa bài tập này?')) return;
    
    setDeleting(practiceId);
    const success = await deletePractice(practiceId);
    if (success) {
      setPractices(prev => prev.filter(p => p.id !== practiceId));
    }
    setDeleting(null);
  };

  const handleDeleteLesson = async (lessonId: string) => {
    if (!confirm(messages.exercises?.confirmDelete || 'Bạn có chắc muốn xóa nội dung này?')) return;
    
    setDeleting(lessonId);
    try {
      await deleteLesson(courseId, lessonId);
      setLessons(prev => prev.filter(l => l.id !== lessonId));
      setResources(prev => prev.filter(r => r.lessonId !== lessonId));
    } catch (error) {
      console.error('Error deleting lesson:', error);
    }
    setDeleting(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link
            href="/my-profile"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft size={20} />
            <span>{messages.exercises?.backToProfile || 'Quay lại hồ sơ'}</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            {messages.exercises?.manageExercises || 'Quản lý bài tập'}
          </h1>
          <p className="text-gray-600 mt-1">
            {messages.exercises?.courseExercisesDescription || 'Tạo và quản lý nội dung, tài nguyên và bài tập cho khóa học'}
          </p>
        </div>

        {/* Content Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <button
            onClick={() => setActiveSection(activeSection === 'content' ? null : 'content')}
            className="w-full flex items-center justify-between p-6 text-left"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookOpen size={24} className="text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Nội dung bài học</h2>
                <p className="text-sm text-gray-500">{lessons.length} bài học</p>
              </div>
            </div>
            {activeSection === 'content' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>

          {activeSection === 'content' && (
            <div className="border-t border-gray-200 p-6">
              <div className="flex justify-end mb-4">
                <Link
                  href={`/my-profile/courses/${courseId}/exercises/content/create`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus size={18} />
                  <span>Tạo nội dung bài học</span>
                </Link>
              </div>

              {lessons.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Chưa có nội dung bài học nào
                </div>
              ) : (
                <div className="space-y-3">
                  {lessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-gray-500 bg-gray-200 px-2 py-0.5 rounded">
                            Tuần {lesson.week}
                          </span>
                          <h3 className="font-medium text-gray-900">{lesson.title}</h3>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          {lesson.durationMinutes && (
                            <span className="flex items-center gap-1">
                              <Clock size={14} /> {lesson.durationMinutes} phút
                            </span>
                          )}
                          <span>{lesson.resources?.length || 0} tài nguyên</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDeleteLesson(lesson.id)}
                          disabled={deleting === lesson.id}
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Resources Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <button
            onClick={() => setActiveSection(activeSection === 'resources' ? null : 'resources')}
            className="w-full flex items-center justify-between p-6 text-left"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <LinkIcon size={24} className="text-orange-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Tài nguyên</h2>
                <p className="text-sm text-gray-500">{resources.length} tài nguyên</p>
              </div>
            </div>
            {activeSection === 'resources' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>

          {activeSection === 'resources' && (
            <div className="border-t border-gray-200 p-6">
              <div className="flex justify-end mb-4">
                <Link
                  href={`/my-profile/courses/${courseId}/exercises/resources/create`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  <Plus size={18} />
                  <span>Thêm tài nguyên</span>
                </Link>
              </div>

              {resources.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Chưa có tài nguyên nào
                </div>
              ) : (
                <div className="space-y-3">
                  {resources.map((resource, idx) => (
                    <a
                      key={`${resource.lessonId}-${idx}`}
                      href={resource.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {resource.type === 'link' ? (
                          <LinkIcon size={20} className="text-blue-600" />
                        ) : (
                          <FileUp size={20} className="text-gray-600" />
                        )}
                        <div>
                          <h3 className="font-medium text-gray-900">{resource.name}</h3>
                          <p className="text-sm text-gray-500">
                            Tuần {resource.week} · {resource.lessonTitle}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
                        {resource.type === 'link' ? 'Link' : 'File'}
                      </span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Quiz Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <button
            onClick={() => setActiveSection(activeSection === 'quiz' ? null : 'quiz')}
            className="w-full flex items-center justify-between p-6 text-left"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FileText size={24} className="text-purple-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {messages.exercises?.quizExercises || 'Bài tập trắc nghiệm'}
                </h2>
                <p className="text-sm text-gray-500">
                  {quizzes.length} {messages.exercises?.exercises || 'bài tập'}
                </p>
              </div>
            </div>
            {activeSection === 'quiz' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>

          {activeSection === 'quiz' && (
            <div className="border-t border-gray-200 p-6">
              <div className="flex justify-end mb-4">
                <Link
                  href={`/my-profile/courses/${courseId}/exercises/quiz/create`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Plus size={18} />
                  <span>{resolveMessage(messages.exercises?.createQuiz, 'Tạo bài trắc nghiệm')}</span>
                </Link>
              </div>

              {quizzes.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {messages.exercises?.noQuizzes || 'Chưa có bài tập trắc nghiệm nào'}
                </div>
              ) : (
                <div className="space-y-3">
                  {quizzes.map((quiz) => (
                    <div
                      key={quiz.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-gray-500 bg-gray-200 px-2 py-0.5 rounded">
                            #{quiz.order}
                          </span>
                          <h3 className="font-medium text-gray-900">{quiz.title}</h3>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>{quiz.questions.length} {messages.exercises?.questions || 'câu hỏi'}</span>
                          <span>{messages.exercises?.passingScore || 'Điểm đạt'}: {quiz.passingScore}%</span>
                          {quiz.timeLimit && (
                            <span>{quiz.timeLimit} {messages.exercises?.minutes || 'phút'}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/my-profile/courses/${courseId}/exercises/quiz/${quiz.id}/edit`}
                          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit size={18} />
                        </Link>
                        <button
                          onClick={() => handleDeleteQuiz(quiz.id)}
                          disabled={deleting === quiz.id}
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <button
            onClick={() => setActiveSection(activeSection === 'practice' ? null : 'practice')}
            className="w-full flex items-center justify-between p-6 text-left"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Code size={24} className="text-green-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {messages.exercises?.practiceExercises || 'Bài tập thực hành'}
                </h2>
                <p className="text-sm text-gray-500">
                  {practices.length} {messages.exercises?.exercises || 'bài tập'}
                </p>
              </div>
            </div>
            {activeSection === 'practice' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>

          {activeSection === 'practice' && (
            <div className="border-t border-gray-200 p-6">
              <div className="flex justify-end mb-4">
                <Link
                  href={`/my-profile/courses/${courseId}/exercises/practice/create`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Plus size={18} />
                  <span>{resolveMessage(messages.exercises?.createPractice, 'Tạo bài thực hành')}</span>
                </Link>
              </div>

              {practices.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {messages.exercises?.noPractices || 'Chưa có bài tập thực hành nào'}
                </div>
              ) : (
                <div className="space-y-3">
                  {practices.map((practice) => (
                    <div
                      key={practice.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-gray-500 bg-gray-200 px-2 py-0.5 rounded">
                            #{practice.order}
                          </span>
                          <h3 className="font-medium text-gray-900">{practice.title}</h3>
                          <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                            practice.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                            practice.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {practice.difficulty === 'easy' ? (messages.exercises?.easy || 'Dễ') :
                             practice.difficulty === 'medium' ? (messages.exercises?.medium || 'Trung bình') :
                             (messages.exercises?.hard || 'Khó')}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>{practice.testCases.length} test cases</span>
                          <span>{practice.language}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/my-profile/courses/${courseId}/exercises/practice/${practice.id}/edit`}
                          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit size={18} />
                        </Link>
                        <button
                          onClick={() => handleDeletePractice(practice.id)}
                          disabled={deleting === practice.id}
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
