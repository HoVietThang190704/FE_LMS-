'use client';

import React, { useState } from 'react';
import SearchBar from '@/components/search/SearchBar';

export default function SearchBarDemo() {
  const [results, setResults] = useState<string>('');
  const [lastSearch, setLastSearch] = useState<string>('');

  const handleSearch = (value: string) => {
    setLastSearch(value);
    setResults(
      value
        ? `Tìm kiếm: "${value}" (${value.length} ký tự)`
        : 'Chưa có tìm kiếm'
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            SearchBar Component Demo
          </h1>
          <p className="text-gray-600">Global Search Bar with Debounce</p>
        </div>

        {/* Demo 1: Basic Usage */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Demo 1: Basic Usage
          </h2>
          <SearchBar
            placeholder="Tìm kiếm khóa học..."
            onSearch={handleSearch}
          />
        </div>

        {/* Results Display */}
        <div className="bg-blue-50 rounded-xl border-2 border-blue-200 p-6 mb-6">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">
            Kết quả:
          </h3>
          <p className="text-blue-800">
            {results || 'Chưa có tìm kiếm - Nhập gì đó để thấy kết quả'}
          </p>
          {lastSearch && (
            <p className="text-sm text-blue-600 mt-2">
              Last query: <code className="bg-blue-100 px-2 py-1">{lastSearch}</code>
            </p>
          )}
        </div>

        {/* Demo 2: Custom Debounce */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Demo 2: Custom Debounce (300ms)
          </h2>
          <SearchBar
            placeholder="Debounce 300ms..."
            onSearch={(value) => console.log('Search 300ms:', value)}
            debounceDelay={300}
          />
          <p className="text-xs text-gray-500 mt-3">
            💡 Mở Console để xem log (debounce nhanh hơn)
          </p>
        </div>

        {/* Demo 3: Custom Styling */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Demo 3: Custom Width
          </h2>
          <SearchBar
            placeholder="Chiều rộng 100%..."
            onSearch={(value) => console.log('Search full width:', value)}
            className="w-full max-w-sm"
          />
        </div>
      </div>
    </div>
  );
}
