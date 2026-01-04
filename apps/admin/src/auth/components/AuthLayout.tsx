import { Building2 } from "lucide-react";
import type { PropsWithChildren } from "react";

export default function AuthLayout({ children }: PropsWithChildren) {
	return (
		<div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-background p-4 transition-colors duration-500">
			{/* Theme Toggle - Absolute Top Right */}
			{/* <ThemeProvider */}

			{/* Background Decor */}
			<div className="absolute inset-0 z-0">
				<div className="absolute top-0 left-0 h-full w-full bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,var(--primary)_0%,rgba(255,255,255,0)_50%)] opacity-20" />
				<div className="absolute right-0 bottom-0 h-[500px] w-[500px] rounded-full bg-accent/10 blur-[100px]" />
			</div>

			{/* Main Container */}
			<div className="relative z-10 grid w-full max-w-[1100px] items-center gap-8 lg:grid-cols-2">
				{/* Left: Branding & Value Prop */}
				<div className="hidden flex-col space-y-6 p-8 lg:flex">
					<div className="flex h-16 w-16 items-center justify-center rounded-[var(--radius)] border border-primary/20 bg-primary/20 backdrop-blur-sm">
						<Building2 className="h-8 w-8 text-primary" />
					</div>

					<h1 className="font-bold text-5xl text-foreground leading-[1.1] tracking-tight">
						Gestion hôtelière <br />
						<span className="text-primary">réinventée.</span>
					</h1>

					<p className="max-w-md text-lg text-muted-foreground leading-relaxed">
						Une plateforme unifiée pour contrôler vos réservations, vos chambres
						et vos services avec une fluidité absolue.
					</p>

					<div className="flex items-center gap-4 pt-8">
						<div className="flex -space-x-4">
							{[1, 2, 3, 4].map((i) => (
								<div
									key={i}
									className="h-10 w-10 overflow-hidden rounded-full border-2 border-background bg-card"
								>
									<img
										src={`https://i.pravatar.cc/100?img=${i + 10}`}
										alt="User"
									/>
								</div>
							))}
						</div>
						<div className="text-sm">
							<span className="block font-bold text-foreground">
								Rejoignez +2000 hôtels
							</span>
							<span className="text-muted-foreground">
								qui nous font confiance.
							</span>
						</div>
					</div>
				</div>

				{/* Right: Card */}
				<div className="rounded-[var(--radius)] border border-border bg-card p-8 text-card-foreground shadow-2xl md:p-12">
					{children}
				</div>
			</div>
		</div>
	);
}
