const getEnv = (key: string, fallback: string) => {
	const value = process.env[key]?.trim();
	return value && value.length > 0 ? value : fallback;
};

const trimSlashes = (value: string) => value.replace(/(^\/+)|(\/+$)/g, '');

const API_BASE_URL = getEnv('NEXT_PUBLIC_API_BASE_URL', 'http://localhost:5000');
const buildExternal = (path: string) => {
	const clean = trimSlashes(path);
	return `${API_BASE_URL}/${clean}`;
};

export const INTERNAL_API_ENDPOINTS = {
	AUTH: {
		LOGIN: '/api/login',
		REGISTER: '/api/register',
		CHANGE_PASSWORD: '/api/auth/change-password'
	},
	USER: {
		PROFILE: '/api/user/profile'
	}
} as const;

export const EXTERNAL_API_ENDPOINTS = {
	AUTH: {
		LOGIN: buildExternal('api/auth/login'),
		REGISTER: buildExternal('api/auth/register'),
		REFRESH: buildExternal('api/auth/refresh'),
		LOGOUT: buildExternal('api/auth/logout'),
		CHANGE_PASSWORD: buildExternal('api/auth/change-password')
	},
	USER: {
		PROFILE: buildExternal('api/users/me/profile'),
		AVATAR: buildExternal('api/users/me/avatar')
	},
	TICKET: {
		LIST: buildExternal('api/tickets'),
		DETAIL: (id: string) => buildExternal(`api/tickets/${id}`)
	},
	NOTIFICATION: {
		LIST: buildExternal('api/notifications'),
		SUMMARY: buildExternal('api/notifications/summary')
	}
} as const;

export const API_QUERY_PARAMS = {
	PAGE: 'page',
	LIMIT: 'limit',
	SEARCH: 'search',
	ROLE: 'role',
	STATUS: 'status'
} as const;

export type ApiQueryParam = (typeof API_QUERY_PARAMS)[keyof typeof API_QUERY_PARAMS];
