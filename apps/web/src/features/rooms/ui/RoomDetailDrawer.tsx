import { Link } from "@tanstack/react-router";
import type * as React from "react";
import { useIntlayer } from "react-intlayer";
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
import RoomTotalPrice from "../components/RoomTotalPrice";
import RoomType from "../components/RoomType";
import RoomDetailTabs from "./RoomDetailTabs/RoomDetailTabs";

type RootProps = React.ComponentProps<typeof Drawer>;

interface Props {
	children: React.ReactElement;
	snapPoints?: RootProps["snapPoints"];
}

export default function RoomDetailDrawer({ children, snapPoints }: Props) {
	const { room } = useRoomContext();
	const t = useIntlayer("room-detail");

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
								{t.exploreRoom.value}
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
					<div className="flex items-center justify-between gap-3">
						<RoomTotalPrice />

						<Link to="/review-cart-checkout">
							<Button className="rounded-2xl" size="default">
							{t.confirm.value}
							</Button>
						</Link>
					</div>
				</DrawerFooter>
			</DrawerPopup>
		</Drawer>
	);
}
