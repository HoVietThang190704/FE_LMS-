'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowLeft, 
  Users, 
  GraduationCap, 
  UserPlus, 
  Upload, 
  Trash2, 
  Search,
  User,
  Mail,
  CheckCircle,
  XCircle,
  Clock,
  FileSpreadsheet,
  X
} from 'lucide-react';
import { 
  getCourseStudents, 
  getCourseGrades, 
  addStudentByEmail, 
  addStudentsBulk, 
  removeStudentFromCourse,
  parseEmailsFromText,
  type CourseStudent,
  type StudentGrade 
} from '@/lib/services/classroom/classroom-management.service';

type TabType = 'students' | 'grades';

export default function CourseStudentsPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  
  const [activeTab, setActiveTab] = useState<TabType>('students');
  const [students, setStudents] = useState<CourseStudent[]>([]);
  const [grades, setGrades] = useState<StudentGrade[]>([]);
  const [loading, setLoading] = useState(true);
  const [courseName, setCourseName] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [addMode, setAddMode] = useState<'single' | 'bulk'>('single');
  const [singleEmail, setSingleEmail] = useState('');
  const [bulkEmails, setBulkEmails] = useState('');
  const [addingStudent, setAddingStudent] = useState(false);
  const [addResult, setAddResult] = useState<{ success: boolean; message: string } | null>(null);
  
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [studentsRes, gradesRes] = await Promise.all([
        getCourseStudents(courseId),
        getCourseGrades(courseId)
      ]);
      
      if (studentsRes) {
        setStudents(studentsRes.data);
        setCourseName(studentsRes.meta.courseName);
        setCourseCode(studentsRes.meta.courseCode);
      }
      
      if (gradesRes) {
        setGrades(gradesRes.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddStudent = async () => {
    if (addMode === 'single') {
      if (!singleEmail.trim()) {
        setAddResult({ success: false, message: 'Vui lòng nhập email' });
        return;
      }
      
      setAddingStudent(true);
      const result = await addStudentByEmail(courseId, singleEmail.trim());
      setAddResult({ success: result.success, message: result.message || (result.success ? 'Đã thêm sinh viên thành công' : 'Lỗi') });
      
      if (result.success) {
        setSingleEmail('');
        await fetchData();
      }
      setAddingStudent(false);
    } else {
      const emails = parseEmailsFromText(bulkEmails);
      if (emails.length === 0) {
        setAddResult({ success: false, message: 'Không tìm thấy email hợp lệ' });
        return;
      }
      
      setAddingStudent(true);
      const result = await addStudentsBulk(courseId, emails);
      
      if (result.success && result.data) {
        const { success, notFound, alreadyEnrolled } = result.data;
        const messages = [];
        if (success.length > 0) messages.push(` Đã thêm ${success.length} sinh viên`);
        if (notFound.length > 0) messages.push(` ${notFound.length} email không tìm thấy`);
        if (alreadyEnrolled.length > 0) messages.push(`! ${alreadyEnrolled.length} đã đăng ký trước đó`);
        
        setAddResult({ 
          success: success.length > 0, 
          message: messages.join('. ') 
        });
        
        if (success.length > 0) {
          setBulkEmails('');
          await fetchData();
        }
      } else {
        setAddResult({ success: false, message: result.message || 'Lỗi khi thêm sinh viên' });
      }
      setAddingStudent(false);
    }
  };

  const handleRemoveStudent = async (userId: string) => {
    if (!confirm('Bạn có chắc muốn xóa sinh viên này khỏi lớp học?')) return;
    
    setDeletingUserId(userId);
    const result = await removeStudentFromCourse(courseId, userId);
    
    if (result.success) {
      await fetchData();
    } else {
      alert(result.message || 'Không thể xóa sinh viên');
    }
    setDeletingUserId(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setBulkEmails(content);
    };
    reader.readAsText(file);
  };

  const filteredStudents = students.filter(s => 
    s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredGrades = grades.filter(g => 
    g.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
            <CheckCircle size={12} /> Đã duyệt
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
            <Clock size={12} /> Chờ duyệt
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
            <XCircle size={12} /> Từ chối
          </span>
        );
      default:
        return null;
    }
  };

  const getGradeColor = (grade: string) => {
    if (grade === 'A+' || grade === 'A') return 'text-green-600 bg-green-50';
    if (grade === 'B+' || grade === 'B') return 'text-blue-600 bg-blue-50';
    if (grade === 'C+' || grade === 'C') return 'text-yellow-600 bg-yellow-50';
    if (grade === 'D+' || grade === 'D') return 'text-orange-600 bg-orange-50';
    if (grade === 'F') return 'text-red-600 bg-red-50';
    return 'text-gray-600 bg-gray-50';
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link
            href="/my-profile"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft size={20} />
            <span>Quay lại hồ sơ</span>
          </Link>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Quản lý lớp học
              </h1>
              <p className="text-gray-600">
                {courseCode} - {courseName}
              </p>
            </div>
            
            <button
              onClick={() => {
                setShowAddModal(true);
                setAddResult(null);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <UserPlus size={18} />
              <span>Thêm sinh viên</span>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab('students')}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'students'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Users size={18} />
                <span>Danh sách sinh viên</span>
                <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                  {students.length}
                </span>
              </button>
              
              <button
                onClick={() => setActiveTab('grades')}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'grades'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <GraduationCap size={18} />
                <span>Bảng điểm</span>
              </button>
            </div>
          </div>

          <div className="p-4 border-b border-gray-200">
            <div className="relative max-w-md">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên hoặc email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'students' ? (
              <StudentsTable 
                students={filteredStudents}
                onRemove={handleRemoveStudent}
                deletingUserId={deletingUserId}
                getStatusBadge={getStatusBadge}
              />
            ) : (
              <GradesTable 
                grades={filteredGrades}
                getGradeColor={getGradeColor}
              />
            )}
          </div>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold">Thêm sinh viên vào lớp học</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-4">
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => {
                    setAddMode('single');
                    setAddResult(null);
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                    addMode === 'single'
                      ? 'border-blue-600 bg-blue-50 text-blue-600'
                      : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Mail size={18} />
                  <span>Thêm từng email</span>
                </button>
                <button
                  onClick={() => {
                    setAddMode('bulk');
                    setAddResult(null);
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                    addMode === 'bulk'
                      ? 'border-blue-600 bg-blue-50 text-blue-600'
                      : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <FileSpreadsheet size={18} />
                  <span>Thêm nhiều email</span>
                </button>
              </div>

              {addMode === 'single' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email sinh viên
                  </label>
                  <input
                    type="email"
                    value={singleEmail}
                    onChange={(e) => setSingleEmail(e.target.value)}
                    placeholder="student@example.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Danh sách email (mỗi email một dòng hoặc phân cách bằng dấu phẩy)
                  </label>
                  <textarea
                    value={bulkEmails}
                    onChange={(e) => setBulkEmails(e.target.value)}
                    placeholder="student1@example.com&#10;student2@example.com&#10;student3@example.com"
                    rows={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                  
                  <div className="mt-3">
                    <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer w-fit">
                      <Upload size={18} />
                      <span>Tải lên file Excel/CSV</span>
                      <input
                        type="file"
                        accept=".csv,.txt,.xlsx,.xls"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                    <p className="text-xs text-gray-500 mt-1">
                      Hỗ trợ file .csv, .txt chứa danh sách email
                    </p>
                  </div>
                </div>
              )}

              {addResult && (
                <div className={`mt-4 p-3 rounded-lg ${
                  addResult.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                }`}>
                  {addResult.message}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 p-4 border-t border-gray-200">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Đóng
              </button>
              <button
                onClick={handleAddStudent}
                disabled={addingStudent}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {addingStudent ? 'Đang thêm...' : 'Thêm sinh viên'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StudentsTable({ 
  students, 
  onRemove, 
  deletingUserId,
  getStatusBadge 
}: { 
  students: CourseStudent[];
  onRemove: (userId: string) => void;
  deletingUserId: string | null;
  getStatusBadge: (status: string) => React.ReactNode;
}) {
  if (students.length === 0) {
    return (
      <div className="text-center py-12">
        <Users size={48} className="mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500">Chưa có sinh viên nào trong lớp học</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 font-medium text-gray-600">Sinh viên</th>
            <th className="text-left py-3 px-4 font-medium text-gray-600">Email</th>
            <th className="text-left py-3 px-4 font-medium text-gray-600">Trạng thái</th>
            <th className="text-left py-3 px-4 font-medium text-gray-600">Ngày đăng ký</th>
            <th className="text-right py-3 px-4 font-medium text-gray-600">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.userId} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-3 px-4">
                <div className="flex items-center gap-3">
                  {student.avatarUrl ? (
                    <Image
                      src={student.avatarUrl}
                      alt={student.fullName}
                      width={40}
                      height={40}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <User size={20} className="text-blue-600" />
                    </div>
                  )}
                  <span className="font-medium text-gray-900">{student.fullName}</span>
                </div>
              </td>
              <td className="py-3 px-4 text-gray-600">{student.email}</td>
              <td className="py-3 px-4">{getStatusBadge(student.status)}</td>
              <td className="py-3 px-4 text-gray-600">
                {new Date(student.enrolledAt).toLocaleDateString('vi-VN')}
              </td>
              <td className="py-3 px-4 text-right">
                <button
                  onClick={() => onRemove(student.userId)}
                  disabled={deletingUserId === student.userId}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                  title="Xóa sinh viên"
                >
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function GradesTable({ 
  grades,
  getGradeColor 
}: { 
  grades: StudentGrade[];
  getGradeColor: (grade: string) => string;
}) {
  if (grades.length === 0) {
    return (
      <div className="text-center py-12">
        <GraduationCap size={48} className="mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500">Chưa có dữ liệu điểm</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 font-medium text-gray-600">Sinh viên</th>
            <th className="text-left py-3 px-4 font-medium text-gray-600">Email</th>
            <th className="text-center py-3 px-4 font-medium text-gray-600">Điểm Quiz (40%)</th>
            <th className="text-center py-3 px-4 font-medium text-gray-600">Điểm Practice (60%)</th>
            <th className="text-center py-3 px-4 font-medium text-gray-600">Điểm TB</th>
            <th className="text-center py-3 px-4 font-medium text-gray-600">Xếp hạng</th>
          </tr>
        </thead>
        <tbody>
          {grades.map((student) => (
            <tr key={student.userId} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-3 px-4">
                <div className="flex items-center gap-3">
                  {student.avatarUrl ? (
                    <Image
                      src={student.avatarUrl}
                      alt={student.fullName}
                      width={40}
                      height={40}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <User size={20} className="text-blue-600" />
                    </div>
                  )}
                  <span className="font-medium text-gray-900">{student.fullName}</span>
                </div>
              </td>
              <td className="py-3 px-4 text-gray-600">{student.email}</td>
              <td className="py-3 px-4 text-center">
                <span className={`font-medium ${student.quizScore !== null ? 'text-gray-900' : 'text-gray-400'}`}>
                  {student.quizScore !== null ? student.quizScore.toFixed(1) : '-'}
                </span>
              </td>
              <td className="py-3 px-4 text-center">
                <span className={`font-medium ${student.practiceScore !== null ? 'text-gray-900' : 'text-gray-400'}`}>
                  {student.practiceScore !== null ? student.practiceScore.toFixed(1) : '-'}
                </span>
              </td>
              <td className="py-3 px-4 text-center">
                <span className={`font-semibold ${student.total !== null ? 'text-gray-900' : 'text-gray-400'}`}>
                  {student.total !== null ? student.total.toFixed(1) : '-'}
                </span>
              </td>
              <td className="py-3 px-4 text-center">
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getGradeColor(student.grade)}`}>
                  {student.grade}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
