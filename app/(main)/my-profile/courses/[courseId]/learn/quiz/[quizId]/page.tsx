'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Clock, CheckCircle, AlertCircle, ChevronLeft, ChevronRight, Send } from 'lucide-react';
import { getQuizForStudent, submitQuiz, getMyQuizSubmissions } from '@/lib/services/profile/profile.service';
import type { QuizExercise, QuizSubmission } from '@/lib/types/profile';
import { getMessages, DEFAULT_LOCALE } from '@/app/i18n';

interface Answer {
  questionId: string;
  selectedOptions: string[];
}

export default function TakeQuizPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;
  const quizId = params.quizId as string;

  const [quiz, setQuiz] = useState<QuizExercise | null>(null);
  const [previousSubmissions, setPreviousSubmissions] = useState<QuizSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<QuizSubmission | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [startedAt, setStartedAt] = useState<Date | null>(null);

  const messages = getMessages(DEFAULT_LOCALE) as Record<string, Record<string, string>>;

  useEffect(() => {
    async function fetchQuiz() {
      try {
        const [quizData, submissions] = await Promise.all([
          getQuizForStudent(quizId),
          getMyQuizSubmissions(quizId)
        ]);
        setQuiz(quizData);
        setPreviousSubmissions(submissions);

        setAnswers((quizData?.questions || []).map(q => ({
          questionId: q.id,
          selectedOptions: []
        })));

        if (quizData?.timeLimit) {
          setTimeRemaining(quizData.timeLimit * 60);
        }

        setStartedAt(new Date());
      } catch (error) {
        console.error('Error fetching quiz:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchQuiz();
  }, [quizId]);

  useEffect(() => {
    if (timeRemaining === null || timeRemaining <= 0 || showResult) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev === null || prev <= 0) return prev;
        if (prev === 1) {
          handleSubmit();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, showResult]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOptionSelect = (questionId: string, optionId: string, isMultiple: boolean) => {
    setAnswers(prev => prev.map(answer => {
      if (answer.questionId !== questionId) return answer;
      
      if (isMultiple) {
        const isSelected = answer.selectedOptions.includes(optionId);
        return {
          ...answer,
          selectedOptions: isSelected
            ? answer.selectedOptions.filter(id => id !== optionId)
            : [...answer.selectedOptions, optionId]
        };
      } else {
        return {
          ...answer,
          selectedOptions: [optionId]
        };
      }
    }));
  };

  const handleSubmit = useCallback(async () => {
    if (!quiz || submitting) return;

    setSubmitting(true);
    try {
      const payload = answers.map(a => ({ questionId: a.questionId, selectedOptionId: a.selectedOptions[0] || '' }));
      const submission = await submitQuiz(quizId, payload, startedAt || new Date());
      setResult(submission);
      setShowResult(true);
    } catch (error) {
      console.error('Error submitting quiz:', error);
      alert('Có lỗi khi nộp bài');
    } finally {
      setSubmitting(false);
    }
  }, [quiz, quizId, answers, submitting]);

  const getAnsweredCount = () => {
    return answers.filter(a => a.selectedOptions.length > 0).length;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Quiz not found</p>
      </div>
    );
  }

  if (showResult && result) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <div className={`w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center ${
              result.passed ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {result.passed ? (
                <CheckCircle size={40} className="text-green-600" />
              ) : (
                <AlertCircle size={40} className="text-red-600" />
              )}
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {result.passed 
                ? (messages.quiz?.passed || 'Chúc mừng! Bạn đã vượt qua!')
                : (messages.quiz?.failed || 'Chưa đạt yêu cầu')
              }
            </h1>

            <p className="text-gray-600 mb-8">
              {result.passed 
                ? (messages.quiz?.passedMessage || 'Bạn đã hoàn thành xuất sắc bài kiểm tra này.')
                : (messages.quiz?.failedMessage || 'Hãy ôn tập và thử lại nhé!')
              }
            </p>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-2xl font-bold text-gray-900">{result.score}</p>
                <p className="text-sm text-gray-500">{messages.quiz?.correctAnswers || 'Câu đúng'}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-2xl font-bold text-gray-900">{result.answers.length}</p>
                <p className="text-sm text-gray-500">{messages.quiz?.totalQuestions || 'Tổng câu hỏi'}</p>
              </div>
              <div className={`rounded-lg p-4 ${
                result.passed ? 'bg-green-50' : 'bg-red-50'
              }`}>
                <p className={`text-2xl font-bold ${
                  result.passed ? 'text-green-600' : 'text-red-600'
                }`}>{result.percentage.toFixed(0)}%</p>
                <p className="text-sm text-gray-500">{messages.quiz?.score || 'Điểm số'}</p>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <Link
                href={`/my-profile/courses/${courseId}/learn`}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                {messages.quiz?.backToExercises || 'Quay lại danh sách'}
              </Link>
              {!result.passed && (
                <button
                  onClick={() => {
                    setShowResult(false);
                    setResult(null);
                    setCurrentQuestionIndex(0);
                    setAnswers(quiz.questions.map(q => ({
                      questionId: q.id,
                      selectedOptions: []
                    })));
                    if (quiz.timeLimit) {
                      setTimeRemaining(quiz.timeLimit * 60);
                    }
                  }}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {messages.quiz?.tryAgain || 'Làm lại'}
                </button>
              )}
            </div>
          </div>

          {previousSubmissions.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 mt-6 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                {messages.quiz?.previousAttempts || 'Các lần làm bài trước'}
              </h3>
              <div className="space-y-2">
                {previousSubmissions.slice(0, 5).map((sub, index) => (
                  <div key={sub.id} className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">
                      {messages.quiz?.attempt || 'Lần'} {previousSubmissions.length - index}
                    </span>
                    <div className="flex items-center gap-4">
                      <span className="text-gray-900">{sub.score}/{sub.answers.length}</span>
                      <span className={`font-medium ${sub.passed ? 'text-green-600' : 'text-red-600'}`}>
                        {sub.percentage.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const currentAnswer = answers[currentQuestionIndex];
  const hasMultipleCorrect = currentQuestion.options.filter(o => o.isCorrect).length > 1;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href={`/my-profile/courses/${courseId}/learn`}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeft size={20} />
              </Link>
              <div>
                <h1 className="font-semibold text-gray-900">{quiz.title}</h1>
                <p className="text-sm text-gray-500">
                  {messages.quiz?.question || 'Câu hỏi'} {currentQuestionIndex + 1}/{quiz.questions.length}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {timeRemaining !== null && (
                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  timeRemaining < 60 ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-700'
                }`}>
                  <Clock size={18} />
                  <span className="font-mono font-medium">{formatTime(timeRemaining)}</span>
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <Send size={18} />
                {messages.quiz?.submit || 'Nộp bài'} ({getAnsweredCount()}/{quiz.questions.length})
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                {messages.quiz?.question || 'Câu hỏi'} {currentQuestionIndex + 1}
              </span>
              <span className="text-sm text-gray-500">
                ({currentQuestion.points} {messages.exercises?.points || 'điểm'})
              </span>
              {hasMultipleCorrect && (
                <span className="text-sm text-orange-600 bg-orange-50 px-2 py-1 rounded">
                  {messages.quiz?.multipleChoice || 'Chọn nhiều đáp án'}
                </span>
              )}
            </div>
            <p className="text-lg text-gray-900">{currentQuestion.question}</p>
          </div>

          <div className="space-y-3">
            {currentQuestion.options.map((option, optIndex) => {
              const isSelected = currentAnswer.selectedOptions.includes(option.id);
              
              return (
                <button
                  key={option.id}
                  onClick={() => handleOptionSelect(currentQuestion.id, option.id, hasMultipleCorrect)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      isSelected
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {String.fromCharCode(65 + optIndex)}
                    </span>
                    <span className={isSelected ? 'text-blue-900' : 'text-gray-700'}>
                      {option.text}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-between mt-6">
          <button
            onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
            disabled={currentQuestionIndex === 0}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50"
          >
            <ChevronLeft size={20} />
            {messages.quiz?.previous || 'Câu trước'}
          </button>

          <div className="flex flex-wrap gap-2 justify-center max-w-md">
            {quiz.questions.map((_, index) => {
              const isAnswered = answers[index].selectedOptions.length > 0;
              const isCurrent = index === currentQuestionIndex;
              
              return (
                <button
                  key={index}
                  onClick={() => setCurrentQuestionIndex(index)}
                  className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                    isCurrent
                      ? 'bg-blue-600 text-white'
                      : isAnswered
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setCurrentQuestionIndex(prev => Math.min(quiz.questions.length - 1, prev + 1))}
            disabled={currentQuestionIndex === quiz.questions.length - 1}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50"
          >
            {messages.quiz?.next || 'Câu sau'}
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
