export default function LoginPage() {
	return (
		<form action="">
			<label htmlFor="email">Email</label>
			<input type="email" id="email" placeholder="username@example.com" />
			<label htmlFor="password">Password</label>
			<input type="password" id="password" />

			<div>
				<button type="submit">Login</button>
				<button>Login with Github</button>
			</div>
		</form>
	)
}