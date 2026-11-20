'use client';

import { useAuthStore } from "@/components/stores/auth";
import { useState, type FormEvent } from "react";
import Link from "next/link";

export default function LoginPage() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const login = useAuthStore((s) => s.login);
	const user = useAuthStore((s) => s.user);
	const status = useAuthStore((s) => s.status);

	async function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setErrorMessage(null);

		const trimmedEmail = email.trim();
		if (!trimmedEmail) {
			setErrorMessage('Erro: Email não pode ser vazio');
			return;
		}

		if (!password.trim()) {
			setErrorMessage('A palavra-passe é obrigatória');
			return;
		}

		setIsSubmitting(true);
		try {
			await login(trimmedEmail, password);
		} catch (error: unknown) {
			if (error instanceof Error) {
				setErrorMessage(error.message);
			} else {
				setErrorMessage('Erro ao efetuar login');
			}
		} finally {
			setIsSubmitting(false);
		}
	}

	if (status === 'authenticated' && user) {
		return (
			<div>
				<p>{user.email} Autenticado</p>
			</div>
		);
	}

	return (
		<div>
			<h1>Entrar</h1>

			{errorMessage && (
				<div style={{ color: 'red', marginBottom: '1rem' }}>
					{errorMessage}
				</div>
			)}

			<form onSubmit={handleSubmit}>
				<div>
					<label htmlFor="email">Email</label>
					<input
						type="email"
						id="email"
						placeholder="username@example.com"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
				</div>

				<div>
					<label htmlFor="password">Password</label>
					<input
						type="password"
						id="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
				</div>

				<div>
					<button type="submit" disabled={isSubmitting}>
						{isSubmitting ? 'A entrar...' : 'Login'}
					</button>
				</div>

				<div>
					<button type="button">Login with Github</button>
				</div>

				<div>
					<p>
						Não tem uma conta? <Link href="/register">Criar conta</Link>
					</p>
				</div>
			</form>
		</div>
	);
}
