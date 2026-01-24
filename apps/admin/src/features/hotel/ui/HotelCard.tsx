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
import { Eye, Pen, Trash, X } from "lucide-react";
import type { ComponentProps } from "react";
import {
	HotelAddress,
	HotelAmenities,
	HotelContext,
	HotelDescription,
	HotelImage,
	HotelName,
	HotelProvider,
	HotelRating,
} from "../components";
import HotelArchived from "../components/HotelArchived";
import { useArchiveHotel, useDeleteHotel } from "../hotel.queries";

interface Props extends ComponentProps<"div"> {
	hotel: Hotel;
}

export default function HotelCard({ hotel, className, ...props }: Props) {
	const toggleArchiveHotel = useArchiveHotel();
	const deleteHotel = useDeleteHotel();
	return (
		<HotelProvider hotel={hotel}>
			<ContextMenu>
				<ContextMenuTrigger>
					<Card
						className={cn(
							"group gap-0 overflow-hidden rounded-3xl py-0",
							className,
						)}
						{...props}
					>
						<CardHeader className="p-0">
							<div className="relative aspect-16/10 w-full overflow-hidden">
								<HotelImage className="h-full w-full bg-muted object-cover transition-transform duration-300 ease-out group-hover:scale-110" />
								<div className="absolute top-4 right-4 rounded-full bg-white/70 p-1">
									<HotelArchived className="text-black" />
								</div>
								<div className="absolute top-4 left-4">
									<HotelRating />
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
						<HotelContext.Consumer>
							{({ hotel }) => (
								<>
									<ContextMenuItem className="text-blue-500">
										<Pen className="text-blue-500" />
										Modifier
									</ContextMenuItem>
									{hotel.isArchived ? (
										<ContextMenuItem
											className="text-red-500"
											onClick={() =>
												toggleArchiveHotel.mutate({
													id: hotel.id,
												})
											}
										>
											<Eye className="text-red-500" />
											Désarchiver
										</ContextMenuItem>
									) : (
										<ContextMenuItem
											className="text-red-500"
											onClick={() =>
												toggleArchiveHotel.mutate({
													id: hotel.id,
												})
											}
										>
											<X className="text-red-500" />
											Archiver
										</ContextMenuItem>
									)}
									<ContextMenuItem
										onClick={() => deleteHotel.mutate({ id: hotel.id })}
									>
										<Badge variant={"destructive"}>
											<Trash className="text-white" />
											Supprimer
										</Badge>
									</ContextMenuItem>
								</>
							)}
						</HotelContext.Consumer>
					</ContextMenuGroup>
				</ContextMenuContent>
			</ContextMenu>
		</HotelProvider>
	);
}
