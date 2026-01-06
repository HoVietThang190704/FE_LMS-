'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import SearchClient from './SearchClient';
import { searchCourses, CourseSearchResult } from '@/lib/api/search';

export default function SearchPageClient() {
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
      setPage(1);
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
    <SearchClient
      query={query}
      searchValue={searchValue}
      onSearchValueChange={setSearchValue}
      onSearchSubmit={handleSearch}
      results={results}
      isLoading={isLoading}
      total={total}
      page={page}
      onPageChange={handlePageChange}
      took={took}
      elasticsearchAvailable={elasticsearchAvailable}
      totalPages={totalPages}
    />
  );
}
