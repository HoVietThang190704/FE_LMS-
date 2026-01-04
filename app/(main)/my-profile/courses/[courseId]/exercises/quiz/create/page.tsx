'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, Trash2, GripVertical } from 'lucide-react';
import { createQuiz } from '@/lib/services/profile/profile.service';
import type { QuizQuestion, QuizOption } from '@/lib/types/profile';
import { getMessages, DEFAULT_LOCALE, resolveMessage } from '@/app/i18n';

function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

export default function CreateQuizPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;
  
  const messages = getMessages(DEFAULT_LOCALE) as Record<string, Record<string, string>>;
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [order, setOrder] = useState(1);
  const [timeLimit, setTimeLimit] = useState<number | undefined>(undefined);
  const [passingScore, setPassingScore] = useState(60);
  const [allowRetake, setAllowRetake] = useState(true);
  const [maxAttempts, setMaxAttempts] = useState<number | undefined>(undefined);
  const [shuffleQuestions, setShuffleQuestions] = useState(false);
  const [shuffleOptions, setShuffleOptions] = useState(false);
  const [showResultsImmediately, setShowResultsImmediately] = useState(true);
  
  const [questions, setQuestions] = useState<QuizQuestion[]>([
    {
      id: generateId(),
      question: '',
      options: [
        { id: generateId(), text: '', isCorrect: true },
        { id: generateId(), text: '', isCorrect: false },
        { id: generateId(), text: '', isCorrect: false },
        { id: generateId(), text: '', isCorrect: false }
      ],
      explanation: '',
      points: 1
    }
  ]);
  
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const addQuestion = () => {
    setQuestions(prev => [...prev, {
      id: generateId(),
      question: '',
      options: [
        { id: generateId(), text: '', isCorrect: true },
        { id: generateId(), text: '', isCorrect: false },
        { id: generateId(), text: '', isCorrect: false },
        { id: generateId(), text: '', isCorrect: false }
      ],
      explanation: '',
      points: 1
    }]);
  };

  const removeQuestion = (questionId: string) => {
    if (questions.length <= 1) return;
    setQuestions(prev => prev.filter(q => q.id !== questionId));
  };

  const updateQuestion = (questionId: string, field: keyof QuizQuestion, value: unknown) => {
    setQuestions(prev => prev.map(q => 
      q.id === questionId ? { ...q, [field]: value } : q
    ));
  };

  const addOption = (questionId: string) => {
    setQuestions(prev => prev.map(q => {
      if (q.id !== questionId) return q;
      return {
        ...q,
        options: [...q.options, { id: generateId(), text: '', isCorrect: false }]
      };
    }));
  };

  const removeOption = (questionId: string, optionId: string) => {
    setQuestions(prev => prev.map(q => {
      if (q.id !== questionId) return q;
      if (q.options.length <= 2) return q;
      return {
        ...q,
        options: q.options.filter(o => o.id !== optionId)
      };
    }));
  };

  const updateOption = (questionId: string, optionId: string, field: keyof QuizOption, value: unknown) => {
    setQuestions(prev => prev.map(q => {
      if (q.id !== questionId) return q;
      return {
        ...q,
        options: q.options.map(o => {
          if (o.id !== optionId) {
            if (field === 'isCorrect' && value === true) {
              return { ...o, isCorrect: false };
            }
            return o;
          }
          return { ...o, [field]: value };
        })
      };
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!title.trim()) {
      setError(messages.exercises?.titleRequired || 'Vui lòng nhập tiêu đề');
      return;
    }

    for (const q of questions) {
      if (!q.question.trim()) {
        setError(messages.exercises?.questionRequired || 'Vui lòng nhập nội dung câu hỏi');
        return;
      }
      if (q.options.filter(o => o.text.trim()).length < 2) {
        setError(messages.exercises?.optionsRequired || 'Mỗi câu hỏi cần ít nhất 2 lựa chọn');
        return;
      }
      if (!q.options.some(o => o.isCorrect)) {
        setError(messages.exercises?.correctAnswerRequired || 'Mỗi câu hỏi cần có đáp án đúng');
        return;
      }
    }

    setSaving(true);
    try {
      await createQuiz({
        courseId,
        title,
        description,
        order,
        questions: questions.map(q => ({
          ...q,
          options: q.options.filter(o => o.text.trim())
        })),
        timeLimit,
        passingScore,
        allowRetake,
        maxAttempts,
        shuffleQuestions,
        shuffleOptions,
        showResultsImmediately
      });
      router.push(`/my-profile/courses/${courseId}/exercises`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link
            href={`/my-profile/courses/${courseId}/exercises`}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft size={20} />
            <span>{messages.exercises?.back || 'Quay lại'}</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            {resolveMessage(messages.exercises?.createQuiz, 'Tạo bài trắc nghiệm')}
          </h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {messages.exercises?.basicInfo || 'Thông tin cơ bản'}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {messages.exercises?.title || 'Tiêu đề'} *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={messages.exercises?.titlePlaceholder || 'Nhập tiêu đề bài tập'}
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {messages.exercises?.description || 'Mô tả'}
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={messages.exercises?.descriptionPlaceholder || 'Mô tả ngắn về bài tập'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {messages.exercises?.order || 'Thứ tự'}
                </label>
                <input
                  type="number"
                  value={order}
                  onChange={(e) => setOrder(parseInt(e.target.value) || 1)}
                  min={1}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {messages.exercises?.timeLimit || 'Thời gian (phút)'}
                </label>
                <input
                  type="number"
                  value={timeLimit || ''}
                  onChange={(e) => setTimeLimit(e.target.value ? parseInt(e.target.value) : undefined)}
                  min={1}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={messages.exercises?.noLimit || 'Không giới hạn'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {messages.exercises?.passingScore || 'Điểm đạt (%)'}
                </label>
                <input
                  type="number"
                  value={passingScore}
                  onChange={(e) => setPassingScore(parseInt(e.target.value) || 60)}
                  min={0}
                  max={100}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {messages.exercises?.maxAttempts || 'Số lần làm tối đa'}
                </label>
                <input
                  type="number"
                  value={maxAttempts || ''}
                  onChange={(e) => setMaxAttempts(e.target.value ? parseInt(e.target.value) : undefined)}
                  min={1}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={messages.exercises?.unlimited || 'Không giới hạn'}
                  disabled={!allowRetake}
                />
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={allowRetake}
                  onChange={(e) => setAllowRetake(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">
                  {messages.exercises?.allowRetake || 'Cho phép làm lại'}
                </span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={shuffleQuestions}
                  onChange={(e) => setShuffleQuestions(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">
                  {messages.exercises?.shuffleQuestions || 'Xáo trộn câu hỏi'}
                </span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={shuffleOptions}
                  onChange={(e) => setShuffleOptions(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">
                  {messages.exercises?.shuffleOptions || 'Xáo trộn đáp án'}
                </span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showResultsImmediately}
                  onChange={(e) => setShowResultsImmediately(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">
                  {messages.exercises?.showResults || 'Hiển thị kết quả ngay sau khi nộp'}
                </span>
              </label>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                {messages.exercises?.questions || 'Câu hỏi'} ({questions.length})
              </h2>
              <button
                type="button"
                onClick={addQuestion}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm"
              >
                <Plus size={16} />
                <span>{messages.exercises?.addQuestion || 'Thêm câu hỏi'}</span>
              </button>
            </div>

            <div className="space-y-6">
              {questions.map((question, qIndex) => (
                <div key={question.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="flex items-center gap-2 text-gray-400">
                      <GripVertical size={20} />
                      <span className="font-medium text-gray-600">#{qIndex + 1}</span>
                    </div>
                    <div className="flex-1">
                      <textarea
                        value={question.question}
                        onChange={(e) => updateQuestion(question.id, 'question', e.target.value)}
                        rows={2}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder={messages.exercises?.questionPlaceholder || 'Nhập nội dung câu hỏi...'}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={question.points}
                        onChange={(e) => updateQuestion(question.id, 'points', parseInt(e.target.value) || 1)}
                        min={1}
                        className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        title={messages.exercises?.points || 'Điểm'}
                      />
                      <button
                        type="button"
                        onClick={() => removeQuestion(question.id)}
                        disabled={questions.length <= 1}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-30"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  <div className="ml-8 space-y-2">
                    {question.options.map((option, oIndex) => (
                      <div key={option.id} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`correct-${question.id}`}
                          checked={option.isCorrect}
                          onChange={() => updateOption(question.id, option.id, 'isCorrect', true)}
                          className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                        />
                        <span className="text-sm text-gray-500 w-6">{String.fromCharCode(65 + oIndex)}.</span>
                        <input
                          type="text"
                          value={option.text}
                          onChange={(e) => updateOption(question.id, option.id, 'text', e.target.value)}
                          className={`flex-1 px-3 py-1.5 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                            option.isCorrect ? 'border-green-300 bg-green-50' : 'border-gray-300'
                          }`}
                          placeholder={messages.exercises?.optionPlaceholder || 'Nhập lựa chọn...'}
                        />
                        <button
                          type="button"
                          onClick={() => removeOption(question.id, option.id)}
                          disabled={question.options.length <= 2}
                          className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-30"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addOption(question.id)}
                      className="inline-flex items-center gap-1 px-2 py-1 text-xs text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      <Plus size={14} />
                      <span>{messages.exercises?.addOption || 'Thêm lựa chọn'}</span>
                    </button>
                  </div>

                  <div className="ml-8 mt-3">
                    <input
                      type="text"
                      value={question.explanation || ''}
                      onChange={(e) => updateQuestion(question.id, 'explanation', e.target.value)}
                      className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder={messages.exercises?.explanationPlaceholder || 'Giải thích đáp án (không bắt buộc)'}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3">
            <Link
              href={`/my-profile/courses/${courseId}/exercises`}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              {messages.exercises?.cancel || 'Hủy'}
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
            >
              {saving 
                ? (messages.exercises?.saving || 'Đang lưu...')
                : (messages.exercises?.create || 'Tạo bài tập')
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
