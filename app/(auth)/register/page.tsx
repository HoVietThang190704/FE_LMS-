"use client";

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import RegisterView, {
	type RegisterCopy,
	type RegisterFormValues,
	type RegisterStatus
} from './register';
import { ROUTES } from '@/lib/shared/constants/routeres';
import { INTERNAL_API_ENDPOINTS } from '@/lib/shared/constants/endpoint';
import { DEFAULT_LOCALE, getMessages } from '@/app/i18n';

const registerCopy = getMessages(DEFAULT_LOCALE).register as RegisterCopy;

const initialValues: RegisterFormValues = {
	fullName: '',
	email: '',
	phone: '',
	password: '',
	confirmPassword: '',
	acceptedTerms: false
};

export default function RegisterPage() {
	const router = useRouter();
	const [values, setValues] = useState<RegisterFormValues>(initialValues);
	const [status, setStatus] = useState<RegisterStatus>({ isSubmitting: false });

	useEffect(() => {
		router.prefetch(ROUTES.LOGIN);
	}, [router]);

	const handleFieldChange = useCallback((field: keyof RegisterFormValues, value: string | boolean) => {
		setValues((prev) => ({ ...prev, [field]: value }));
	}, []);

	const handleSubmit = useCallback(async () => {
		const trimmedName = values.fullName.trim();
		const trimmedEmail = values.email.trim();
		const trimmedPhone = values.phone.trim();
		const password = values.password.trim();
		const confirmPassword = values.confirmPassword.trim();

		if (!trimmedName || !trimmedEmail || !password || !confirmPassword) {
			setStatus({ isSubmitting: false, error: registerCopy.status.missingFields });
			return;
		}

		if (password !== confirmPassword) {
			setStatus({ isSubmitting: false, error: registerCopy.status.passwordMismatch });
			return;
		}

		if (!values.acceptedTerms) {
			setStatus({ isSubmitting: false, error: registerCopy.status.termsRequired });
			return;
		}

		setStatus({ isSubmitting: true });

		try {
			const response = await fetch(INTERNAL_API_ENDPOINTS.AUTH.REGISTER, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					email: trimmedEmail,
					password,
					userName: trimmedName,
					phone: trimmedPhone || undefined
				})
			});

			const payload = await response.json().catch(() => null);
			if (!response.ok) {
				throw new Error(payload?.message ?? registerCopy.status.genericError);
			}

			setStatus({ isSubmitting: false, success: registerCopy.status.success });
			router.push(ROUTES.LOGIN);
		} catch (error) {
			setStatus({
				isSubmitting: false,
				error: error instanceof Error ? error.message : registerCopy.status.genericError
			});
		}
	}, [values, router]);

	const handleGoToLogin = useCallback(() => {
		router.push(ROUTES.LOGIN);
	}, [router]);

	const handleSupport = useCallback(() => {
		router.push(ROUTES.SUPPORT);
	}, [router]);

	return (
		<RegisterView
			content={registerCopy}
			values={values}
			status={status}
			onChange={handleFieldChange}
			onSubmit={handleSubmit}
			onGoToLogin={handleGoToLogin}
			onSupport={handleSupport}
		/>
	);
}
