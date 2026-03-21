import { useNavigate } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardPanel } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import HotelAddress from "../components/HotelAddress";
import HotelDescription from "../components/HotelDescription";
import HotelImage from "../components/HotelImage";
import HotelName from "../components/HotelName";
import HotelPrice from "../components/HotelPrice";
import HotelPricePerNight from "../components/HotelPricePerNight";
import { useHotelContext } from "../components/HotelProvider";

export default function HotelCard() {
	const {
		hotel: { id },
	} = useHotelContext();
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
			className="group h-full cursor-pointer overflow-hidden p-0"
		>
			<CardPanel className="flex h-full flex-col p-0">
				<div className="relative z-10 aspect-video overflow-hidden">
					<HotelImage
						variant="listing-card"
						className="size-full object-cover transition-transform duration-500 group-hover:scale-110"
					/>
					<Button
						size="icon"
						variant="ultraGhost"
						className="absolute top-3 right-3 size-12 rounded-full bg-background opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:size-10"
					>
						<ArrowRight className="size-5" />
					</Button>
				</div>

				{/* Content */}
				<div className="flex flex-1 flex-col gap-2 p-4">
					<div className="flex gap-1">
						<HotelName className="line-clamp-2 font-semibold text-lg" />
						<HotelPrice className="h-fit shrink-0 whitespace-nowrap rounded-full bg-muted px-3 py-1 font-medium text-sm" />
					</div>
					<HotelAddress className="line-clamp-1 text-muted-foreground text-sm" />
					<HotelDescription className="line-clamp-3 font-light text-muted-foreground text-sm" />
					<Separator className={"mt-auto"} />
					<div className="@container flex items-end justify-between">
						<div>
							<span className="flex translate-y-0.5 text-muted-foreground text-xs uppercase">
								Starting from
							</span>
							<HotelPricePerNight className="flex-wrap" />
						</div>
						<Button type="button" variant={"default"}>
							<span>View </span>{" "}
							<span className="@xs:block hidden">details</span>
							<ArrowRight />
						</Button>
					</div>
				</div>
			</CardPanel>
			{/* Image */}
		</Card>
	);
}
