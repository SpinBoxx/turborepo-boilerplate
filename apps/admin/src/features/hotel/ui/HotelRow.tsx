import type { Hotel } from "@zanadeal/api/contracts";
import {
	Badge,
	Card,
	CardContent,
	ContextMenu,
	ContextMenuContent,
	ContextMenuGroup,
	ContextMenuItem,
	ContextMenuTrigger,
	cn,
} from "@zanadeal/ui";
import { Eye, Trash, X } from "lucide-react";
import type { ComponentProps } from "react";
import {
	HotelAddress,
	HotelContext,
	HotelImage,
	HotelName,
	HotelProvider,
	HotelRating,
} from "../components";
import HotelArchived from "../components/HotelArchived";

interface Props extends ComponentProps<"div"> {
	hotel: Hotel;
}

export default function HotelRow({ hotel, className, ...props }: Props) {
	return (
		<HotelProvider hotel={hotel}>
			<ContextMenu>
				<ContextMenuTrigger>
					<Card
						className={cn("group rounded-[14px] p-2", className)}
						{...props}
					>
						<CardContent className="overflow-hidden p-0">
							<div className="flex gap-2">
								<div className="relative size-26 shrink-0 overflow-hidden rounded-[10px] lg:size-28">
									<HotelImage
										className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-110"
										variant="room-thumbnail"
									/>
									<div className="absolute top-1 right-1 rounded-full bg-white/70 p-0.5">
										<HotelArchived className="text-black [&_svg]:size-4.5" />
									</div>
								</div>
								<div className="space-y-1">
									<HotelName />
									<HotelRating />
									<HotelAddress />
								</div>
							</div>
						</CardContent>
					</Card>
				</ContextMenuTrigger>
				<ContextMenuContent>
					<ContextMenuGroup>
						<HotelContext.Consumer>
							{({ hotel }) =>
								hotel.isArchived ? (
									<ContextMenuItem className="text-red-500">
										<Eye className="text-red-500" />
										Désarchiver
									</ContextMenuItem>
								) : (
									<ContextMenuItem className="text-red-500">
										<X className="text-red-500" />
										Archiver
									</ContextMenuItem>
								)
							}
						</HotelContext.Consumer>
						<ContextMenuItem>
							<Badge variant={"destructive"}>
								<Trash className="text-white" />
								Supprimer
							</Badge>
						</ContextMenuItem>
					</ContextMenuGroup>
				</ContextMenuContent>
			</ContextMenu>
		</HotelProvider>
	);
}
