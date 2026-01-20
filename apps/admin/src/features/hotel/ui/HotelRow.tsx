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
import { Pen, Trash } from "lucide-react";
import {
	HotelAddress,
	HotelCardProvider,
	HotelImage,
	HotelName,
	HotelRating,
} from "../components";

export default function HotelRow({ hotel }: { hotel: Hotel }) {
	return (
		<HotelCardProvider hotel={hotel}>
			<ContextMenu>
				<ContextMenuTrigger>
					<Card className="overflow-hidden rounded-[14px] p-2">
						<CardContent className="overflow-hidden p-0">
							<div className="flex gap-2">
								<div className="group aspect-square h-fit w-fit shrink-0 overflow-hidden rounded-[10px]">
									<HotelImage className="size-18 object-fill transition-transform duration-300 ease-out group-hover:scale-110" />
								</div>
								<div className="space-y-1">
									<HotelName />
									<HotelRating />
									<HotelAddress className="w-fit" />
									{/* <HotelCardActions /> */}
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
