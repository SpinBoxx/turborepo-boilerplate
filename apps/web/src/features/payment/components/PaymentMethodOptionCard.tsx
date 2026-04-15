import { CreditCard, Smartphone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Radio } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import type { CheckoutPaymentMethodOption } from "../services/payment-ui.service";

interface PaymentMethodOptionCardProps {
	option: CheckoutPaymentMethodOption;
}

function getProviderIcon(provider: CheckoutPaymentMethodOption["provider"]) {
	return provider === "STRIPE" ? CreditCard : Smartphone;
}

export default function PaymentMethodOptionCard({
	option,
}: PaymentMethodOptionCardProps) {
	const Icon = getProviderIcon(option.provider);

	return (
		<Label
			className={cn(
				"flex w-full items-start gap-3 rounded-xl border bg-card p-4 text-left shadow-none transition-colors",
				"hover:bg-accent/30 has-data-checked:border-primary/48 has-data-checked:bg-accent/36",
				!option.enabled && "cursor-not-allowed opacity-64",
			)}
		>
			<Radio disabled={!option.enabled} value={option.provider} />
			<div className="flex min-w-0 flex-1 gap-3">
				<div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted text-foreground">
					<Icon className="size-4" />
				</div>
				<div className="min-w-0 flex-1">
					<div className="flex flex-wrap items-center gap-2">
						<p className="font-medium text-sm">{option.title}</p>
						{option.badge ? (
							<Badge
								size="sm"
								variant={option.enabled ? "outline" : "secondary"}
							>
								{option.badge}
							</Badge>
						) : null}
					</div>
					<p className="mt-1 text-pretty text-muted-foreground text-sm">
						{option.description}
					</p>
				</div>
			</div>
		</Label>
	);
}
