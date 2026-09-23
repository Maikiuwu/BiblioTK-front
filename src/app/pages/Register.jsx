import { ArrowLeft, ArrowRight, CheckCircle } from "@phosphor-icons/react";
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
import { registerUser } from "../../service/RegisterService";
import { createRegisterUserDto } from "../dto/registerUser.dto";
import {
	emailPattern,
	fieldLimits,
	namePattern,
	validateUserData as validateSharedUserData,
} from "../utils/userValidation.js";

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

	if (formData.contrasena.trim().length < 8) {
		return {
			field: "contrasena",
			message: "La contraseña debe tener al menos 8 caracteres.",
		};
	}

	return null;
}

function Register({ onBack }) {
	const [submitted, setSubmitted] = useState(false);
	const [formData, setFormData] = useState(initialFormData);
	const [fieldError, setFieldError] = useState(null);
	const [error, setError] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

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
						<CheckCircle aria-hidden="true" className="size-7" />
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
						onClick={onBack}
						trailingIcon={<ArrowRight aria-hidden="true" className="size-4" />}
					>
						Ir a iniciar sesión
					</Button>
				</div>
			) : (
				<>
					<button
						type="button"
						onClick={onBack}
						className="group inline-flex items-center gap-2 text-sm font-semibold text-ink-soft transition-colors duration-150 hover:text-pine-900"
					>
						<ArrowLeft
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
							label="Cédula de identidad"
							type="number"
							inputMode="numeric"
							pattern="[0-9]*"
							min="1"
							step="1"
							title="La cédula debe ser un número entero mayor que 0"
							placeholder="12345678"
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
							pattern={emailPattern}
							maxLength={fieldLimits.email}
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
							pattern={namePattern}
							minLength={2}
							maxLength={fieldLimits.nombres}
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
							pattern={namePattern}
							minLength={2}
							maxLength={fieldLimits.apellidos}
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
							maxLength={fieldLimits.nombreUsuario}
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
							pattern="[0-9]{7,15}"
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
							minLength={8}
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
								<ArrowRight aria-hidden="true" className="size-4" />
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
