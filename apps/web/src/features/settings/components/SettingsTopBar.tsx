import { Link } from "@tanstack/react-router";
import { useIntlayer } from "react-intlayer";
import { Button } from "@/components/ui/button";

export default function SettingsTopBar() {
	const t = useIntlayer("settings");
	const commonT = useIntlayer("common");

	return (
		<header className="hidden h-18 items-center justify-between border-b md:flex">
			<Link
				aria-label={commonT.logo.value}
				className="flex items-center gap-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
				to="/"
			>
				<img alt="" className="size-7" src="/logo.png" />
			</Link>
			<Button className="rounded-full px-5" render={<Link to="/" />} variant="secondary">
				{t.done.value}
			</Button>
		</header>
	);
}