export const ROUTES = {
	HOME: '/',
	LOGIN: '/login',
	REGISTER: '/register',
	FORGOT_PASSWORD: '/forgot-password',
	RESET_PASSWORD: '/reset-password',
	SUPPORT: '/support',
	DASHBOARD: '/dashboard',
	COURSES: '/courses',
	GRADES: '/grades',
	REPORTS: '/reports',
	PROFILE: '/profile',
	SETTINGS: '/settings',
	SETTINGS_PROFILE: '/settings/profile',
	SETTINGS_NOTIFICATIONS: '/settings/notifications',
	NOTIFICATIONS: '/notifications',
	HELP_CENTER: '/help-center'
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
