export function createRegisterUserDto(formData) {
	return {
		nombres: formData.nombres.trim(),
		apellidos: formData.apellidos.trim(),
		email: formData.email.trim().toLowerCase(),
		cc: formData.cc.trim(),
		contrasena: formData.contrasena,
		celular: formData.celular.trim(),
		nombreUsuario: formData.nombreUsuario.trim(),
	};
}
