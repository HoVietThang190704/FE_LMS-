'use client';

import React, { Suspense } from 'react';
import SearchPageClient from './SearchPageClient';

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center py-12"><div className="text-gray-500">Loading...</div></div>}>
      <SearchPageClient />
    </Suspense>
  );
}