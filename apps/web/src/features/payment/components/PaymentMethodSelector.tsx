import { RadioGroup } from "@/components/ui/radio-group";
import type {
	CheckoutPaymentMethodOption,
	CheckoutPaymentProvider,
} from "../services/payment-ui.service";
import PaymentMethodOptionCard from "./PaymentMethodOptionCard";

interface PaymentMethodSelectorProps {
	options: CheckoutPaymentMethodOption[];
	selectedProvider: CheckoutPaymentProvider;
	onProviderChange: (provider: CheckoutPaymentProvider) => void;
}

export default function PaymentMethodSelector({
	options,
	selectedProvider,
	onProviderChange,
}: PaymentMethodSelectorProps) {
	return (
		<RadioGroup
			aria-label="Payment method"
			className="gap-3"
			onValueChange={(value) =>
				onProviderChange(value as CheckoutPaymentProvider)
			}
			value={selectedProvider}
		>
			{options.map((option) => (
				<PaymentMethodOptionCard key={option.provider} option={option} />
			))}
		</RadioGroup>
	);
}
