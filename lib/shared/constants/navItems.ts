import type { ComponentType, SVGProps } from 'react';
import { BookOpen, Home, Award, BarChart3 } from 'lucide-react';
import { ROUTES } from './routeres';

export type NavItem = {
  labelKey: string;
  href: string;
  icon: ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;
};

export const NAV_ITEMS: NavItem[] = [
  { labelKey: 'nav.home', href: ROUTES.HOME, icon: Home },
  { labelKey: 'nav.courses', href: ROUTES.COURSES, icon: BookOpen },
  { labelKey: 'nav.grades', href: ROUTES.GRADES, icon: Award },
  { labelKey: 'nav.reports', href: ROUTES.REPORTS, icon: BarChart3 },
];
