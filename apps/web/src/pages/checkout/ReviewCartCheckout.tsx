import { useIntlayer } from "react-intlayer";

export default function ReviewCartCheckoutPage() {
	const t = useIntlayer("common");
	return (
		<div>
			<h1 className="font-bold text-2xl">{t.reviewCartCheckout.value}</h1>
		</div>
	);
}
