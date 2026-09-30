import { ArrowRight } from "@phosphor-icons/react/ArrowRight";
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
import { createLoginUserDto } from "../dto/loginUser.dto";

function Login({ onLogin, onRegister, sessionMessage }) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [rememberMe, setRememberMe] = useState(false);
	const [error, setError] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	function isValidEmail(value) {
		return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
	}

	async function handleSubmit(event) {
		event.preventDefault();
		setError("");

		if (!isValidEmail(email)) {
			setError("Ingresa un correo válido, por ejemplo: tu@correo.com.");
			return;
		}

		setIsSubmitting(true);

		try {
			const loginData = createLoginUserDto({ email, password, rememberMe });
			const { user } = await loginUser(loginData);
			// Si ya se va a la app del rol, el botón sigue en "Verificando..." hasta que cambie la página
			if (await onLogin(user?.rol)) return;
		} catch (loginError) {
			setError(loginError.message);
		}

		setIsSubmitting(false);
	}

	return (
		<AuthLayout
			headline={
				<h1 className={authHeadlineClasses}>
					El placer de <span className="text-honey-400">encontrar</span> una
					buena historia.
				</h1>
			}
			description="Gestiona tus lecturas y descubre tu próxima aventura."
		>
			<div className="motion-safe:animate-rise">
				<h2 className="font-display text-[2.5rem] leading-none font-extrabold tracking-[-0.04em] text-pine-950">
					Inicia sesión
				</h2>
				<p className="mt-3 text-[15px] text-ink-soft">
					Accede a tu espacio personal de lectura.
				</p>
			</div>

			{sessionMessage && (
				<Alert tone="info" className="mt-6">
					{sessionMessage}
				</Alert>
			)}

			<form
				onSubmit={handleSubmit}
				className="mt-8 grid gap-5 motion-safe:animate-rise [animation-delay:80ms]"
			>
				<TextField
					id="email"
					label="Correo electrónico"
					type="email"
					value={email}
					onChange={(event) => setEmail(event.target.value)}
					placeholder="tu@correo.com"
					pattern="[^\s@]+@[^\s@]+\.[^\s@]{2,}"
					title="Usa un correo con dominio, por ejemplo tu@correo.com"
					autoComplete="email"
					required
				/>
				<PasswordField
					id="password"
					label="Contraseña"
					value={password}
					onChange={(event) => setPassword(event.target.value)}
					placeholder="••••••••"
					autoComplete="current-password"
					required
				/>

				<div className="flex flex-wrap items-center justify-between gap-3">
					<Checkbox
						id="remember-me"
						label="Recordarme"
						checked={rememberMe}
						onChange={(event) => setRememberMe(event.target.checked)}
					/>
					<span
						title="Disponible próximamente"
						className="text-[13px] font-medium text-ink-faint"
					>
						¿Olvidaste tu contraseña?
					</span>
				</div>

				{error && <Alert tone="error">{error}</Alert>}

				<Button
					type="submit"
					size="lg"
					loading={isSubmitting}
					trailingIcon={<ArrowRight aria-hidden="true" className="size-4" />}
					className="mt-2 w-full"
				>
					{isSubmitting ? "Verificando..." : "Entrar"}
				</Button>
			</form>

			<p className="mt-8 text-center text-sm text-ink-soft motion-safe:animate-rise [animation-delay:160ms]">
				¿Aún no tienes una cuenta?{" "}
				<button
					type="button"
					onClick={onRegister}
					className="font-semibold text-pine-900 underline decoration-honey-500 decoration-2 underline-offset-4 transition-colors duration-150 hover:text-honey-700"
				>
					Solicita acceso
				</button>
			</p>
		</AuthLayout>
	);
}

export default Login;
