import { buttonClasses, Logo } from "bibliotk-ui";
import { Link } from "react-router-dom";

// Compartido entre Landing y Catalogo: ambas son páginas públicas de esta app.
// No va a bibliotk-ui porque tiene rutas propias de esta app, no es un primitivo genérico.
function PublicNav() {
	return (
		<header className="sticky top-0 z-40 bg-linear-to-b from-sand-100 from-60% to-sand-100/0 pb-4">
			<div className="flex h-16 w-full items-center justify-between gap-2 bg-pine-900 py-2 pr-3 pl-4 text-sand-50 shadow-[0_18px_40px_-24px_rgb(11_34_28/0.6)] sm:pr-6 sm:pl-5">
				<Link to="/" className="rounded-full">
					<Logo tone="light" hideWordmarkOnMobile />
				</Link>
				<nav aria-label="Principal" className="flex items-center gap-2 sm:gap-3">
					<Link
						to="/catalogo"
						className="hidden px-3 text-sm font-semibold text-pine-200 transition-colors duration-150 hover:text-sand-50 sm:inline-block"
					>
						Catálogo
					</Link>
					<Link
						to="/login"
						className={buttonClasses({ variant: "ghost", size: "sm" })}
					>
						Iniciar sesión
					</Link>
					<Link
						to="/register"
						className={buttonClasses({ variant: "accent", size: "sm" })}
					>
						Crear cuenta
					</Link>
				</nav>
			</div>
		</header>
	);
}

export default PublicNav;
