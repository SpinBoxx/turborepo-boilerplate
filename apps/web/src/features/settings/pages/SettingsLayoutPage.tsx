import { Outlet } from "@tanstack/react-router";
import { useIntlayer } from "react-intlayer";
import SettingsNavigation from "../components/SettingsNavigation";
import SettingsTopBar from "../components/SettingsTopBar";

export default function SettingsLayoutPage() {
	const t = useIntlayer("settings");

	return (
		<>
			<SettingsTopBar />
			<div className="mx-auto w-full max-w-6xl py-6 md:py-10">
				<div className="grid gap-10 md:grid-cols-[320px_minmax(0,1fr)] md:gap-20">
					<aside className="hidden md:block md:border-r md:pr-12">
						<h1 className="mb-6 font-semibold text-2xl text-foreground tracking-normal">
							{t.accountSettings.value}
						</h1>
						<SettingsNavigation />
					</aside>

					<main>
						<Outlet />
					</main>
				</div>
			</div>
		</>
	);
}