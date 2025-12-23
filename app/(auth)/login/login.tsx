"use client";

import { type FormEvent } from 'react';
import { BookOpen, Mail, Lock, Loader2 } from 'lucide-react';
import { Plus_Jakarta_Sans } from 'next/font/google';

const plusJakarta = Plus_Jakarta_Sans({
	subsets: ['latin'],
	weight: ['400', '500', '600', '700']
});

export type AuthMode = 'login' | 'register';

export type AuthFormValues = {
	email: string;
	password: string;
	rememberMe: boolean;
};

export type AuthStatus = {
	isSubmitting: boolean;
	error?: string;
	success?: string;
};

export type AuthCopy = {
	brand: {
		name: string;
		tagline: string;
	};
	welcome: {
		heading: string;
		description: string;
	};
	tabs: {
		login: string;
		register: string;
	};
	fields: {
		emailLabel: string;
		emailPlaceholder: string;
		passwordLabel: string;
		passwordPlaceholder: string;
	};
	actions: {
		remember: string;
		forgot: string;
		submit: string;
		demoLabel: string;
		demoAction: string;
	};
	helper: {
		demoHint: string;
		footer: string;
	};
	status: {
		success: string;
	};
};

type LoginViewProps = {
	mode: AuthMode;
	content: AuthCopy;
	values: AuthFormValues;
	status: AuthStatus;
	demoCredentials: {
		email: string;
		password: string;
	};
	onModeChange: (mode: AuthMode) => void;
	onChange: (field: keyof AuthFormValues, value: string | boolean) => void;
	onSubmit: () => void;
	onForgotPassword: () => void;
	onFillDemo: () => void;
	onSupport?: () => void;
};

export default function LoginView({
	mode,
	content,
	values,
	status,
	demoCredentials,
	onModeChange,
	onChange,
	onSubmit,
	onForgotPassword,
	onFillDemo,
	onSupport
}: LoginViewProps) {
	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		onSubmit();
	};

	return (
		<div
			className={`${plusJakarta.className} relative flex min-h-dvh w-full items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top,#dfeaff,#f8fbff)] px-4 py-10 text-gray-900`}
		>
			<div
				className="pointer-events-none absolute inset-x-0 top-0 h-64"
				aria-hidden="true"
				style={{
					background: 'linear-gradient(180deg, rgba(199,210,254,0.7) 0%, rgba(255,255,255,0) 100%)'
				}}
			/>
			<div className="pointer-events-none absolute -bottom-32 -right-16 h-72 w-72 rounded-full bg-indigo-200/60 blur-3xl" aria-hidden="true" />
			<div className="pointer-events-none absolute -top-16 -left-10 h-56 w-56 rounded-full bg-cyan-100/70 blur-3xl" aria-hidden="true" />

			<div className="relative z-10 w-full max-w-md">
				<div className="mb-8 text-center">
					<div
						className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl text-white shadow-xl"
						style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #312e81 100%)' }}
					>
						<BookOpen size={28} />
					</div>
					<p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-500">{content.brand.tagline}</p>
					<h1 className="mt-2 text-3xl font-semibold text-gray-900">{content.brand.name}</h1>
				</div>

				<div className="rounded-3xl bg-white/90 p-8 shadow-2xl shadow-indigo-100 ring-1 ring-indigo-100 backdrop-blur">
					<div className="mb-8 text-center">
						<p className="text-lg font-semibold text-gray-900">{content.welcome.heading}</p>
						<p className="mt-1 text-sm text-gray-500">{content.welcome.description}</p>
					</div>

					<div className="mb-8 grid grid-cols-2 gap-2 rounded-full bg-indigo-50 p-1 text-sm font-semibold text-indigo-500">
						{(['login', 'register'] as AuthMode[]).map((tab) => (
							<button
								key={tab}
								type="button"
								onClick={() => onModeChange(tab)}
								className={`rounded-full px-4 py-2 transition-all ${
									mode === tab ? 'bg-white text-gray-900 shadow-sm' : 'text-indigo-500'
								}`}
								aria-pressed={mode === tab}
							>
								{tab === 'login' ? content.tabs.login : content.tabs.register}
							</button>
						))}
					</div>

					<form className="space-y-5" onSubmit={handleSubmit}>
						<label className="block text-sm font-medium text-gray-700">
							<span>{content.fields.emailLabel}</span>
							<div className="mt-2 flex items-center rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 transition focus-within:border-gray-400">
								<Mail className="mr-3 text-gray-400" size={18} aria-hidden="true" />
								<input
									type="email"
									className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
									placeholder={content.fields.emailPlaceholder}
									value={values.email}
									onChange={(event) => onChange('email', event.target.value)}
									autoComplete="email"
								/>
							</div>
						</label>

						<label className="block text-sm font-medium text-gray-700">
							<span>{content.fields.passwordLabel}</span>
							<div className="mt-2 flex items-center rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 transition focus-within:border-gray-400">
								<Lock className="mr-3 text-gray-400" size={18} aria-hidden="true" />
								<input
									type="password"
									className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
									placeholder={content.fields.passwordPlaceholder}
									value={values.password}
									onChange={(event) => onChange('password', event.target.value)}
									autoComplete="current-password"
								/>
							</div>
						</label>

						<div className="flex items-center justify-between text-sm">
							<label className="flex cursor-pointer select-none items-center gap-2 text-gray-600">
								<input
									type="checkbox"
									className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
									checked={values.rememberMe}
									onChange={(event) => onChange('rememberMe', event.target.checked)}
								/>
								{content.actions.remember}
							</label>
							<button
								type="button"
								className="font-semibold text-indigo-600 transition hover:text-indigo-500"
								onClick={onForgotPassword}
							>
								{content.actions.forgot}
							</button>
						</div>

						{status.error && (
							<p role="alert" className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
								{status.error}
							</p>
						)}

						{status.success && (
							<p role="status" className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-600">
								{status.success}
							</p>
						)}

						<button
							type="submit"
							className="flex w-full items-center justify-center rounded-2xl bg-gray-900 py-3 text-sm font-semibold text-white shadow-lg shadow-gray-900/20 transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
							disabled={status.isSubmitting}
						>
							{status.isSubmitting ? (
								<span className="flex items-center gap-2">
									<Loader2 className="animate-spin" size={18} />
									{content.actions.submit}
								</span>
							) : (
								content.actions.submit
							)}
						</button>
					</form>
					<p className="mt-6 text-center text-xs text-gray-400">{content.helper.footer}</p>
				</div>
			</div>

			{onSupport && (
				<button
					type="button"
					aria-label="Support"
					onClick={onSupport}
					className="fixed bottom-6 right-6 flex h-12 w-12 items-center justify-center rounded-full bg-gray-900 text-white shadow-lg shadow-gray-900/30 transition hover:bg-gray-800"
				>
					?
				</button>
			)}
		</div>
	);
}
