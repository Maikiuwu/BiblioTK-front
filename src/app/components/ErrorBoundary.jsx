import { Component } from "react";

class ErrorBoundary extends Component {
	state = { hasError: false };

	static getDerivedStateFromError() {
		return { hasError: true };
	}

	render() {
		if (this.state.hasError) {
			return (
				<main className="grid min-h-dvh place-items-center bg-sand-100 px-6 text-center text-pine-950">
					<div>
						<h1 className="font-display text-3xl font-extrabold">Algo salió mal</h1>
						<p className="mt-3 text-ink-soft">
							Recarga la página para volver a intentarlo.
						</p>
					</div>
				</main>
			);
		}

		return this.props.children;
	}
}

export default ErrorBoundary;