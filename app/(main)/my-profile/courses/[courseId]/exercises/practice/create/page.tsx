'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, Trash2, Eye, EyeOff } from 'lucide-react';
import { createPractice } from '@/lib/services/profile/profile.service';
import type { PracticeTestCase } from '@/lib/types/profile';
import { getMessages, DEFAULT_LOCALE, resolveMessage } from '@/app/i18n';

function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

const LANGUAGES = [
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'c', label: 'C' },
  { value: 'cpp', label: 'C++' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'rust', label: 'Rust' }
];

const CODE_TEMPLATES: Record<string, string> = {
  python: `# Đọc input và xử lý
a = int(input())
b = int(input())
print(a + b)`,
  java: `import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();
        System.out.println(a + b);
    }
}`,
  c: `#include <stdio.h>

int main() {
    int a, b;
    scanf("%d %d", &a, &b);
    printf("%d\\n", a + b);
    return 0;
}`,
  cpp: `#include <iostream>
using namespace std;

int main() {
    int a, b;
    cin >> a >> b;
    cout << a + b << endl;
    return 0;
}`,
  javascript: `const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let lines = [];
rl.on('line', (line) => {
    lines.push(line);
}).on('close', () => {
    const a = parseInt(lines[0]);
    const b = parseInt(lines[1]);
    console.log(a + b);
});`,
  rust: `use std::io;

fn main() {
    let mut input = String::new();
    io::stdin().read_line(&mut input).unwrap();
    let a: i32 = input.trim().parse().unwrap();
    
    input.clear();
    io::stdin().read_line(&mut input).unwrap();
    let b: i32 = input.trim().parse().unwrap();
    
    println!("{}", a + b);
}`
};

