const loginUrl =
	import.meta.env.VITE_LOGIN_URL ?? "http://localhost:3001/BiblioTK/Login";
const sessionUrl =
	import.meta.env.VITE_SESSION_URL ?? "http://localhost:3001/BiblioTK/Sesion";
const logoutUrl =
	import.meta.env.VITE_LOGOUT_URL ?? "http://localhost:3001/BiblioTK/Logout";

export async function loginUser(loginData) {
	const response = await fetch(loginUrl, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		credentials: "include",
		body: JSON.stringify(loginData),
	});

	if (!response.ok) {
		const error = await response.json().catch(() => ({}));
		throw new Error(error.message ?? "No se pudo iniciar sesión.");
	}

	return await response.json();
}

export async function getCurrentSession() {
	const response = await fetch(sessionUrl, {
		credentials: "include",
	});

	if (!response.ok) {
		throw new Error("Sesión no válida o expirada.");
	}

	return await response.json();
}

export async function logoutUser() {
	const response = await fetch(logoutUrl, {
		method: "POST",
		credentials: "include",
	});

	if (!response.ok) {
		throw new Error("No se pudo cerrar la sesión.");
	}
}
