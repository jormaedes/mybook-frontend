'use client';

import { useAuthStore } from "@/components/stores/auth";
import { useState, type FormEvent } from "react";
import Link from "next/link";
import { redirectToGithub } from "@/lib/api";

export default function RegisterPage() {
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const register = useAuthStore((s) => s.register);
	const logout = useAuthStore((s) => s.logout);
	const user = useAuthStore((s) => s.user);
	const status = useAuthStore((s) => s.status);

	async function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setErrorMessage(null);

		const trimmedUsername = username.trim();
		const trimmedEmail = email.trim();

		if (!trimmedUsername) {
			setErrorMessage('Erro: Username não pode ser vazio');
			return;
		}

		if (!trimmedEmail) {
			setErrorMessage('Erro: Email não pode ser vazio');
			return;
		}

		if (!password.trim()) {
			setErrorMessage('A palavra-passe é obrigatória');
			return;
		}

		if (password !== confirmPassword) {
			setErrorMessage('As palavras-passe não coincidem');
			return;
		}

		setIsSubmitting(true);
		try {
			await register(trimmedUsername, trimmedEmail, password);
		} catch (error: unknown) {
			if (error instanceof Error) {
				setErrorMessage(error.message);
			} else {
				setErrorMessage('Erro ao criar conta');
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
			<h1>Criar Conta</h1>

			{errorMessage && (
				<div style={{ color: 'red', marginBottom: '1rem' }}>
					{errorMessage}
				</div>
			)}

			<form onSubmit={handleSubmit}>
				<div>
					<label htmlFor="username">Username</label>
					<input
						type="text"
						id="username"
						name="username"
						placeholder="johndoe"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						required
					/>
				</div>

				<div>
					<label htmlFor="email">Email</label>
					<input
						type="email"
						id="email"
						name="email"
						placeholder="username@example.com"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
				</div>

				<div>
					<label htmlFor="password">Palavra-passe</label>
					<input
						type="password"
						id="password"
						name="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
				</div>

				<div>
					<label htmlFor="confirmPassword">Confirmar Palavra-passe</label>
					<input
						type="password"
						id="confirmPassword"
						name="confirmPassword"
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
						required
					/>
				</div>

				<div>
					<button type="submit" disabled={isSubmitting}>
						{isSubmitting ? 'A registar...' : 'Registar'}
					</button>
				</div>

				<div>
					<button type="button" onClick={redirectToGithub}>
						Registar com Github
					</button>
				</div>

				<div>
					<p>
						Já tem uma conta? <Link href="/login">Entrar</Link>
					</p>
				</div>
			</form>
		</div>
	);
}
