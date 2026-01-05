'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, BookOpen, Users, Clock, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { searchCourses, CourseSearchResult } from '@/lib/api/search';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q') || '';
  
  const [searchValue, setSearchValue] = useState(query);
  const [results, setResults] = useState<CourseSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [took, setTook] = useState(0);
  const [elasticsearchAvailable, setElasticsearchAvailable] = useState(false);
  const limit = 12;

  const performSearch = useCallback(async (searchQuery: string, pageNum: number) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setTotal(0);
      return;
    }

    setIsLoading(true);
    try {
      const response = await searchCourses(searchQuery, pageNum, limit);
      if (response.success) {
        setResults(response.data.results);
        setTotal(response.data.total);
        setTook(response.data.took);
        setElasticsearchAvailable(response.meta?.elasticsearchAvailable || false);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (query) {
      setSearchValue(query);
      performSearch(query, 1);
    }
  }, [query, performSearch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchValue)}`);
      setPage(1);
      performSearch(searchValue, 1);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    performSearch(searchValue, newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Tìm kiếm khóa học</h1>
          
          <form onSubmit={handleSearch} className="relative max-w-2xl">
            <div className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl border-2 border-gray-200 focus-within:border-blue-500 transition-colors shadow-sm">
              <Search size={22} className="text-gray-400" />
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Nhập tên khóa học, mã môn, giảng viên..."
                className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Tìm kiếm
              </button>
            </div>
          </form>
        </div>
        {query && !isLoading && (
          <div className="mb-6 flex items-center gap-4">
            <p className="text-gray-600">
              Tìm thấy <span className="font-semibold text-gray-900">{total}</span> kết quả cho &quot;
              <span className="font-semibold text-blue-600">{query}</span>&quot;
              {took > 0 && (
                <span className="text-gray-400 text-sm ml-2">({took}ms)</span>
              )}
            </p>
            {elasticsearchAvailable && (
              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                Powered by Elasticsearch
              </span>
            )}
          </div>
        )}

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 size={40} className="text-blue-500 animate-spin" />
            <span className="ml-3 text-gray-600">Đang tìm kiếm...</span>
          </div>
        )}

        {!isLoading && results.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {results.map((course) => (
              <Link
                key={course.id}
                href={`/courses/${course.id}`}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group"
              >
                <div className="aspect-video bg-gradient-to-br from-blue-500 to-indigo-600 relative">
                  {course.image ? (
                    <img
                      src={course.image}
                      alt={course.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpen size={48} className="text-white/50" />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                      {course.code}
                    </span>
                    {course.credits && (
                      <span className="text-xs text-gray-500">{course.credits} tín chỉ</span>
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">
                    {course.name}
                  </h3>
                  {course.description && (
                    <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                      {course.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    {course.instructor && (
                      <span className="flex items-center gap-1">
                        <Users size={14} />
                        {course.instructor}
                      </span>
                    )}
                    {course.enrolled !== undefined && course.capacity && (
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {course.enrolled}/{course.capacity}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!isLoading && query && results.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Search size={40} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Không tìm thấy kết quả
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Không có khóa học nào phù hợp với &quot;{query}&quot;. 
              Hãy thử tìm kiếm với từ khóa khác hoặc kiểm tra lại chính tả.
            </p>
          </div>
        )}

        {!isLoading && !query && (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Search size={40} className="text-blue-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Tìm kiếm khóa học
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Nhập tên khóa học, mã môn hoặc tên giảng viên để bắt đầu tìm kiếm.
            </p>
          </div>
        )}

        {!isLoading && totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Trước
            </button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (page <= 3) {
                pageNum = i + 1;
              } else if (page >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = page - 2 + i;
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                    page === pageNum
                      ? 'bg-blue-600 text-white'
                      : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Tiếp
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
