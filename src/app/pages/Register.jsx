import { ArrowLeftIcon } from "@phosphor-icons/react/ArrowLeft";
import { ArrowRightIcon } from "@phosphor-icons/react/ArrowRight";
import { CheckCircleIcon } from "@phosphor-icons/react/CheckCircle";
import {
	Alert,
	AuthLayout,
	authHeadlineClasses,
	Button,
	Checkbox,
	PasswordField,
	TextField,
} from "bibliotk-ui";
import { useState } from "react";
import { loginUser } from "../../service/LoginService";
import { registerUser } from "../../service/RegisterService";
import { createLoginUserDto } from "../dto/loginUser.dto";
import { createRegisterUserDto } from "../dto/registerUser.dto";
import { validateUserData as validateSharedUserData } from "../utils/userValidation.js";

const initialFormData = {
	nombres: "",
	apellidos: "",
	email: "",
	cc: "",
	contrasena: "",
	celular: "",
	nombreUsuario: "",
};

// Reglas de nombres/apellidos/cc/email/celular/nombreUsuario viven en userValidation.js
// (compartidas con la edición de perfil); acá solo se agrega la contraseña, que el perfil no tiene.
function validateUserData(formData) {
	const sharedError = validateSharedUserData(formData);

	if (sharedError) {
		return sharedError;
	}

	return null;
}

