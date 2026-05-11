import { useNavigate } from "@tanstack/react-router";
import { Card, CardPanel } from "@/components/ui/card";
import HotelAddress from "../components/HotelAddress";
import HotelAvailabilityPrice from "../components/HotelAvailabilityPrice";
import HotelDescription from "../components/HotelDescription";
import HotelImage from "../components/HotelImage";
import HotelName from "../components/HotelName";
import HotelPopularBadge from "../components/HotelPopularBadge";
import { useHotelContext } from "../components/HotelProvider";

export default function HotelCard() {
	const { hotel } = useHotelContext();
	const { id } = hotel;
	const navigate = useNavigate();
	const handleClick = () => {
		navigate({
			to: "/$hotelId",
			params: { hotelId: id },
		});
	};

	return (
		<Card
			onClick={handleClick}
			className="group h-full cursor-pointer overflow-hidden border-border/60 bg-card/80 p-0 shadow-sm transition-transform duration-200 hover:-translate-y-0.5 hover:border-primary/24 hover:shadow-md"
		>
			<CardPanel className="flex h-full flex-col p-0">
				<div className="relative z-10 aspect-4/3 overflow-hidden">
					<HotelImage
						variant="listing-card"
						className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
					/>
					<HotelAvailabilityPrice
						variant="badge"
						unavailableOnly
						className="absolute top-3 left-3 max-w-[calc(100%-1.5rem)]"
					/>
					<HotelPopularBadge className="absolute top-3 right-3 bg-background/90 text-foreground shadow-sm backdrop-blur" />
				</div>

				<div className="flex flex-1 flex-col gap-2.5 p-4">
					<div className="flex items-start gap-3">
						<div className="min-w-0 flex-1 space-y-1">
							<HotelName className="line-clamp-2 font-semibold text-foreground text-lg leading-snug" />
							<HotelAddress className="line-clamp-1 text-muted-foreground text-sm" />
						</div>
					</div>

					<HotelDescription className="line-clamp-3 text-pretty font-light text-muted-foreground text-sm leading-relaxed" />

					<HotelAvailabilityPrice className="mt-auto border-border/70 border-t pt-3" />
				</div>
			</CardPanel>
		</Card>
	);
}
