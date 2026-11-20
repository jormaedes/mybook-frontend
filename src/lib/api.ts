const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function loginFetch(email: string, password: string): Promise<any> {
	const response = await fetch(`${API_URL}/auth/login`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		credentials: 'include',
		body: JSON.stringify({ email, password })
	});

	if (!response.ok)
		throw Error("Error");
	const data = await response.json();
	return data;
}

export async function healthAPI() : Promise<any> {
	const res = await fetch(`${API_URL}/health`, {
		method: 'GET'
	});
	if (!res.ok)
		throw Error("Error");
	const data = await res.json();
	console.log(data);
	return data;
}

export async function getMe() {
	const res = await fetch(`${API_URL}/auth/me`);
	if (!res.ok)
		throw Error("Error");
	const data = await res.json();
	return data;
}

export async function logoutAPI() {
	const res = await fetch(`${API_URL}/auth/logout`);
}