import { useIntlayer } from "react-intlayer";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardFooter,
	CardHeader,
	CardPanel,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import NightlyBreakdown from "@/features/booking/ui/NightlyBreakdown";
import NightlySummaryRow from "@/features/booking/ui/NightlySummaryRow";
import PriceTotalRow from "@/features/booking/ui/PriceTotalRow";
import TaxesRow from "@/features/booking/ui/TaxesRow";
import { useBookingCheckoutContext } from "../components/BookingCheckoutProvider";
import AuthDialog from "@/auth/components/AuthDialog";

interface PriceDetailsCardProps {
	onConfirm: () => void;
	isSubmitting: boolean;
}

export default function PriceDetailsCard({
	onConfirm,
	isSubmitting,
}: PriceDetailsCardProps) {
	const t = useIntlayer("price-details-card");
	const { canSubmit } = useBookingCheckoutContext();

	return (
		<Card>
			<CardHeader>
				<CardTitle>{t.title}</CardTitle>
			</CardHeader>
			<CardPanel className="flex flex-col gap-3">
				<NightlySummaryRow />
				<NightlyBreakdown />
				<TaxesRow />
				<Separator />
				<PriceTotalRow />
			</CardPanel>
			<CardFooter>
				{canSubmit ? (
					<Button
						type="button"
						className="w-full"
						disabled={isSubmitting}
						onClick={onConfirm}
					>
						{isSubmitting && <Spinner aria-hidden="true" />}
						{t.confirmBooking}
					</Button>
				) : (
					<AuthDialog
						loginTitle={t.authDialogLoginTitle.value}
						loginDescription={t.authDialogLoginDescription.value}
						registerTitle={t.authDialogRegisterTitle.value}
						registerDescription={t.authDialogRegisterDescription.value}
					>
						<Button className="w-full" type="button">
							{t.confirmBooking}
						</Button>
					</AuthDialog>
				)}
			</CardFooter>
		</Card>
	);
}
