'use client';

import { loginFetch, healthAPI } from "@/lib/api";
import { useState } from "react";

export default function LoginPage() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	async function handleLogin() {
		const data = await loginFetch(email, password);
		console.log(data);
	}

	return (
		<>
		<form action="">
			<label htmlFor="email">Email</label>
			<input
				type="email"
				id="email"
				placeholder="username@example.com"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
			/>
			<label htmlFor="password">Password</label>
			<input
				type="password"
				id="password"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
			/>

			<div>
				<button>Login with Github</button>
			</div>
		</form>
				<button onClick={ () => handleLogin() }>Login</button>
		</>

	)
}