'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  placeholder?: string;
  onSearch: (value: string) => void;
  debounceDelay?: number;
  className?: string;
  defaultValue?: string;
}

const SearchBar = ({
  placeholder = 'Search...',
  onSearch,
  debounceDelay = 500,
  className = '',
  defaultValue = '',
}: SearchBarProps) => {
  const [searchValue, setSearchValue] = useState(defaultValue);
  const [isFocused, setIsFocused] = useState(false);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const debouncedSearch = useCallback(
    (value: string) => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(() => onSearch(value), debounceDelay);
    },
    [debounceDelay, onSearch]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    debouncedSearch(value);
  };

  const handleClear = () => {
    setSearchValue('');
    onSearch('');
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
  };

  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, []);

  const containerClasses = isFocused
    ? 'border-blue-500 shadow-lg shadow-blue-100'
    : 'border-gray-200 hover:border-gray-300';

  const iconColor = isFocused ? 'text-blue-500' : 'text-gray-400';

  return (
    <div className={`relative w-full ${className}`}>
      <div className={`flex items-center gap-3 px-4 py-3 bg-white rounded-lg border-2 transition-all duration-200 ${containerClasses}`}>
        <Search size={20} className={`flex-shrink-0 transition-colors ${iconColor}`} />

        <input
          type="text"
          value={searchValue}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400 text-sm"
        />

        {searchValue && (
          <button
            onClick={handleClear}
            type="button"
            aria-label="Clear search"
            className="flex-shrink-0 p-1 rounded-full transition-all duration-200 hover:bg-gray-100 active:bg-gray-200"
          >
            <X size={18} className="text-gray-500 hover:text-gray-700" />
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
