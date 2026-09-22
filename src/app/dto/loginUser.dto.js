export function createLoginUserDto({ email, password, rememberMe }) {
	return {
		email,
		contrasena: password,
		recordarme: rememberMe,
	};
}
