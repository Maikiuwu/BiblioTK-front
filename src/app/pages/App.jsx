import { useEffect, useState } from "react";
import {
	Navigate,
	Route,
	Routes,
	useNavigate,
	useSearchParams,
} from "react-router-dom";

import { getCurrentSession } from "../../service/LoginService";

import Catalogo from "./Catalogo.jsx";
import Landing from "./Landing.jsx";
import Login from "./Login.jsx";
import Register from "./Register.jsx";

const ROLE_HOME = {
	usuario: {
		path: "/HomeUser",
		url: import.meta.env.VITE_USER_APP_URL ?? "http://localhost:5173",
	},
	admin: {
		path: "/HomeAdmin",
		url: import.meta.env.VITE_ADMIN_APP_URL ?? "http://localhost:5174",
	},
	superadmin: {
		path: "/HomeSuperAdmin",
		url: import.meta.env.VITE_SUPERADMIN_APP_URL ?? "http://localhost:5145",
	},
	catalogo: {
		path: "/HomeCatalogo",
		url: import.meta.env.VITE_CATALOGO_APP_URL ?? "http://localhost:5146",
	},
};

// bibliotk_rol la deja InicioSesionBiblioTK en el mismo POST /Login, sin httpOnly:
// evita esperar un segundo /Sesion solo para saber a qué app redirigir
function leerCookie(nombre) {
	const fila = document.cookie
		.split("; ")
		.find((parte) => parte.startsWith(`${nombre}=`));
	return fila ? decodeURIComponent(fila.split("=")[1]) : null;
}

function getRoleHomeUrl(role) {
	const normalizedRole = String(role ?? "")
		.trim()
		.toLowerCase()
	.replace(/\s+/g, "");
	const destination = ROLE_HOME[normalizedRole];

	if (!destination) {
		return "/";
	}

	return new URL(
		destination.path,
		destination.url || window.location.origin,
	).toString();
}

// Motivo con el que otra app redirige acá tras un window.location.assign
// (no se puede pasar estado de React entre apps distintas, solo la URL)
const MOTIVO_MENSAJES = {
	sesion_expirada: "Tu sesión finalizó. Inicia sesión nuevamente.",
	sin_permiso: "No tienes permiso para acceder a esa sección con esta cuenta.",
	cuenta_eliminada: "Tu cuenta fue eliminada. Gracias por haber sido parte de BiblioTK.",
};

function AppContent() {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const [session, setSession] = useState(null);
	const [sessionMessage, setSessionMessage] = useState(
		() => MOTIVO_MENSAJES[searchParams.get("motivo")] ?? "",
	);

	useEffect(() => {
		let isActive = true;

		getCurrentSession()
			.then((currentSession) => {
				if (!isActive) return;
				setSession(currentSession?.user ?? null);
			})
			.catch(() => {
				if (!isActive) return;
				setSession(null);
			});

		return () => {
			isActive = false;
		};
	}, []);

	function handleLoginSuccess() {
		const rol = leerCookie("bibliotk_rol");

		if (!rol) {
			setSessionMessage("No se pudo validar la sesión. Intenta nuevamente.");
			navigate("/login", { replace: true });
			return;
		}

		window.location.assign(getRoleHomeUrl(rol));
	}

	return (
		<Routes>
			<Route path="/" element={<Landing />} />
			<Route path="/catalogo" element={<Catalogo />} />
			<Route
				path="/login"
				element={
					<Login
						onLogin={handleLoginSuccess}
						onRegister={() => navigate("/register")}
						sessionMessage={sessionMessage}
					/>
				}
			/>
			<Route path="/register" element={<Register onBack={() => navigate("/login")} />} />
			<Route path="*" element={<Navigate to="/" replace />} />
		</Routes>
	);
}

function App() {
	return <AppContent />;
}

export default App;
