import { useEffect, useState } from "react";
import {
	Navigate,
	Route,
	Routes,
	useNavigate,
} from "react-router-dom";

import { getCurrentSession } from "../../service/LoginService";

import Landing from "./Landing.jsx";
import Login from "./Login.jsx";
import Register from "./Register.jsx";

const ROLE_HOME = {
	usuario: {
		path: "/HomeUser",
		url: import.meta.env.VITE_USER_APP_URL,
	},
	admin: {
		path: "/HomeAdmin",
		url: import.meta.env.VITE_ADMIN_APP_URL,
	},
	superadmin: {
		path: "/HomeSuperAdmin",
		url: import.meta.env.VITE_SUPERADMIN_APP_URL,
	},
	catalogo: {
		path: "/HomeCatalogo",
		url: import.meta.env.VITE_CATALOGO_APP_URL,
	},
};

function getSessionRole(session) {
	return String(
		session?.user?.rol ??
			session?.user?.role ??
			session?.rol ??
			session?.role ??
			"",
	).trim().toLowerCase();
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

function AppContent() {
	const navigate = useNavigate();
	const [session, setSession] = useState(null);
	const [sessionMessage, setSessionMessage] = useState("");

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

	async function handleLoginSuccess() {
		try {
			const currentSession = await getCurrentSession();
			const user = currentSession?.user ?? null;
			setSession(user);
			const homeUrl = getRoleHomeUrl(getSessionRole(user));
			window.location.assign(homeUrl);
		} catch {
			setSession(null);
			setSessionMessage("No se pudo validar la sesión. Intenta nuevamente.");
			navigate("/login", { replace: true });
		}
	}

	return (
		<Routes>
			<Route path="/" element={<Landing />} />
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