export default function CreatePracticePage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;
  
  const messages = getMessages(DEFAULT_LOCALE) as Record<string, Record<string, string>>;
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [order, setOrder] = useState(1);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [language, setLanguage] = useState('python');
  const [templateCode, setTemplateCode] = useState(CODE_TEMPLATES.python);
  const [constraints, setConstraints] = useState('');
  const [hints, setHints] = useState<string[]>([]);
  const [sampleInput, setSampleInput] = useState('');
  const [sampleOutput, setSampleOutput] = useState('');
  const [timeLimit, setTimeLimit] = useState(10000);
  const [memoryLimit, setMemoryLimit] = useState(256000);
  
  const [testCases, setTestCases] = useState<PracticeTestCase[]>([
    { id: generateId(), input: '', expectedOutput: '', isHidden: false, points: 10 }
  ]);
  
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleLanguageChange = (newLang: string) => {
    setLanguage(newLang);
    setTemplateCode(CODE_TEMPLATES[newLang] || '');
  };

  const addTestCase = () => {
    setTestCases(prev => [...prev, {
      id: generateId(),
      input: '',
      expectedOutput: '',
      isHidden: false,
      points: 10
    }]);
  };

  const removeTestCase = (id: string) => {
    if (testCases.length <= 1) return;
    setTestCases(prev => prev.filter(tc => tc.id !== id));
  };

  const updateTestCase = (id: string, field: keyof PracticeTestCase, value: unknown) => {
    setTestCases(prev => prev.map(tc =>
      tc.id === id ? { ...tc, [field]: value } : tc
    ));
  };

  const addHint = () => {
    setHints(prev => [...prev, '']);
  };

  const updateHint = (index: number, value: string) => {
    setHints(prev => prev.map((h, i) => i === index ? value : h));
  };

  const removeHint = (index: number) => {
    setHints(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!title.trim()) {
      setError(messages.exercises?.titleRequired || 'Vui lòng nhập tiêu đề');
      return;
    }

    if (!description.trim()) {
      setError(messages.exercises?.descriptionRequired || 'Vui lòng nhập mô tả bài tập');
      return;
    }

    const validTestCases = testCases.filter(tc => tc.input.trim() || tc.expectedOutput.trim());
    if (validTestCases.length === 0) {
      setError(messages.exercises?.testCasesRequired || 'Cần ít nhất 1 test case');
      return;
    }

    for (const tc of validTestCases) {
      if (!tc.expectedOutput.trim()) {
        setError(messages.exercises?.expectedOutputRequired || 'Mỗi test case cần có expected output');
        return;
      }
    }

    setSaving(true);
    try {
      await createPractice({
        courseId,
        title,
        description,
        order,
        difficulty,
        language,
        templateCode,
        testCases: validTestCases,
        constraints,
        hints: hints.filter(h => h.trim()),
        sampleInput,
        sampleOutput,
        timeLimit,
        memoryLimit
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
            {resolveMessage(messages.exercises?.createPractice, 'Tạo bài thực hành')}
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
                  placeholder={messages.exercises?.titlePlaceholder || 'Ví dụ: Tính tổng hai số'}
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {messages.exercises?.problemDescription || 'Đề bài'} *
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={messages.exercises?.problemDescriptionPlaceholder || 'Mô tả chi tiết yêu cầu bài tập, định dạng input/output...'}
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
                  {messages.exercises?.difficulty || 'Độ khó'}
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as 'easy' | 'medium' | 'hard')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="easy">{messages.exercises?.easy || 'Dễ'}</option>
                  <option value="medium">{messages.exercises?.medium || 'Trung bình'}</option>
                  <option value="hard">{messages.exercises?.hard || 'Khó'}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {messages.exercises?.language || 'Ngôn ngữ'}
                </label>
                <select
                  value={language}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {LANGUAGES.map(lang => (
                    <option key={lang.value} value={lang.value}>{lang.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {messages.exercises?.timeLimit || 'Time limit (ms)'}
                </label>
                <input
                  type="number"
                  value={timeLimit}
                  onChange={(e) => setTimeLimit(parseInt(e.target.value) || 10000)}
                  min={1000}
                  step={1000}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {messages.exercises?.constraints || 'Ràng buộc'}
                </label>
                <textarea
                  value={constraints}
                  onChange={(e) => setConstraints(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ví dụ: 1 ≤ n ≤ 10^6"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {messages.exercises?.sampleIO || 'Ví dụ Input/Output'}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sample Input
                </label>
                <textarea
                  value={sampleInput}
                  onChange={(e) => setSampleInput(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 font-mono text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="3&#10;5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sample Output
                </label>
                <textarea
                  value={sampleOutput}
                  onChange={(e) => setSampleOutput(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 font-mono text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="8"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {messages.exercises?.templateCode || 'Code mẫu'}
            </h2>
            <textarea
              value={templateCode}
              onChange={(e) => setTemplateCode(e.target.value)}
              rows={12}
              className="w-full px-4 py-2 font-mono text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="# Code mẫu cho sinh viên..."
            />
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Test Cases ({testCases.length})
              </h2>
              <button
                type="button"
                onClick={addTestCase}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm"
              >
                <Plus size={16} />
                <span>{messages.exercises?.addTestCase || 'Thêm test case'}</span>
              </button>
            </div>

            <div className="space-y-4">
              {testCases.map((tc, index) => (
                <div key={tc.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-gray-700">Test #{index + 1}</span>
                      <button
                        type="button"
                        onClick={() => updateTestCase(tc.id, 'isHidden', !tc.isHidden)}
                        className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded transition-colors ${
                          tc.isHidden 
                            ? 'bg-gray-200 text-gray-600' 
                            : 'bg-blue-100 text-blue-700'
                        }`}
                        title={tc.isHidden ? 'Hidden from students' : 'Visible to students'}
                      >
                        {tc.isHidden ? <EyeOff size={14} /> : <Eye size={14} />}
                        {tc.isHidden ? 'Hidden' : 'Visible'}
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={tc.points}
                        onChange={(e) => updateTestCase(tc.id, 'points', parseInt(e.target.value) || 10)}
                        min={1}
                        className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        title="Points"
                      />
                      <span className="text-xs text-gray-500">pts</span>
                      <button
                        type="button"
                        onClick={() => removeTestCase(tc.id)}
                        disabled={testCases.length <= 1}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-30"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Input</label>
                      <textarea
                        value={tc.input}
                        onChange={(e) => updateTestCase(tc.id, 'input', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 font-mono text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="3&#10;5"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Expected Output *</label>
                      <textarea
                        value={tc.expectedOutput}
                        onChange={(e) => updateTestCase(tc.id, 'expectedOutput', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 font-mono text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="8"
                      />
                    </div>
                  </div>

                  <div className="mt-3">
                    <input
                      type="text"
                      value={tc.explanation || ''}
                      onChange={(e) => updateTestCase(tc.id, 'explanation', e.target.value)}
                      className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder={messages.exercises?.testExplanation || 'Giải thích (không bắt buộc)'}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                {messages.exercises?.hints || 'Gợi ý'} ({hints.length})
              </h2>
              <button
                type="button"
                onClick={addHint}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors text-sm"
              >
                <Plus size={16} />
                <span>{messages.exercises?.addHint || 'Thêm gợi ý'}</span>
              </button>
            </div>

            {hints.length === 0 ? (
              <p className="text-sm text-gray-500">
                {messages.exercises?.noHints || 'Chưa có gợi ý nào'}
              </p>
            ) : (
              <div className="space-y-2">
                {hints.map((hint, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 w-8">#{index + 1}</span>
                    <input
                      type="text"
                      value={hint}
                      onChange={(e) => updateHint(index, e.target.value)}
                      className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Nhập gợi ý..."
                    />
                    <button
                      type="button"
                      onClick={() => removeHint(index)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
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
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
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
