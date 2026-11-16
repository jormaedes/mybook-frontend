const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function loginFetch(email: string, password: string): Promise<any> {
	const response = await fetch(`${API_URL}/auth/login`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		credentials: 'include',
		body: JSON.stringify({ email, password })
	});

	if (!response.ok)
		return { error: "erro" }
	const data = await response.json();
	return data;
}

export async function healthAPI() : Promise<any> {
	const res = await fetch(`${API_URL}/health`, {
		method: 'GET'
	});
	const data = await res.json();
	console.log(data);
	return data;
}

export async function getMe() {
	
}