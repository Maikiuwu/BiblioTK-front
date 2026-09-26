import {
	ArrowRight,
	ArrowsLeftRight,
	ArrowUpRight,
	Books,
	UserCircle,
} from "@phosphor-icons/react";
import { Button, buttonClasses } from "bibliotk-ui";
import { Link } from "react-router-dom";
import PublicFooter from "../components/PublicFooter.jsx";
import PublicNav from "../components/PublicNav.jsx";

const features = [
	{
		icon: Books,
		title: "Catálogo",
		description: "Explora libros, revistas y novelas disponibles en la biblioteca.",
		surface: "bg-honey-200",
	},
	{
		icon: UserCircle,
		title: "Tu perfil",
		description: "Administra tus datos personales desde un solo lugar.",
		surface: "bg-sand-50 shadow-[inset_0_0_0_1px_var(--color-sand-200)]",
	},
	{
		icon: ArrowsLeftRight,
		title: "Préstamos",
		description: "Consulta tus préstamos activos y su historial.",
		surface: "bg-pine-100",
	},
];

function Hero() {
	return (
		<section className="grain relative isolate mx-3 overflow-hidden rounded-[28px] bg-pine-900 px-7 py-16 text-sand-50 motion-safe:animate-rise md:mx-0 md:px-16 md:py-24">
			<div
				aria-hidden="true"
				className="pointer-events-none absolute -top-32 -right-24 size-[26rem] rounded-full border border-honey-400/35 shadow-[0_0_0_44px_rgb(217_165_90/0.06),0_0_0_88px_rgb(217_165_90/0.04)] md:size-[36rem]"
			/>
			<div className="relative max-w-2xl">
				<p className="text-sm font-semibold text-honey-300">BiblioTK</p>
				<h1 className="mt-4 font-display text-[clamp(2.75rem,6.5vw,5rem)] leading-[0.94] font-extrabold tracking-[-0.05em]">
					El placer de <span className="text-honey-400">encontrar</span> una
					buena historia.
				</h1>
				<p className="mt-6 max-w-lg text-base leading-relaxed text-pine-200">
					Gestiona tus lecturas, sigue tus préstamos y descubre tu próxima
					aventura desde un solo lugar.
				</p>
				<div className="mt-10 flex flex-wrap gap-3">
					<Link
						to="/register"
						className={buttonClasses({ variant: "accent", size: "lg" })}
					>
						Crear cuenta
						<ArrowRight aria-hidden="true" className="size-4" />
					</Link>
					<Link
						to="/login"
						className={buttonClasses({ variant: "outline", size: "lg", className: "bg-sand-50/5 text-sand-50 shadow-[inset_0_0_0_1px_var(--color-sand-50)]/20 hover:bg-sand-50/10" })}
					>
						Ya tengo cuenta
					</Link>
				</div>
			</div>
		</section>
	);
}

function FeatureCard({ icon: Icon, title, description, surface, delay }) {
	return (
		<article
			className={`flex min-h-44 flex-col justify-between rounded-[28px] p-7 motion-safe:animate-rise ${surface}`}
			style={{ animationDelay: `${delay}ms` }}
		>
			<span className="grid size-11 place-items-center rounded-2xl bg-pine-950/10 text-pine-900">
				<Icon aria-hidden="true" className="size-[22px]" />
			</span>
			<div className="mt-8">
				<h2 className="font-display text-xl font-extrabold tracking-[-0.03em] text-pine-950">
					{title}
				</h2>
				<p className="mt-2 text-sm leading-relaxed text-ink-soft">
					{description}
				</p>
			</div>
		</article>
	);
}

function CatalogoBanner() {
	return (
		<section className="mx-3 mt-3 flex flex-col items-start justify-between gap-6 rounded-[28px] bg-sand-50 p-7 shadow-[inset_0_0_0_1px_var(--color-sand-200)] motion-safe:animate-rise sm:flex-row sm:items-center md:mx-0 md:p-10 [animation-delay:240ms]">
			<div>
				<h2 className="font-display text-2xl font-extrabold tracking-[-0.03em] text-pine-950">
					¿Solo quieres mirar el catálogo?
				</h2>
				<p className="mt-2 max-w-md text-sm leading-relaxed text-ink-soft">
					Puedes explorarlo sin crear una cuenta y registrarte más tarde.
				</p>
			</div>
			<Link to="/catalogo">
				<Button variant="primary" size="lg" trailingIcon={<ArrowUpRight aria-hidden="true" className="size-4" />}>
					Ir al catálogo
				</Button>
			</Link>
		</section>
	);
}

function Landing() {
	return (
		<div className="min-h-dvh bg-sand-100">
			<PublicNav />
			<main className="mx-auto max-w-6xl px-0 pb-20 md:px-3">
				<Hero />
				<section
					aria-label="Qué puedes hacer en BiblioTK"
					className="mx-3 mt-3 grid gap-3 md:mx-0 md:grid-cols-3"
				>
					{features.map((feature, index) => (
						<FeatureCard key={feature.title} {...feature} delay={80 + index * 60} />
					))}
				</section>
				<CatalogoBanner />
			</main>
			<PublicFooter />
		</div>
	);
}

export default Landing;
