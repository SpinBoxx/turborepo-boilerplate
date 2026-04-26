import {
	currency,
	getNightlyBreakdown,
	type NightBreakdownItem,
	stringToDate,
} from "@zanadeal/utils";
import { date as formatDate } from "intlayer";
import { Info } from "lucide-react";
import { useIntlayer, useIntlayerContext } from "react-intlayer";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogPanel,
	DialogPopup,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useBookingStore } from "@/features/booking/hooks/useBookingHook";
import { useRoomContext } from "./RoomProvider";

interface Props {
	children?: React.ReactElement;
}

export default function RoomPriceBreakdownDialog({ children }: Props) {
	const {
		room: { prices },
	} = useRoomContext();
	const { checkInDate, checkOutDate } = useBookingStore();
	const { locale } = useIntlayerContext();
	const t = useIntlayer("room-total-price");

	if (!checkInDate || !checkOutDate) {
		return null;
	}

	const breakdown = getNightlyBreakdown(
		prices,
		stringToDate(checkInDate),
		stringToDate(checkOutDate),
	);

	const totalPrice = breakdown.reduce((sum, item) => sum + item.price, 0);

	return (
		<Dialog>
			<DialogTrigger
				render={
					<button
						type="button"
						className="inline-flex cursor-pointer items-center text-muted-foreground transition-colors hover:text-foreground"
						aria-label={t.priceBreakdown.value}
					/>
				}
			>
				{children ? children : <Info className="size-4" />}
			</DialogTrigger>
			<DialogPopup>
				<DialogHeader>
					<DialogTitle>{t.priceBreakdown.value}</DialogTitle>
					<DialogDescription>
						{t.priceBreakdownDescription.value}
					</DialogDescription>
				</DialogHeader>
				<DialogPanel>
					<div className="space-y-2">
						{breakdown.map((item: NightBreakdownItem, index: number) => (
							<div
								key={index}
								className="flex items-center justify-between text-sm"
							>
								<span className="text-muted-foreground">
									{t.nightOf.value}{" "}
									{formatDate(item.date, {
										dateStyle: "medium",
										locale,
									})}
								</span>
								<span className="font-medium">{currency(item.price)}</span>
							</div>
						))}

						<Separator />

						<div className="flex items-center justify-between px-1 pt-1.5">
							<span className="font-semibold">{t.total.value}</span>
							<span className="font-bold text-lg text-primary">
								{currency(totalPrice)}
							</span>
						</div>
					</div>
				</DialogPanel>

				<DialogFooter>
					<DialogClose render={<Button variant="outline" />}>
						{t.close.value}
					</DialogClose>
				</DialogFooter>
			</DialogPopup>
		</Dialog>
	);
}
