import type { User } from '@/types/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function loginFetch(email: string, password: string): Promise<{ user: User }> {
	const response = await fetch(`${API_URL}/auth/login`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		credentials: 'include',
		body: JSON.stringify({ email, password })
	});

	if (!response.ok) {
		const errorData = (await response.json().catch(() => null)) as
			| { errors?: Array<{ msg: string }>; message?: string; error?: string }
			| null;

		if (errorData?.errors && Array.isArray(errorData.errors)) {
			const errorMsg = errorData.errors.map((e) => e.msg).join(', ');
			throw new Error(errorMsg || 'Erro de validação');
		}
		if (errorData?.message) {
			throw new Error(errorData.message);
		}
		if (errorData?.error) {
			throw new Error(errorData.error);
		}
		if (response.status === 401) {
			throw new Error('Email ou palavra-passe incorretos');
		}
		throw new Error('Erro ao efetuar login');
	}

	const data = (await response.json()) as { user: User };
	return data;
}

export async function registerFetch(
	username: string,
	email: string,
	password: string
): Promise<{ user: User }> {
	const response = await fetch(`${API_URL}/auth/register`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		credentials: 'include',
		body: JSON.stringify({ username, email, password })
	});

	if (!response.ok) {
		const errorData = (await response.json().catch(() => null)) as
			| { errors?: Array<{ msg: string }>; message?: string; error?: string }
			| null;

		if (errorData?.errors && Array.isArray(errorData.errors)) {
			const errorMsg = errorData.errors.map((e) => e.msg).join(', ');
			throw new Error(errorMsg || 'Erro de validação');
		}
		if (errorData?.error) {
			throw new Error(errorData.error);
		}
		if (errorData?.message) {
			throw new Error(errorData.message);
		}
		throw new Error('Erro ao criar conta');
	}

	const data = (await response.json()) as { user: User };
	return data;
}

export async function healthAPI(): Promise<{ message: string }> {
	const res = await fetch(`${API_URL}/health`, {
		method: 'GET'
	});
	if (!res.ok)
		throw new Error("Erro de conexão");
	const data = (await res.json()) as { message: string };
	console.log(data);
	return data;
}

export async function getMe(): Promise<{ user: User }> {
	const res = await fetch(`${API_URL}/auth/me`, {
		method: 'GET',
		credentials: 'include'
	});
	if (!res.ok)
		throw new Error("Não autenticado");
	const data = (await res.json()) as { user: User };
	return data;
}

export async function logoutAPI(): Promise<void> {
	const res = await fetch(`${API_URL}/auth/logout`, {
		method: 'POST',
		credentials: 'include'
	});
	if (!res.ok)
		throw new Error("Erro ao terminar sessão");
}
