'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, X, BookOpen, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { searchCourses, CourseSearchResult } from '@/lib/api/search';

interface HeaderSearchBarProps {
  placeholder?: string;
  className?: string;
}

export default function HeaderSearchBar({
  placeholder = 'Tìm kiếm khóa học...',
  className = '',
}: HeaderSearchBarProps) {
  const [searchValue, setSearchValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<CourseSearchResult[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const performSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await searchCourses(query, 1, 6);
      if (response.success) {
        setResults(response.data.results);
        setShowDropdown(true);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const debouncedSearch = useCallback(
    (value: string) => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(() => performSearch(value), 300);
    },
    [performSearch]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    debouncedSearch(value);
  };

  const handleClear = () => {
    setSearchValue('');
    setResults([]);
    setShowDropdown(false);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchValue.trim()) {
      setShowDropdown(false);
      router.push(`/search?q=${encodeURIComponent(searchValue)}`);
    }
    if (e.key === 'Escape') {
      setShowDropdown(false);
    }
  };

  const handleResultClick = () => {
    setShowDropdown(false);
    setSearchValue('');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, []);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div
        className={`flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border transition-all duration-200 ${
          isFocused
            ? 'border-blue-500 bg-white shadow-md'
            : 'border-gray-200 hover:border-gray-300'
        }`}
      >
        {isLoading ? (
          <Loader2 size={18} className="flex-shrink-0 text-blue-500 animate-spin" />
        ) : (
          <Search
            size={18}
            className={`flex-shrink-0 transition-colors ${
              isFocused ? 'text-blue-500' : 'text-gray-400'
            }`}
          />
        )}

        <input
          type="text"
          value={searchValue}
          onChange={handleInputChange}
          onFocus={() => {
            setIsFocused(true);
            if (results.length > 0) setShowDropdown(true);
          }}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-48 lg:w-64 bg-transparent outline-none text-gray-700 placeholder-gray-400 text-sm"
        />

        {searchValue && (
          <button
            onClick={handleClear}
            type="button"
            aria-label="Clear search"
            className="flex-shrink-0 p-1 rounded-full transition-all duration-200 hover:bg-gray-200"
          >
            <X size={16} className="text-gray-500 hover:text-gray-700" />
          </button>
        )}
      </div>

      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50 max-h-96 overflow-y-auto">
          {results.length > 0 ? (
            <>
              <div className="px-3 py-2 bg-gray-50 border-b border-gray-100">
                <span className="text-xs text-gray-500">Kết quả tìm kiếm</span>
              </div>
              {results.map((course) => (
                <Link
                  key={course.id}
                  href={`/courses/${course.id}`}
                  onClick={handleResultClick}
                  className="flex items-start gap-3 px-3 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-b-0"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    {course.image ? (
                      <img
                        src={course.image}
                        alt={course.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <BookOpen size={20} className="text-blue-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {course.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {course.code}
                      {course.instructor && ` • ${course.instructor}`}
                    </p>
                  </div>
                </Link>
              ))}
              <Link
                href={`/search?q=${encodeURIComponent(searchValue)}`}
                onClick={handleResultClick}
                className="block px-3 py-2 text-center text-sm text-blue-600 hover:bg-blue-50 transition-colors border-t border-gray-100"
              >
                Xem tất cả kết quả
              </Link>
            </>
          ) : (
            <div className="px-4 py-6 text-center">
              <p className="text-sm text-gray-500">
                Không tìm thấy kết quả cho &quot;{searchValue}&quot;
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