function Register({ onBack, onLogin }) {
	const [submitted, setSubmitted] = useState(false);
	const [formData, setFormData] = useState(initialFormData);
	const [fieldError, setFieldError] = useState(null);
	const [error, setError] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isLoggingIn, setIsLoggingIn] = useState(false);

	function handleChange(event) {
		const { name, value } = event.target;
		setFormData((currentData) => ({ ...currentData, [name]: value }));

		if (fieldError?.field === name) {
			setFieldError(null);
		}
	}

	function errorFor(field) {
		return fieldError?.field === field ? fieldError.message : undefined;
	}

	const handleSubmit = async (event) => {
		event.preventDefault();
		const validationError = validateUserData(formData);

		if (validationError) {
			setFieldError(validationError);
			setError("");
			document.getElementById(validationError.field)?.focus();
			return;
		}

		setFieldError(null);
		setError("");
		setIsSubmitting(true);

		const userData = createRegisterUserDto(formData);

		try {
			await registerUser(userData);
			setSubmitted(true);
		} catch (registerError) {
			if (registerError.field) {
				setFieldError({
					field: registerError.field,
					message: registerError.message,
				});
				document.getElementById(registerError.field)?.focus();
			} else {
				setError(registerError.message);
			}
		} finally {
			setIsSubmitting(false);
		}
	};

	async function handleAutoLogin() {
		setIsLoggingIn(true);
		setError("");

		try {
			const loginData = createLoginUserDto({
				email: formData.email,
				password: formData.contrasena,
				rememberMe: false,
			});
			const { user } = await loginUser(loginData);
			// Si ya se va a la app del rol, el botón sigue en "Ingresando..." hasta que cambie la página
			if (await onLogin(user?.rol)) return;
		} catch {
			// Si el auto-login falla por alguna razón, no dejamos al usuario
			// atrapado: lo mandamos al login manual para que lo intente de nuevo.
			onBack();
		}

		setIsLoggingIn(false);
	}

	return (
		<AuthLayout
			width="wide"
			headline={
				<h1 className={authHeadlineClasses}>
					Únete a la <span className="text-honey-400">comunidad</span> lectora.
				</h1>
			}
			description="Regístrate para comenzar a disfrutar tu biblioteca personal."
		>
			{submitted ? (
				<div className="motion-safe:animate-rise" role="status">
					<span className="grid size-14 place-items-center rounded-2xl bg-pine-900 text-honey-300">
						<CheckCircleIcon aria-hidden="true" className="size-7" />
					</span>
					<h2 className="mt-6 font-display text-[2.5rem] leading-none font-extrabold tracking-[-0.04em] text-pine-950">
						Cuenta creada
					</h2>
					<p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
						Bienvenido a la comunidad. Ya puedes iniciar sesión con tu correo y
						tu contraseña.
					</p>
					<Button
						size="lg"
						className="mt-8 w-full"
						onClick={handleAutoLogin}
						loading={isLoggingIn}
						trailingIcon={
							<ArrowRightIcon aria-hidden="true" className="size-4" />
						}
					>
						{isLoggingIn ? "Ingresando..." : "Ir a mi biblioteca"}
					</Button>
				</div>
			) : (
				<>
					<button
						type="button"
						onClick={onBack}
						className="group inline-flex items-center gap-2 text-sm font-semibold text-ink-soft transition-colors duration-150 hover:text-pine-900"
					>
						<ArrowLeftIcon
							aria-hidden="true"
							className="size-4 transition-transform duration-200 ease-out-strong group-hover:-translate-x-0.5"
						/>
						Volver al inicio de sesión
					</button>

					<div className="mt-8 motion-safe:animate-rise">
						<h2 className="font-display text-[2.5rem] leading-none font-extrabold tracking-[-0.04em] text-pine-950">
							Crear una cuenta
						</h2>
						<p className="mt-3 text-[15px] text-ink-soft">
							Completa tus datos para solicitar acceso a la biblioteca.
						</p>
					</div>

					<form
						onSubmit={handleSubmit}
						className="mt-8 grid gap-5 motion-safe:animate-rise [animation-delay:80ms] sm:grid-cols-2"
					>
						<TextField
							id="cc"
							name="cc"
							label="Número de identidad"
							type="text"
							inputMode="numeric"
							placeholder="12345678"
							title="Ingresa tu número de identidad sin puntos ni guiones"
							autoComplete="off"
							required
							value={formData.cc}
							onChange={handleChange}
							error={errorFor("cc")}
						/>
						<TextField
							id="email"
							name="email"
							label="Correo electrónico"
							type="email"
							placeholder="tu@correo.com"
							title="Usa un correo con dominio, por ejemplo tu@correo.com"
							autoComplete="email"
							required
							value={formData.email}
							onChange={handleChange}
							error={errorFor("email")}
						/>
						<TextField
							id="nombres"
							name="nombres"
							label="Nombres"
							type="text"
							placeholder="María"
							title="Solo se permiten letras, espacios, apóstrofes o guiones"
							autoComplete="given-name"
							required
							value={formData.nombres}
							onChange={handleChange}
							error={errorFor("nombres")}
						/>
						<TextField
							id="apellidos"
							name="apellidos"
							label="Apellidos"
							type="text"
							placeholder="González"
							title="Solo se permiten letras, espacios, apóstrofes o guiones"
							autoComplete="family-name"
							required
							value={formData.apellidos}
							onChange={handleChange}
							error={errorFor("apellidos")}
						/>
						<TextField
							id="nombreUsuario"
							name="nombreUsuario"
							label="Nombre de usuario"
							type="text"
							placeholder="mari"
							autoComplete="username"
							required
							value={formData.nombreUsuario}
							onChange={handleChange}
							error={errorFor("nombreUsuario")}
						/>
						<TextField
							id="celular"
							name="celular"
							label="Celular"
							type="tel"
							placeholder="04121234567"
							title="Ingresa entre 7 y 15 dígitos"
							autoComplete="tel"
							required
							value={formData.celular}
							onChange={handleChange}
							error={errorFor("celular")}
						/>
						<PasswordField
							id="contrasena"
							name="contrasena"
							label="Contraseña"
							placeholder="••••••••"
							autoComplete="new-password"
							hint="Usa al menos 8 caracteres."
							required
							value={formData.contrasena}
							onChange={handleChange}
							className="sm:col-span-2"
						/>

						<Checkbox
							id="terminos"
							name="terminos"
							label="Acepto los términos de uso"
							required
							className="sm:col-span-2"
						/>

						{error && (
							<Alert tone="error" className="sm:col-span-2">
								{error}
							</Alert>
						)}

						<Button
							type="submit"
							size="lg"
							loading={isSubmitting}
							trailingIcon={
								<ArrowRightIcon aria-hidden="true" className="size-4" />
							}
							className="mt-2 w-full sm:col-span-2"
						>
							{isSubmitting ? "Creando cuenta..." : "Crear cuenta"}
						</Button>
					</form>
				</>
			)}
		</AuthLayout>
	);
}

export default Register;
