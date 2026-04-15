import { useNavigate } from "@tanstack/react-router";
import type { BookingQuoteComputed } from "@zanadeal/api/features/booking-quote";
import type { HotelUserComputed } from "@zanadeal/api/features/hotel";
import type { RoomUserComputed } from "@zanadeal/api/features/room";
import { dateToString } from "@zanadeal/utils";
import { CornerDownLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import BookingCheckoutProvider from "@/features/booking/components/BookingCheckoutProvider";
import BookingTermsMessage from "@/features/booking/ui/BookingTermsMessage";
import CheckoutQuotePriceDetailsCard from "@/features/booking/ui/CheckoutQuotePriceDetailsCard";
import NeedHelpCard from "@/features/booking/ui/NeedHelpCard";
import CheckoutPaymentColumn from "@/features/payment/ui/CheckoutPaymentColumn";

interface CheckoutPageProps {
	quote: BookingQuoteComputed;
	room: RoomUserComputed;
	hotel: HotelUserComputed;
}

export default function CheckoutPage({
	quote,
	room,
	hotel,
}: CheckoutPageProps) {
	const navigate = useNavigate();
	const checkInDate = dateToString(new Date(quote.checkInDate));
	const checkOutDate = dateToString(new Date(quote.checkOutDate));

	return (
		<BookingCheckoutProvider
			room={room}
			hotel={hotel}
			checkInDate={checkInDate}
			checkOutDate={checkOutDate}
			guestCount={quote.guestCount}
		>
			<div className="py-8">
				{/* Page header */}
				<div className="mb-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
					<h1 className="font-bold text-2xl">Confirm and Pay</h1>
					<Button
						variant="outline"
						onClick={() =>
							navigate({
								to: "/review-cart-checkout",
								search: {
									checkInDate,
									checkOutDate,
									roomId: quote.roomId,
									guestCount: quote.guestCount,
								},
							})
						}
					>
						<CornerDownLeft />
						Back to details
					</Button>
				</div>

				<div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
					{/* Left column — Payment options */}
					<div className="flex flex-col gap-6 lg:col-span-7">
						<CheckoutPaymentColumn quoteId={quote.id} />
					</div>

					{/* Right column — Price + Cancellation + Help */}
					<div className="flex flex-col gap-6 lg:sticky lg:top-6 lg:col-span-5">
						<CheckoutQuotePriceDetailsCard quote={quote} />
						<NeedHelpCard />
						<BookingTermsMessage />
					</div>
				</div>
			</div>
		</BookingCheckoutProvider>
	);
}
