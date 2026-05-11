import {
	CircleAlert,
	Clock3,
	LoaderCircle,
	MailCheck,
	ShieldCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardHeader,
	CardPanel,
	CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { PaymentConfirmationViewState } from "../services/payment-confirmation.service";

interface PaymentConfirmationStatusCardProps {
	hotelName: string;
	viewState: PaymentConfirmationViewState;
}

const contentByState = {
	"payment-action-required": {
		badge: { label: "Action required", variant: "warning" as const },
		description:
			"The secure checkout session was not fully completed. Return to checkout to finish the authorization before the hotel can review your request.",
		highlights: [
			{
				icon: Clock3,
				label: "Reservation review",
				value: "Starts after payment authorization",
			},
			{
				icon: MailCheck,
				label: "Email updates",
				value: "We will notify you once everything is complete",
			},
			{
				icon: ShieldCheck,
				label: "Card security",
				value: "No final capture is made while the flow is incomplete",
			},
		],
		icon: CircleAlert,
		iconClassName: "bg-warning/12 text-warning",
		title: "Payment needs one last step",
	},
	"payment-failed": {
		badge: { label: "Payment failed", variant: "error" as const },
		description:
			"We could not keep a valid card authorization for this booking request. You can safely return to checkout and start a fresh payment session.",
		highlights: [
			{
				icon: Clock3,
				label: "Reservation review",
				value: "The hotel has not received a valid payment-backed request yet",
			},
			{
				icon: MailCheck,
				label: "Email updates",
				value: "You will receive a new confirmation once payment succeeds",
			},
			{
				icon: ShieldCheck,
				label: "Card security",
				value: "No amount is captured after a failed authorization",
			},
		],
		icon: CircleAlert,
		iconClassName: "bg-destructive/12 text-destructive",
		title: "We could not secure your payment",
	},
	"request-submission-delayed": {
		badge: { label: "Request dispatch delayed", variant: "warning" as const },
		description:
			"Your card authorization is valid, but we are still retrying the hotel notification. No additional payment is needed from you.",
		highlights: [
			{
				icon: Clock3,
				label: "Hotel response",
				value: "Starts once our booking request reaches the property",
			},
			{
				icon: MailCheck,
				label: "Email updates",
				value: "We keep retrying and will notify you when the request is live",
			},
			{
				icon: ShieldCheck,
				label: "Card security",
				value: "Your authorization stays protected while we finish submission",
			},
		],
		icon: CircleAlert,
		iconClassName: "bg-warning/12 text-warning",
		title: "We are still submitting your request",
	},
	"request-submission-processing": {
		badge: { label: "Submitting request", variant: "info" as const },
		description:
			"Payment is complete. We are dispatching the hotel booking request now, and the review starts as soon as the property receives it.",
		highlights: [
			{
				icon: LoaderCircle,
				label: "Current step",
				value: "Submitting the validated request to the hotel team",
			},
			{
				icon: MailCheck,
				label: "Email updates",
				value: "You will receive the hotel decision automatically",
			},
			{
				icon: ShieldCheck,
				label: "Card security",
				value: "Your authorization is already secured",
			},
		],
		icon: LoaderCircle,
		iconClassName: "bg-info/12 text-info",
		title: "Your reservation request is being submitted",
	},
	"pending-hotel-approval": {
		badge: { label: "Awaiting hotel approval", variant: "success" as const },
		description:
			"The hotel now has to review your request. Your payment method is secured, and the final charge only happens once the stay is accepted.",
		highlights: [
			{
				icon: Clock3,
				label: "Hotel response",
				value: "Usually within 24 hours",
			},
			{
				icon: MailCheck,
				label: "Email updates",
				value: "Acceptance or refusal is sent automatically",
			},
			{
				icon: ShieldCheck,
				label: "Final capture",
				value: "Only after the hotel confirms your reservation",
			},
		],
		icon: ShieldCheck,
		iconClassName: "bg-success/12 text-success",
		title: "Payment authorization received",
	},
} satisfies Record<
	PaymentConfirmationViewState,
	{
		badge: { label: string; variant: "error" | "info" | "success" | "warning" };
		description: string;
		highlights: Array<{
			icon: typeof Clock3;
			label: string;
			value: string;
		}>;
		icon: typeof ShieldCheck;
		iconClassName: string;
		title: string;
	}
>;

export default function PaymentConfirmationStatusCard({
	hotelName,
	viewState,
}: PaymentConfirmationStatusCardProps) {
	const content = contentByState[viewState];
	const Icon = content.icon;
	const description =
		viewState === "pending-hotel-approval"
			? `${hotelName} now has to review your request. Your payment method is secured, and the final charge only happens once the hotel accepts the stay.`
			: content.description;

	return (
		<Card className="overflow-hidden border-border/70 bg-linear-to-br from-background via-background to-muted/50">
			<CardHeader className="gap-5">
				<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
					<div className="flex items-start gap-4">
						<div
							className={cn(
								"flex size-14 shrink-0 items-center justify-center rounded-3xl",
								content.iconClassName,
							)}
						>
							<Icon className="size-7" />
						</div>
						<div>
							<Badge size="lg" variant={content.badge.variant}>
								{content.badge.label}
							</Badge>
							<CardTitle className="mt-3 max-w-2xl text-balance text-2xl sm:text-3xl">
								{content.title}
							</CardTitle>
						</div>
					</div>
				</div>
				<p className="max-w-2xl text-pretty text-base text-muted-foreground">
					{description}
				</p>
			</CardHeader>
			<CardPanel className="grid gap-3 pt-0 sm:grid-cols-3">
				{content.highlights.map((highlight) => {
					const HighlightIcon = highlight.icon;

					return (
						<div
							className="rounded-2xl border bg-background/80 p-4"
							key={highlight.label}
						>
							<div className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-[0.18em]">
								<HighlightIcon className="size-4" />
								<span>{highlight.label}</span>
							</div>
							<p className="mt-3 text-pretty font-medium text-sm">
								{highlight.value}
							</p>
						</div>
					);
				})}
			</CardPanel>
		</Card>
	);
}