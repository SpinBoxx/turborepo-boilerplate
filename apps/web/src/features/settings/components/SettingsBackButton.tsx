import { useRouter } from "@tanstack/react-router";
import { ArrowLeftIcon } from "lucide-react";
import { useIntlayer } from "react-intlayer";
import { Button } from "@/components/ui/button";

export default function SettingsBackButton() {
	const router = useRouter();
	const t = useIntlayer("settings");

	return (
		<Button
			aria-label={t.back.value}
			className="size-10 rounded-full bg-secondary text-foreground hover:bg-secondary/80"
			onClick={() => router.history.back()}
			size="icon"
			variant="ghost"
		>
			<ArrowLeftIcon aria-hidden="true" className="size-5" />
		</Button>
	);
}