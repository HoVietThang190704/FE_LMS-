'use client';

import React from 'react';
import { ChevronDown } from 'lucide-react';
import type { CodeLanguage } from '@/lib/types/exercises';

interface LanguageSelectorProps {
  value: CodeLanguage;
  onChange: (language: CodeLanguage) => void;
}

const LANGUAGES: { label: string; value: CodeLanguage }[] = [
  { label: 'PYTHON', value: 'python' },
  { label: 'JAVA', value: 'java' },
  { label: 'C', value: 'c' },
  { label: 'C++', value: 'cpp' },
  { label: 'RUST', value: 'rust' },
];

export default function LanguageSelector({ value, onChange }: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLanguage = LANGUAGES.find((lang) => lang.value === value);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 border border-gray-300 bg-white rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
      >
        {currentLanguage?.label}
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-1 w-40 bg-white border border-gray-300 rounded-lg shadow-lg z-50">
          {LANGUAGES.map((language) => (
            <button
              key={language.value}
              onClick={() => {
                onChange(language.value);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                value === language.value
                  ? 'bg-blue-50 text-blue-600 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {language.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
