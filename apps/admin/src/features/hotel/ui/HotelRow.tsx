import type { Hotel } from "@zanadeal/api/contracts";
import { Badge, Card, CardContent, cn } from "@zanadeal/ui";
import {
	HotelAddress,
	HotelAmenities,
	HotelCardActions,
	HotelCardProvider,
	HotelDescription,
	HotelImage,
	HotelName,
} from "../components";

export default function HotelRow({
	hotel,
	onEdit,
	onDelete,
}: {
	hotel: Hotel;
	onEdit?: (hotel: Hotel) => void;
	onDelete?: (hotel: Hotel) => void;
}) {
	return (
		<HotelCardProvider hotel={hotel} onEdit={onEdit} onDelete={onDelete}>
			<Card className="overflow-hidden rounded-3xl">
				<CardContent className="p-0">
					<div className="grid sm:grid-cols-[240px_1fr_auto]">
						<div className="relative overflow-hidden sm:rounded-l-3xl">
							<div className="aspect-16/10 sm:aspect-auto sm:h-full">
								<HotelImage className="h-full w-full bg-muted object-cover" />
							</div>
						</div>

						<div className="min-w-0 p-6">
							<div className="flex items-start justify-between gap-4">
								<div className="min-w-0">
									<HotelName className="truncate font-semibold text-foreground text-xl" />
									<HotelAddress className="mt-1 flex items-center gap-2 text-muted-foreground text-sm" />
								</div>
								{hotel.isArchived ? (
									<Badge variant="outline" className="shrink-0">
										Archivé
									</Badge>
								) : null}
							</div>

							<HotelDescription className="mt-3 line-clamp-2 text-muted-foreground text-sm" />

							<HotelAmenities max={3} className="mt-5" />
						</div>

						<div
							className={cn(
								"flex items-center justify-center border-t p-4 sm:border-t-0 sm:border-l",
							)}
						>
							<HotelCardActions
								className="flex-col gap-3"
								buttonClassName="bg-transparent"
							/>
						</div>
					</div>
				</CardContent>
			</Card>
		</HotelCardProvider>
	);
}
