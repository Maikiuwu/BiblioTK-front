import { Link } from "react-router-dom";

function Landing() {
	return (
		<main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
			<h1>Bienvenido a BiblioTK</h1>
			<p>Accede a la biblioteca, inicia sesión o crea tu cuenta.</p>

			<div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem", flexWrap: "wrap" }}>
				<Link to="/login">
					<button type="button">Iniciar sesión</button>
				</Link>
				<Link to="/register">
					<button type="button">Registrarse</button>
				</Link>
				<a
					href="http://localhost:5146/Catalogo"
					target="_blank"
					rel="noreferrer"
				>
					<button type="button">Ir al catálogo</button>
				</a>
			</div>
		</main>
	);
}

export default Landing;