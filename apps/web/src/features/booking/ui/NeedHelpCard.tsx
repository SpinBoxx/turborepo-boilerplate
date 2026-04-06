import { Headphones } from "lucide-react";
import { useIntlayer } from "react-intlayer";
import { Card, CardPanel } from "@/components/ui/card";

export default function NeedHelpCard() {
	const t = useIntlayer("need-help-card");

	return (
		<Card>
			<CardPanel className="flex items-center gap-4">
				<div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted">
					<Headphones
						aria-hidden="true"
						className="size-5 text-muted-foreground"
					/>
				</div>
				<div className="flex flex-col gap-0.5">
					<p className="font-medium text-sm">{t.title}</p>
					<p className="text-muted-foreground text-sm">
						{t.description}
					</p>
				</div>
			</CardPanel>
		</Card>
	);
}
