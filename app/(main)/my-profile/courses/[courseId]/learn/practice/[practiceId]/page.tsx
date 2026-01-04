'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Play, CheckCircle, XCircle, Clock, Code, Lightbulb, ChevronDown, ChevronUp, RotateCcw, Send } from 'lucide-react';
import { getPracticeForStudent, submitPractice, getMyPracticeSubmissions, getMyBestPracticeSubmission } from '@/lib/services/profile/profile.service';
import type { PracticeExercise, PracticeSubmission, PracticeTestResult as TestCaseResult } from '@/lib/types/profile';
import { getMessages, DEFAULT_LOCALE } from '@/app/i18n';
import { STORAGE_KEYS } from '@/lib/shared/constants/storage';

const LANGUAGES = [
  { id: 'python', name: 'Python' },
  { id: 'java', name: 'Java' },
  { id: 'c', name: 'C' },
  { id: 'cpp', name: 'C++' },
  { id: 'rust', name: 'Rust' }
];

export default function TakePracticePage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;
  const practiceId = params.practiceId as string;

  const [practice, setPractice] = useState<PracticeExercise | null>(null);
  const [previousSubmissions, setPreviousSubmissions] = useState<PracticeSubmission[]>([]);
  const [bestSubmission, setBestSubmission] = useState<PracticeSubmission | null>(null);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState('');
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<PracticeSubmission | null>(null);
  const [showHints, setShowHints] = useState(false);
  const [revealedHints, setRevealedHints] = useState<number[]>([]);
  const [showPreviousSubmissions, setShowPreviousSubmissions] = useState(false);

  const messages = getMessages(DEFAULT_LOCALE) as Record<string, Record<string, string>>;

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN) : null;
    if (!token) {
      alert('Bạn cần đăng nhập để làm bài tập');
      router.push('/login');
      return;
    }

    async function fetchPractice() {
      try {
        const [practiceData, submissions, best] = await Promise.all([
          getPracticeForStudent(practiceId),
          getMyPracticeSubmissions(practiceId),
          getMyBestPracticeSubmission(practiceId).catch(() => null)
        ]);
        
        setPractice(practiceData);
        setPreviousSubmissions(submissions);
        setBestSubmission(best);
        setCode((practiceData?.templateCode) || '');
      } catch (error) {
        console.error('Error fetching practice:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchPractice();
  }, [practiceId]);

  const handleSubmit = async () => {
    if (!practice || running || !code.trim()) return;

    setRunning(true);
    setResult(null);
    try {
      const submission = await submitPractice(practiceId, code, practice.language);
      if (!submission) {
        throw new Error('Không nhận được kết quả từ server');
      }
      setResult(submission);
      setPreviousSubmissions(prev => [submission, ...prev]);
      if (!bestSubmission || submission.percentage > bestSubmission.percentage) {
        setBestSubmission(submission);
      }
    } catch (error) {
      console.error('Error submitting practice:', error);
      const errorMessage = error instanceof Error ? error.message : 'Có lỗi khi chạy code';
      
      if (errorMessage.includes('not authenticated') || errorMessage.includes('Unauthorized')) {
        alert('Token hết hạn. Vui lòng đăng nhập lại');
        router.push('/login');
        return;
      }
      
      alert(errorMessage);
    } finally {
      setRunning(false);
    }
  };

  const revealHint = (index: number) => {
    if (!revealedHints.includes(index)) {
      setRevealedHints([...revealedHints, index]);
    }
  };

  const resetCode = () => {
    if (practice) {
      setCode(practice.templateCode || '');
      setResult(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!practice) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-gray-400">Practice not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-full px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href={`/my-profile/courses/${courseId}/learn`}
                className="p-2 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white"
              >
                <ArrowLeft size={20} />
              </Link>
              <div>
                <h1 className="font-semibold text-white">{practice.title}</h1>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                    practice.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
                    practice.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {practice.difficulty === 'easy' ? (messages.exercises?.easy || 'Dễ') :
                     practice.difficulty === 'medium' ? (messages.exercises?.medium || 'Trung bình') :
                     (messages.exercises?.hard || 'Khó')}
                  </span>
                  <span>•</span>
                  <span>{practice.language}</span>
                  {bestSubmission && (
                    <>
                      <span>•</span>
                      <span className={bestSubmission.passed ? 'text-green-400' : 'text-yellow-400'}>
                        {messages.learn?.bestScore || 'Điểm cao nhất'}: {bestSubmission.percentage.toFixed(0)}%
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={resetCode}
                className="flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg"
              >
                <RotateCcw size={16} />
                {messages.practice?.reset || 'Reset'}
              </button>
              <button
                onClick={handleSubmit}
                disabled={running || !code.trim()}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {running ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                ) : (
                  <Play size={16} />
                )}
                {running ? (messages.practice?.running || 'Đang chạy...') : (messages.practice?.runCode || 'Chạy code')}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        <div className="w-1/2 border-r border-gray-700 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6">
            <div className="prose prose-invert max-w-none">
              <h2 className="text-xl font-semibold text-white mb-4">
                {messages.practice?.description || 'Mô tả bài tập'}
              </h2>
              <div className="text-gray-300 whitespace-pre-wrap">{practice.description}</div>

              <h3 className="text-lg font-semibold text-white mt-6 mb-3">
                {messages.practice?.testCases || 'Test cases'}
              </h3>
              <div className="space-y-3">
                {practice.testCases.map((tc, index) => (
                  <div key={index} className="bg-gray-800 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-400">
                        Test case {index + 1}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500 mb-1">Input:</p>
                        <pre className="bg-gray-900 p-2 rounded text-green-400 overflow-x-auto">{tc.input}</pre>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">Expected Output:</p>
                        <pre className="bg-gray-900 p-2 rounded text-blue-400 overflow-x-auto">{tc.expectedOutput}</pre>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {practice.hints && practice.hints.length > 0 && (
                <div className="mt-6">
                  <button
                    onClick={() => setShowHints(!showHints)}
                    className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300"
                  >
                    <Lightbulb size={18} />
                    <span>{messages.practice?.hints || 'Gợi ý'} ({practice.hints.length})</span>
                    {showHints ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                  
                  {showHints && (
                    <div className="mt-3 space-y-2">
                      {practice.hints.map((hint, index) => (
                        <div key={index} className="bg-gray-800 rounded-lg p-3">
                          {revealedHints.includes(index) ? (
                            <p className="text-gray-300">{hint}</p>
                          ) : (
                            <button
                              onClick={() => revealHint(index)}
                              className="text-yellow-400 hover:text-yellow-300 text-sm"
                            >
                              {messages.practice?.revealHint || 'Nhấn để xem gợi ý'} {index + 1}
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="w-1/2 flex flex-col">
          <div className="flex-1 flex flex-col">
            <div className="bg-gray-800 px-4 py-2 flex items-center justify-between border-b border-gray-700">
              <div className="flex items-center gap-2">
                <Code size={16} className="text-gray-400" />
                <span className="text-sm text-gray-300">{practice.language}</span>
              </div>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1 bg-gray-900 text-gray-100 font-mono text-sm p-4 resize-none focus:outline-none"
              placeholder={messages.practice?.codePlaceholder || 'Viết code của bạn ở đây...'}
              spellCheck={false}
            />
          </div>

          <div className="h-1/3 border-t border-gray-700 bg-gray-800 overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-white flex items-center gap-2">
                  {messages.practice?.results || 'Kết quả'}
                  {result && (
                    <span className={`text-sm px-2 py-0.5 rounded ${
                      result.passed ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {result.passed ? (messages.practice?.passed || 'Đạt') : (messages.practice?.failed || 'Chưa đạt')}
                    </span>
                  )}
                </h3>
                
                {previousSubmissions.length > 0 && (
                  <button
                    onClick={() => setShowPreviousSubmissions(!showPreviousSubmissions)}
                    className="text-sm text-gray-400 hover:text-white"
                  >
                    {showPreviousSubmissions 
                      ? (messages.practice?.hideHistory || 'Ẩn lịch sử')
                      : `${messages.practice?.showHistory || 'Xem lịch sử'} (${previousSubmissions.length})`
                    }
                  </button>
                )}
              </div>

              {result ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-gray-900 rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold text-white">{result.score}/{result.totalPoints}</p>
                      <p className="text-xs text-gray-500">{messages.practice?.score || 'Điểm'}</p>
                    </div>
                    <div className="bg-gray-900 rounded-lg p-3 text-center">
                      <p className={`text-2xl font-bold ${result.passed ? 'text-green-400' : 'text-red-400'}`}>
                        {result.percentage.toFixed(0)}%
                      </p>
                      <p className="text-xs text-gray-500">{messages.practice?.percentage || 'Tỉ lệ'}</p>
                    </div>
                    <div className="bg-gray-900 rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold text-blue-400">
                        {result.testResults.filter(r => r.passed).length}/{result.testResults.length}
                      </p>
                      <p className="text-xs text-gray-500">{messages.practice?.testsPassed || 'Tests đạt'}</p>
                    </div>
                  </div>

                  {/* Test results */}
                  <div className="space-y-2">
                    {result.testResults.map((tr, index) => (
                      <div 
                        key={index}
                        className={`rounded-lg p-3 ${
                          tr.passed ? 'bg-green-500/10 border border-green-500/30' : 'bg-red-500/10 border border-red-500/30'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {tr.passed ? (
                              <CheckCircle size={16} className="text-green-400" />
                            ) : (
                              <XCircle size={16} className="text-red-400" />
                            )}
                            <span className={`font-medium ${tr.passed ? 'text-green-400' : 'text-red-400'}`}>
                              Test case {index + 1}
                            </span>
                          </div>
                          {!tr.isHidden && (
                            <span className="text-sm text-gray-500">
                              {tr.executionTime}ms
                            </span>
                          )}
                        </div>
                        
                        {!tr.isHidden && !tr.passed && (
                          <div className="mt-2 text-sm space-y-1">
                            <p className="text-gray-400">
                              Input: <code className="text-blue-400">{tr.input}</code>
                            </p>
                            <p className="text-gray-400">
                              Expected: <code className="text-green-400">{tr.expectedOutput}</code>
                            </p>
                            <p className="text-gray-400">
                              Got: <code className="text-red-400">{tr.actualOutput || '(no output)'}</code>
                            </p>
                            {tr.error && (
                              <p className="text-red-400">Error: {tr.error}</p>
                            )}
                          </div>
                        )}
                        
                        {tr.isHidden && (
                          <p className="mt-1 text-sm text-gray-500">
                            {messages.practice?.hiddenTest || 'Hidden test case'}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Play size={32} className="mx-auto mb-2 opacity-50" />
                  <p>{messages.practice?.runToSeeResults || 'Chạy code để xem kết quả'}</p>
                </div>
              )}

              {showPreviousSubmissions && previousSubmissions.length > 0 && (
                <div className="mt-4 border-t border-gray-700 pt-4">
                  <h4 className="text-sm font-medium text-gray-400 mb-2">
                    {messages.practice?.submissionHistory || 'Lịch sử nộp bài'}
                  </h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {previousSubmissions.slice(0, 10).map((sub, index) => (
                      <div 
                        key={sub?.id || index}
                        className="flex items-center justify-between py-2 px-3 bg-gray-900 rounded text-sm"
                      >
                        <span className="text-gray-400">
                          {sub?.submittedAt ? new Date(sub.submittedAt).toLocaleString() : 'N/A'}
                        </span>
                        <div className="flex items-center gap-3">
                          <span className="text-gray-300">{sub?.score || 0}/{sub?.totalPoints || 0}</span>
                          <span className={sub?.passed ? 'text-green-400' : 'text-red-400'}>
                            {sub?.percentage?.toFixed(0) || 0}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
