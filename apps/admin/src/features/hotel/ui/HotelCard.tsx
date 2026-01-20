import type { Hotel } from "@zanadeal/api/contracts";
import {
	Badge,
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	ContextMenu,
	ContextMenuContent,
	ContextMenuGroup,
	ContextMenuItem,
	ContextMenuTrigger,
	cn,
} from "@zanadeal/ui";
import { Pen, Trash } from "lucide-react";
import {
	HotelAddress,
	HotelAmenities,
	HotelCardActions,
	HotelCardProvider,
	HotelDescription,
	HotelImage,
	HotelName,
	HotelRating,
} from "../components";

export default function HotelCard({ hotel }: { hotel: Hotel }) {
	return (
		<HotelCardProvider hotel={hotel}>
			<ContextMenu>
				<ContextMenuTrigger>
					<Card className="group gap-0 overflow-hidden rounded-3xl py-0">
						<CardHeader className="p-0">
							<div className="relative aspect-16/10 w-full overflow-hidden">
								<HotelImage className="h-full w-full bg-muted object-cover" />

								<div className="absolute top-4 left-4">
									<HotelRating />
								</div>

								<div className="absolute top-4 right-4">
									<HotelCardActions className="flex-col gap-2 opacity-0 transition-opacity group-hover:opacity-100" />
								</div>
							</div>
						</CardHeader>

						<CardContent className="grid gap-2 p-2">
							<div className="min-w-0">
								<HotelName className="truncate font-semibold text-foreground text-lg" />
								<HotelAddress className="mt-1 flex items-center gap-2 text-muted-foreground text-sm" />
							</div>

							<HotelDescription className="line-clamp-2 text-muted-foreground text-sm" />
						</CardContent>

						<CardFooter className={cn("px-2 py-4 pt-0")}>
							<HotelAmenities max={3} />
						</CardFooter>
					</Card>
				</ContextMenuTrigger>
				<ContextMenuContent>
					<ContextMenuGroup>
						<ContextMenuItem className="text-blue-500">
							<Pen className="text-blue-500" />
							Modifier
						</ContextMenuItem>
						<ContextMenuItem>
							<Badge variant={"destructive"}>
								<Trash className="text-white" />
								Supprimer
							</Badge>
						</ContextMenuItem>
					</ContextMenuGroup>
				</ContextMenuContent>
			</ContextMenu>
		</HotelCardProvider>
	);
}
