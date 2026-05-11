import { useIntlayer } from "react-intlayer";

export default function BookingTermsMessage() {
	const t = useIntlayer("booking-translations");

	return (
		<p className="text-muted-foreground text-xs">
			{t.termsAgreement}{" "}
			<a href="/terms-of-service" className="underline">
				{t.termsOfService}
			</a>{" "}
			{t.and}{" "}
			<a href="/privacy-policy" className="underline">
				{t.privacyPolicy}
			</a>
			.
		</p>
	);
}
