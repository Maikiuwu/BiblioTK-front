import { ArrowLeft } from "@phosphor-icons/react";
import { buttonClasses, Footer } from "bibliotk-ui";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PublicNav from "../components/PublicNav.jsx";
import { listCatalogo } from "../../service/CatalogoService.js";

const tipoLabels = {
	LIBRO: "Libro",
	REVISTA: "Revista",
	NOVELA: "Novela",
};

function MaterialCard({ material, delay }) {
	return (
		<article
			className="flex min-h-48 flex-col justify-between rounded-[28px] bg-sand-50 p-6 shadow-[inset_0_0_0_1px_var(--color-sand-200)] motion-safe:animate-rise"
			style={{ animationDelay: `${delay}ms` }}
		>
			<div>
				<span className="inline-flex items-center rounded-full bg-honey-200 px-2.5 py-1 text-xs font-semibold text-honey-700">
					{tipoLabels[material.tipoMaterial] ?? material.tipoMaterial}
				</span>
				<h2 className="mt-4 font-display text-xl font-extrabold tracking-[-0.03em] text-pine-950">
					{material.titulo}
				</h2>
				<p className="mt-1 text-sm text-ink-soft">{material.autor}</p>
			</div>
			<p className="mt-6 text-sm font-medium text-ink-soft">
				{material.disponible ? "Disponible" : "No disponible"}
			</p>
		</article>
	);
}

function EnConstruccion() {
	return (
		<section className="grain relative isolate mx-3 overflow-hidden rounded-[32px] bg-pine-900 px-7 py-16 text-sand-50 motion-safe:animate-rise md:mx-0 md:px-16 md:py-28">
			<div
				aria-hidden="true"
				className="pointer-events-none absolute -top-40 -right-32 size-[26rem] rounded-full border border-honey-400/35 shadow-[0_0_0_48px_rgb(217_165_90/0.06),0_0_0_96px_rgb(217_165_90/0.04)] md:size-[40rem]"
			/>
			<div className="relative max-w-3xl">
				<p className="text-sm font-semibold text-honey-300">Catálogo</p>
				<h1 className="mt-4 font-display text-[clamp(2.75rem,7vw,5.5rem)] leading-[0.92] font-extrabold tracking-[-0.05em]">
					El catálogo todavía está en construcción.
				</h1>
				<p className="mt-6 max-w-lg text-base leading-relaxed text-pine-200">
					Todavía no hay material bibliográfico cargado. Vuelve pronto para
					explorar libros, revistas y novelas sin necesidad de iniciar sesión.
				</p>
				<Link
					to="/"
					className={buttonClasses({ variant: "accent", className: "mt-10" })}
				>
					<ArrowLeft aria-hidden="true" className="size-4" />
					Volver al inicio
				</Link>
			</div>
		</section>
	);
}

function Catalogo() {
	const [materiales, setMateriales] = useState([]);
	const [status, setStatus] = useState("loading");

	useEffect(() => {
		let isMounted = true;

		listCatalogo()
			.then((data) => {
				if (!isMounted) return;
				setMateriales(data);
				setStatus("ready");
			})
			.catch(() => {
				if (!isMounted) return;
				setStatus("unavailable");
			});

		return () => {
			isMounted = false;
		};
	}, []);

	const sinMaterial = status === "unavailable" || (status === "ready" && materiales.length === 0);

	return (
		<div className="min-h-dvh bg-sand-100">
			<PublicNav />
			<main className="mx-auto max-w-6xl px-3 pb-20 md:px-3">
				{status === "loading" && (
					<div aria-busy="true" className="grid gap-3 md:grid-cols-3">
						{[0, 1, 2, 3, 4, 5].map((key) => (
							<span
								key={key}
								className="block h-48 animate-pulse rounded-[28px] bg-sand-200/60"
							/>
						))}
					</div>
				)}

				{status !== "loading" && sinMaterial && <EnConstruccion />}

				{status === "ready" && materiales.length > 0 && (
					<>
						<header className="motion-safe:animate-rise">
							<h1 className="font-display text-[clamp(2.5rem,5.5vw,4rem)] leading-[0.94] font-extrabold tracking-[-0.045em] text-pine-950">
								Catálogo
							</h1>
							<p className="mt-4 max-w-xl text-base leading-relaxed text-ink-soft">
								Un ejemplo de lo que vas a poder explorar sin iniciar sesión.
								Regístrate para pedir un préstamo.
							</p>
						</header>
						<section
							aria-label="Material bibliográfico"
							className="mt-10 grid gap-3 sm:grid-cols-2 md:grid-cols-3"
						>
							{materiales.map((material, index) => (
								<MaterialCard
									key={material.id}
									material={material}
									delay={80 + index * 40}
								/>
							))}
						</section>
					</>
				)}
			</main>
			<Footer />
		</div>
	);
}

export default Catalogo;
