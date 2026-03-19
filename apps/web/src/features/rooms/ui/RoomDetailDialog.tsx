import { formatPrice } from "@zanadeal/utils";
import { X } from "lucide-react";
import type * as React from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogDescription,
	DialogFooter,
	DialogPanel,
	DialogPopup,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import RoomArea from "../components/RoomArea";
import RoomBaths from "../components/RoomBaths";
import RoomBeds from "../components/RoomBeds";
import RoomCarousel from "../components/RoomCarousel";
import { useRoomContext } from "../components/RoomProvider";
import RoomQuantity from "../components/RoomQuantity";
import RoomType from "../components/RoomType";
import RoomDetailTabs from "./RoomDetailTabs/RoomDetailTabs";

interface Props {
	children: React.ReactElement;
}

export default function RoomDetailDialog({ children }: Props) {
	const { room } = useRoomContext();
	const displayPrice = room.promoPrice > 0 ? room.promoPrice : room.price;

	return (
		<Dialog modal>
			<DialogTrigger render={children} />
			<DialogPopup showCloseButton={false}>
				<div className="flex min-h-0 flex-1 flex-col gap-3.5 space-y-1 p-4 pb-6">
					<DialogClose
						className={
							"absolute top-5.5 right-5.5 z-50 text-white opacity-70 transition-opacity hover:opacity-100 dark:opacity-100"
						}
						render={<Button variant={"outline"} />}
					>
						<X className="size-5 stroke-3 text-black dark:text-white" />
					</DialogClose>

					<RoomCarousel />

					<DialogPanel className="min-h-0 flex-1 space-y-4 p-0">
						<div className="space-y-3">
							<div className="flex items-start justify-between gap-3">
								<div className="space-y-2">
									<DialogTitle className="font-semibold text-2xl leading-tight tracking-[-0.04em]">
										{room.title}
									</DialogTitle>
									<DialogDescription className="text-sm leading-relaxed">
										Explore this room in detail before confirming your
										selection.
									</DialogDescription>
								</div>
								<RoomType display="badge" className="mt-1" />
							</div>

							<div className="flex flex-wrap gap-2.5">
								<RoomQuantity variant="badge" />
								<RoomArea variant="badge" />
								<RoomBaths variant="badge" />
								<RoomBeds variant="badge" />
							</div>
						</div>

						<RoomDetailTabs />
					</DialogPanel>
				</div>

				<DialogFooter className={cn("flex items-center justify-between")}>
					<div className="min-w-0 flex-1">
						<p className="text-muted-foreground text-xs uppercase tracking-[0.14em]">
							Total Price
						</p>
						<div className="flex items-end gap-1.5">
							<span className="font-semibold text-2xl leading-none tracking-[-0.05em]">
								{formatPrice(displayPrice)}
							</span>
							<span className="pb-0.5 text-muted-foreground text-sm">
								/night
							</span>
						</div>
					</div>
					<Button className="min-w-44 rounded-2xl" size="xl">
						Confirm
					</Button>
				</DialogFooter>
			</DialogPopup>
		</Dialog>
	);
}
