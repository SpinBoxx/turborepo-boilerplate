import { formatPrice } from "@zanadeal/utils";
import type * as React from "react";
import { Button } from "@/components/ui/button";
import {
	Drawer,
	DrawerDescription,
	DrawerFooter,
	DrawerPanel,
	DrawerPopup,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import RoomArea from "../components/RoomArea";
import RoomBaths from "../components/RoomBaths";
import RoomBeds from "../components/RoomBeds";
import RoomCarousel from "../components/RoomCarousel";
import { useRoomContext } from "../components/RoomProvider";
import RoomQuantity from "../components/RoomQuantity";
import RoomType from "../components/RoomType";
import RoomDetailTabs from "./RoomDetailTabs/RoomDetailTabs";

type RootProps = React.ComponentProps<typeof Drawer>;

interface Props {
	children: React.ReactElement;
	snapPoints?: RootProps["snapPoints"];
}

export default function RoomDetailDrawer({ children, snapPoints }: Props) {
	const { room } = useRoomContext();
	const displayPrice = room.promoPrice > 0 ? room.promoPrice : room.price;

	return (
		<Drawer
			modal
			snapPoints={snapPoints}
			snapToSequentialPoints={Boolean(snapPoints?.length)}
			swipeDirection="down"
		>
			<DrawerTrigger render={children} />
			<DrawerPopup showBar>
				<DrawerPanel className="space-y-4">
					<RoomCarousel />

					<div className="space-y-3">
						<div className="flex items-start justify-between gap-3">
							<div className="space-y-2">
								<DrawerTitle className="font-semibold text-2xl leading-tight tracking-[-0.04em]">
									{room.title}
								</DrawerTitle>
								<DrawerDescription className="text-sm leading-relaxed">
									Explore this room in detail before confirming your selection.
								</DrawerDescription>
							</div>
							<RoomType display="badge" className="mt-1" />
						</div>

						<div className="flex flex-wrap gap-2.5">
							<RoomQuantity variant="badge" />
							<RoomArea variant="badge" />
							<RoomBaths variant="badge" />
							<RoomBeds variant="badge" />
						</div>

						<RoomDetailTabs />
					</div>
				</DrawerPanel>
				<DrawerFooter className={cn()}>
					<div className="flex items-center gap-3">
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
					</div>
				</DrawerFooter>
			</DrawerPopup>
		</Drawer>
	);
}
