const registerUrl =
	import.meta.env.VITE_REGISTER_URL ??
	"http://localhost:3000/RegistroBiblioTK/Registro";

export async function registerUser(userData) {
	let response;

	// Sin credentials: registrarse no necesita cookies, y RegistroBiblioTK no habilita
	// credenciales en su CORS (con "include" el navegador bloquea la petición)
	try {
		response = await fetch(registerUrl, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(userData),
		});
	} catch {
		throw new Error("No se pudo conectar con el servicio de registro.");
	}

	const data = await response.json().catch(() => ({}));

	if (!response.ok) {
		const error = new Error(data.message ?? "No se pudo registrar el usuario.");
		// Nombre del campo con problema, cuando el backend lo indica (400 o 409)
		error.field = data.campo;
		throw error;
	}

	return data;
}
