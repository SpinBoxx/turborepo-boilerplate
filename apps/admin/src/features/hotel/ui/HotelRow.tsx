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
} from "@zanadeal/ui";
import { Eye, Pen, Trash, X } from "lucide-react";
import {
	HotelAddress,
	HotelContext,
	HotelImage,
	HotelName,
	HotelProvider,
	HotelRating,
} from "../components";
import HotelArchived from "../components/HotelArchived";

export default function HotelRow({ hotel }: { hotel: Hotel }) {
	return (
		<HotelProvider hotel={hotel}>
			<ContextMenu>
				<ContextMenuTrigger>
					<Card className="overflow-hidden rounded-[14px] p-2">
						<CardContent className="overflow-hidden p-0">
							<div className="flex gap-2">
								<div className="group relative aspect-square h-fit w-fit shrink-0 overflow-hidden rounded-[10px]">
									<HotelImage className="size-18 object-fill transition-transform duration-300 ease-out group-hover:scale-110" />
									<div className="absolute top-1 right-1 rounded-full bg-white/70 p-0.5">
										<HotelArchived className="text-black [&_svg]:size-4.5" />
									</div>
								</div>
								<div className="space-y-1">
									<HotelName />
									<HotelRating />
									<HotelAddress className="w-fit" />
								</div>
							</div>
						</CardContent>
					</Card>
				</ContextMenuTrigger>
				<ContextMenuContent>
					<ContextMenuGroup>
						<ContextMenuItem className="text-blue-500">
							<Pen className="text-blue-500" />
							Modifier
						</ContextMenuItem>
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
