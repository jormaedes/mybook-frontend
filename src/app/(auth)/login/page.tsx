'use client';

import { useAuthStore } from "@/components/stores/auth";
import { useState, type FormEvent, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { redirectToGithub } from "@/lib/api";

function LoginForm() {
	const searchParams = useSearchParams();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const login = useAuthStore((s) => s.login);
	const loginAsGuest = useAuthStore((s) => s.loginAsGuest);
	const logout = useAuthStore((s) => s.logout);
	const user = useAuthStore((s) => s.user);
	const status = useAuthStore((s) => s.status);

	const errorParam = searchParams.get('error');
	const displayedError =
		errorMessage ??
		(errorParam === 'github' ? 'Falha na autenticação com o GitHub. Por favor, tente novamente.' : null);

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

	async function handleGuestLogin() {
		setErrorMessage(null);
		setIsSubmitting(true);
		try {
			await loginAsGuest();
		} catch (error: unknown) {
			if (error instanceof Error) {
				setErrorMessage(error.message);
			} else {
				setErrorMessage('Erro ao entrar como convidado');
			}
		} finally {
			setIsSubmitting(false);
		}
	}

	if (status === 'authenticated' && user) {
		return (
			<div>
				{user.avatarUrl && (
					/* eslint-disable-next-line @next/next/no-img-element */
					<img
						src={user.avatarUrl}
						alt={user.username}
						width={64}
						height={64}
						style={{ borderRadius: '50%' }}
					/>
				)}
				<p>{user.username} ({user.email}) Autenticado</p>
				{user.isGuest && (
					<p style={{ color: '#666', fontSize: '0.9rem' }}>
						Conta de demonstração (Convidado) - Não é permitido alterar o username nem a palavra-passe.
					</p>
				)}
				{user.githubId && <small>Conta autenticada com GitHub</small>}
				<div style={{ marginTop: '1rem' }}>
					<button type="button" onClick={() => logout()}>
						Terminar sessão
					</button>
				</div>
			</div>
		);
	}

	return (
		<div>
			<h1>Entrar</h1>

			{displayedError && (
				<div style={{ color: 'red', marginBottom: '1rem' }}>
					{displayedError}
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
					<button type="button" onClick={redirectToGithub} disabled={isSubmitting}>
						Entrar com Github
					</button>
				</div>

				<div>
					<button type="button" onClick={handleGuestLogin} disabled={isSubmitting}>
						{isSubmitting ? 'A entrar...' : 'Entrar como convidado'}
					</button>
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

export default function LoginPage() {
	return (
		<Suspense fallback={<div>A carregar...</div>}>
			<LoginForm />
		</Suspense>
	);
}
