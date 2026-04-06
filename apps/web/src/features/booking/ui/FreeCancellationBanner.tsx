import { CheckCircle } from "lucide-react";
import { useIntlayer } from "react-intlayer";
import {
	Alert,
	AlertDescription,
	AlertTitle,
} from "@/components/ui/alert";

export default function FreeCancellationBanner() {
	const t = useIntlayer("free-cancellation-banner");

	return (
		<Alert variant="success">
			<CheckCircle />
			<AlertTitle>{t.title}</AlertTitle>
			<AlertDescription>{t.description}</AlertDescription>
		</Alert>
	);
}
