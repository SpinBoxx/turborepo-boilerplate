import { CalendarDays, Users } from "lucide-react";
import { useIntlayer } from "react-intlayer";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardPanel, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useBookingCheckoutContext } from "@/features/booking/components/BookingCheckoutProvider";
import { buildCloudinaryImage } from "@/lib/cloudinary";

function formatDate(date: string): string {
	return new Intl.DateTimeFormat("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	}).format(new Date(date));
}

export default function StaySummaryCard() {
	const { room, hotel, checkInDate, checkOutDate, guestCount, pricePreview } =
		useBookingCheckoutContext();
	const t = useIntlayer("stay-summary-card");

	const firstImage = room.images[0]?.publicId ?? null;
	const image = firstImage
		? buildCloudinaryImage({ publicId: firstImage }, { variant: "listing-card" })
		: null;

	return (
		<Card>
			<CardHeader>
				<CardTitle>{t.title}</CardTitle>
			</CardHeader>
			<CardPanel className="flex flex-col gap-4">
				<div className="flex flex-col gap-4 sm:flex-row">
					{image?.src && (
						<img
							src={image.src}
							srcSet={image.srcSet}
							alt={room.title}
							className="h-32 w-full rounded-lg object-cover sm:h-28 sm:w-40"
						/>
					)}
					<div className="flex flex-1 flex-col gap-2">
						<h3 className="font-semibold text-lg">{hotel.name}</h3>
						<div className="flex items-center gap-2">
							<Badge variant="secondary">{room.type}</Badge>
							<span className="text-muted-foreground text-sm">
								{room.title}
							</span>
						</div>
						<p className="text-muted-foreground text-sm">
							{hotel.address}
						</p>
					</div>
				</div>

				<Separator />

				<div className="flex flex-wrap items-center gap-4 text-sm">
					<div className="flex items-center gap-2">
						<CalendarDays
							aria-hidden="true"
							className="size-4 text-muted-foreground"
						/>
						<span>
							{formatDate(checkInDate)} – {formatDate(checkOutDate)} ·{" "}
							{pricePreview.nights} {t.nights}
						</span>
					</div>
					<div className="flex items-center gap-2">
						<Users
							aria-hidden="true"
							className="size-4 text-muted-foreground"
						/>
						<span>
							{guestCount} {t.guests}
						</span>
					</div>
				</div>
			</CardPanel>
		</Card>
	);
}
