"use client";

import { type FormEvent } from 'react';
import { BookOpen, Loader2, Lock, Mail, Phone, ShieldCheck, User } from 'lucide-react';
import { Plus_Jakarta_Sans } from 'next/font/google';

const plusJakarta = Plus_Jakarta_Sans({
	subsets: ['latin'],
	weight: ['400', '500', '600', '700']
});

export type RegisterFormValues = {
	fullName: string;
	email: string;
	phone: string;
	password: string;
	confirmPassword: string;
	acceptedTerms: boolean;
};

export type RegisterStatus = {
	isSubmitting: boolean;
	error?: string;
	success?: string;
};

export type RegisterCopy = {
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
		fullNameLabel: string;
		fullNamePlaceholder: string;
		emailLabel: string;
		emailPlaceholder: string;
		phoneLabel: string;
		phonePlaceholder: string;
		passwordLabel: string;
		passwordPlaceholder: string;
		confirmPasswordLabel: string;
		confirmPasswordPlaceholder: string;
	};
	actions: {
		submit: string;
		haveAccount: string;
		loginCta: string;
		support: string;
		terms: string;
	};
	status: {
		success: string;
		passwordMismatch: string;
		missingFields: string;
		termsRequired: string;
		genericError: string;
	};
	helper: {
		footnote: string;
	};
};

type RegisterViewProps = {
	content: RegisterCopy;
	values: RegisterFormValues;
	status: RegisterStatus;
	onChange: (field: keyof RegisterFormValues, value: string | boolean) => void;
	onSubmit: () => void;
	onGoToLogin: () => void;
	onSupport?: () => void;
};

export default function RegisterView({
	content,
	values,
	status,
	onChange,
	onSubmit,
	onGoToLogin,
	onSupport
}: RegisterViewProps) {
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

			<div className="relative z-10 w-full max-w-2xl">
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
						<button
							type="button"
							onClick={onGoToLogin}
							className="rounded-full px-4 py-2 transition-all"
						>
							{content.tabs.login}
						</button>
						<button
							type="button"
							className="rounded-full bg-white px-4 py-2 text-gray-900 shadow-sm"
						>
							{content.tabs.register}
						</button>
					</div>

					<form className="grid grid-cols-1 gap-5" onSubmit={handleSubmit}>
						<label className="block text-sm font-medium text-gray-700">
							<span>{content.fields.fullNameLabel}</span>
							<div className="mt-2 flex items-center rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 transition focus-within:border-gray-400">
								<User className="mr-3 text-gray-400" size={18} aria-hidden="true" />
								<input
									type="text"
									className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
									placeholder={content.fields.fullNamePlaceholder}
									value={values.fullName}
									onChange={(event) => onChange('fullName', event.target.value)}
									autoComplete="name"
								/>
							</div>
						</label>

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
							<span>{content.fields.phoneLabel}</span>
							<div className="mt-2 flex items-center rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 transition focus-within:border-gray-400">
								<Phone className="mr-3 text-gray-400" size={18} aria-hidden="true" />
								<input
									type="tel"
									className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
									placeholder={content.fields.phonePlaceholder}
									value={values.phone}
									onChange={(event) => onChange('phone', event.target.value)}
									autoComplete="tel"
								/>
							</div>
						</label>

						<div className="grid gap-5 md:grid-cols-2">
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
										autoComplete="new-password"
									/>
								</div>
							</label>

							<label className="block text-sm font-medium text-gray-700">
								<span>{content.fields.confirmPasswordLabel}</span>
								<div className="mt-2 flex items-center rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 transition focus-within:border-gray-400">
									<Lock className="mr-3 text-gray-400" size={18} aria-hidden="true" />
									<input
										type="password"
										className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
										placeholder={content.fields.confirmPasswordPlaceholder}
										value={values.confirmPassword}
										onChange={(event) => onChange('confirmPassword', event.target.value)}
										autoComplete="new-password"
									/>
								</div>
							</label>
						</div>

						<label className="flex cursor-pointer select-none items-center gap-3 rounded-2xl border border-dashed border-indigo-200/80 bg-indigo-50/60 px-4 py-4 text-sm font-medium text-gray-600">
							<input
								type="checkbox"
								className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
								checked={values.acceptedTerms}
								onChange={(event) => onChange('acceptedTerms', event.target.checked)}
							/>
							<span className="flex items-center gap-2 text-left">
								<ShieldCheck className="text-indigo-500" size={18} aria-hidden="true" />
								{content.actions.terms}
							</span>
						</label>

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

					<p className="mt-6 text-center text-sm text-gray-600">
						{content.actions.haveAccount}{' '}
						<button type="button" className="font-semibold text-indigo-600" onClick={onGoToLogin}>
							{content.actions.loginCta}
						</button>
					</p>
					<p className="mt-2 text-center text-xs text-gray-400">{content.helper.footnote}</p>
				</div>
			</div>

			{onSupport && (
				<button
					type="button"
					aria-label={content.actions.support}
					onClick={onSupport}
					className="fixed bottom-6 right-6 flex h-12 w-12 items-center justify-center rounded-full bg-gray-900 text-white shadow-lg shadow-gray-900/30 transition hover:bg-gray-800"
				>
					?
				</button>
			)}
		</div>
	);
}
