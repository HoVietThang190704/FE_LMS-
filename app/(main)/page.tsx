import React from 'react';
import HomeUI from './home-ui';
import { mockStats, mockClasses, mockAssignments, mockNotifications } from '@/lib/mocks/homeData';

export default function HomePage() {
  // page-level logic can go here (data fetching, filtering, etc.)
  return <HomeUI stats={mockStats} classes={mockClasses} assignments={mockAssignments} notifications={mockNotifications} />;
}
