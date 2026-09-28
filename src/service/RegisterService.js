const registerUrl =
	import.meta.env.VITE_REGISTER_URL ??
	"http://localhost:3000/RegistroBiblioTK/Registro";

export async function registerUser(userData) {
	let response;

	try {
		response = await fetch(registerUrl, {
			method: "POST",
			credentials: "include",
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
