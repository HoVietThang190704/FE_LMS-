'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Code, ChevronRight, CheckCircle, Clock, FileText } from 'lucide-react';
import { getQuizzesByCourse, getPracticesByCourse, getMyQuizSubmissions, getMyPracticeSubmissions } from '@/lib/services/profile/profile.service';
import { getLessonsByCourse } from '@/lib/services/lessons/lessons.service';
import type { QuizExercise, PracticeExercise, QuizSubmission, PracticeSubmission } from '@/lib/types/profile';
import type { ClassroomLesson } from '@/lib/types/classroom';
import { getMessages, DEFAULT_LOCALE } from '@/app/i18n';

export default function CourseLearningPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  
  const [lessons, setLessons] = useState<ClassroomLesson[]>([]);
  const [quizzes, setQuizzes] = useState<QuizExercise[]>([]);
  const [practices, setPractices] = useState<PracticeExercise[]>([]);
  const [quizSubmissions, setQuizSubmissions] = useState<Record<string, QuizSubmission[]>>({});
  const [practiceSubmissions, setPracticeSubmissions] = useState<Record<string, PracticeSubmission[]>>({});
  const [lessonProgress, setLessonProgress] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  
  const messages = getMessages(DEFAULT_LOCALE) as Record<string, Record<string, string>>;

  // Load lesson progress from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem(`lesson-progress:${courseId}`);
      if (stored) setLessonProgress(JSON.parse(stored));
    } catch {
      // ignore
    }
  }, [courseId]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [lessonData, quizData, practiceData] = await Promise.all([
          getLessonsByCourse(courseId),
          getQuizzesByCourse(courseId),
          getPracticesByCourse(courseId)
        ]);
        
        setLessons(lessonData);
        setQuizzes(quizData);
        setPractices(practiceData);
        const quizSubs: Record<string, QuizSubmission[]> = {};
        const practiceSubs: Record<string, PracticeSubmission[]> = {};

        await Promise.all([
          ...quizData.map(async (quiz) => {
            quizSubs[quiz.id] = await getMyQuizSubmissions(quiz.id);
          }),
          ...practiceData.map(async (practice) => {
            practiceSubs[practice.id] = await getMyPracticeSubmissions(practice.id);
          })
        ]);

        setQuizSubmissions(quizSubs);
        setPracticeSubmissions(practiceSubs);
      } catch (error) {
        console.error('Error fetching exercises:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [courseId]);

  const getLessonStatus = (lessonId: string) => {
    return lessonProgress[lessonId] ? 'completed' : 'not-started';
  };

  const getQuizStatus = (quizId: string) => {
    const subs = quizSubmissions[quizId] || [];
    if (subs.length === 0) return 'not-started';
    const passed = subs.some(s => s.passed);
    return passed ? 'passed' : 'attempted';
  };

  const getPracticeStatus = (practiceId: string) => {
    const subs = practiceSubmissions[practiceId] || [];
    if (subs.length === 0) return 'not-started';
    const passed = subs.some(s => s.passed);
    return passed ? 'passed' : 'attempted';
  };

  const getBestQuizScore = (quizId: string) => {
    const subs = quizSubmissions[quizId] || [];
    if (subs.length === 0) return null;
    return Math.max(...subs.map(s => s.percentage));
  };

  const getBestPracticeScore = (practiceId: string) => {
    const subs = practiceSubmissions[practiceId] || [];
    if (subs.length === 0) return null;
    return Math.max(...subs.map(s => s.percentage));
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link
            href="/my-profile"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft size={20} />
            <span>{messages.exercises?.backToProfile || 'Quay lại hồ sơ'}</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            {messages.learn?.exercisesList || 'Danh sách bài tập'}
          </h1>
          <p className="text-gray-600 mt-1">
            {messages.learn?.description || 'Học nội dung và làm bài tập để củng cố kiến thức'}
          </p>
        </div>

        {/* Lessons Section */}
        {lessons.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText size={24} className="text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Nội dung bài học</h2>
                  <p className="text-sm text-gray-500">
                    {lessons.length} bài học · {Object.keys(lessonProgress).filter(k => lessonProgress[k]).length} đã hoàn thành
                  </p>
                </div>
              </div>
            </div>

            <div className="divide-y divide-gray-100">
              {lessons.map((lesson) => {
                const status = getLessonStatus(lesson.id);
                
                return (
                  <Link
                    key={lesson.id}
                    href={`/my-profile/courses/${courseId}/learn/content/${lesson.id}`}
                    className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        status === 'completed' ? 'bg-green-100' : 'bg-gray-100'
                      }`}>
                        {status === 'completed' ? (
                          <CheckCircle size={20} className="text-green-600" />
                        ) : (
                          <span className="text-gray-500 font-medium">{lesson.order || lesson.week}</span>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                            Tuần {lesson.week}
                          </span>
                          <h3 className="font-medium text-gray-900">{lesson.title}</h3>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                          {lesson.durationMinutes && (
                            <span className="flex items-center gap-1">
                              <Clock size={14} /> {lesson.durationMinutes} phút
                            </span>
                          )}
                          <span>{lesson.resources?.length || 0} tài nguyên</span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight size={20} className="text-gray-400" />
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {quizzes.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <BookOpen size={24} className="text-purple-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {messages.learn?.quizExercises || 'Bài tập trắc nghiệm'}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {quizzes.length} {messages.exercises?.exercises || 'bài tập'}
                  </p>
                </div>
              </div>
            </div>

            <div className="divide-y divide-gray-100">
              {quizzes.map((quiz) => {
                const status = getQuizStatus(quiz.id);
                const bestScore = getBestQuizScore(quiz.id);
                
                return (
                  <Link
                    key={quiz.id}
                    href={`/my-profile/courses/${courseId}/learn/quiz/${quiz.id}`}
                    className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        status === 'passed' ? 'bg-green-100' :
                        status === 'attempted' ? 'bg-yellow-100' :
                        'bg-gray-100'
                      }`}>
                        {status === 'passed' ? (
                          <CheckCircle size={20} className="text-green-600" />
                        ) : status === 'attempted' ? (
                          <Clock size={20} className="text-yellow-600" />
                        ) : (
                          <span className="text-gray-500 font-medium">{quiz.order}</span>
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{quiz.title}</h3>
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                          <span>{quiz.questions.length} {messages.exercises?.questions || 'câu hỏi'}</span>
                          {quiz.timeLimit && (
                            <span>{quiz.timeLimit} {messages.exercises?.minutes || 'phút'}</span>
                          )}
                          {bestScore !== null && (
                            <span className={bestScore >= quiz.passingScore ? 'text-green-600' : 'text-yellow-600'}>
                              {messages.learn?.bestScore || 'Điểm cao nhất'}: {bestScore.toFixed(0)}%
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <ChevronRight size={20} className="text-gray-400" />
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {practices.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Code size={24} className="text-green-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {messages.learn?.practiceExercises || 'Bài tập thực hành'}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {practices.length} {messages.exercises?.exercises || 'bài tập'}
                  </p>
                </div>
              </div>
            </div>

            <div className="divide-y divide-gray-100">
              {practices.map((practice) => {
                const status = getPracticeStatus(practice.id);
                const bestScore = getBestPracticeScore(practice.id);
                
                return (
                  <Link
                    key={practice.id}
                    href={`/my-profile/courses/${courseId}/learn/practice/${practice.id}`}
                    className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        status === 'passed' ? 'bg-green-100' :
                        status === 'attempted' ? 'bg-yellow-100' :
                        'bg-gray-100'
                      }`}>
                        {status === 'passed' ? (
                          <CheckCircle size={20} className="text-green-600" />
                        ) : status === 'attempted' ? (
                          <Clock size={20} className="text-yellow-600" />
                        ) : (
                          <span className="text-gray-500 font-medium">{practice.order}</span>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
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
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                          <span>{practice.language}</span>
                          <span>{practice.testCases.length} test cases</span>
                          {bestScore !== null && (
                            <span className={bestScore >= 100 ? 'text-green-600' : 'text-yellow-600'}>
                              {messages.learn?.bestScore || 'Điểm cao nhất'}: {bestScore.toFixed(0)}%
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <ChevronRight size={20} className="text-gray-400" />
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {quizzes.length === 0 && practices.length === 0 && lessons.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <BookOpen size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">
              {messages.learn?.noExercises || 'Chưa có nội dung nào trong khóa học này'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
