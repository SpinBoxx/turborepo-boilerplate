import { formatPrice } from "@zanadeal/utils";
import type * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerPopup,
	DrawerTitle,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import RoomCarousel from "../components/RoomCarousel";
import { useRoomContext } from "../components/RoomProvider";
import RoomType from "../components/RoomType";
import RoomDetailTabs from "./RoomDetailTabs/RoomDetailTabs";

type RootProps = React.ComponentProps<typeof Drawer>;

interface Props {
	actionLabel?: string;
	onAction?: () => void;
	onOpenChange: NonNullable<RootProps["onOpenChange"]>;
	open: boolean;
	snapPoints?: RootProps["snapPoints"];
	totalLabel?: string;
}

export default function RoomMobileDrawer({
	actionLabel = "Confirm Selection",
	onAction,
	onOpenChange,
	open,
	snapPoints,
	totalLabel = "Total Price",
}: Props) {
	const { room } = useRoomContext();
	const displayPrice = room.promoPrice > 0 ? room.promoPrice : room.price;

	const handleAction = () => {
		onOpenChange(false, {} as never);
		onAction?.();
	};

	return (
		<Drawer
			modal
			onOpenChange={onOpenChange}
			open={open}
			snapPoints={snapPoints}
			snapToSequentialPoints={Boolean(snapPoints?.length)}
			swipeDirection="down"
		>
			<DrawerPopup className="md:hidden" showCloseButton={false}>
				<DrawerContent className="min-h-0 flex-1 overflow-hidden">
					<div className="min-h-0 flex-1 overflow-y-auto pb-28">
						<div className="space-y-5">
							<div className="overflow-hidden border-border/70 border-b bg-muted/20 px-4 pt-2 pb-4">
								<RoomCarousel />
							</div>

							<div className="space-y-4 px-5">
								<div className="space-y-3">
									<div className="flex items-start justify-between gap-3">
										<div className="space-y-2">
											<DrawerTitle className="font-semibold text-2xl leading-tight tracking-[-0.04em]">
												{room.title}
											</DrawerTitle>
											<DrawerDescription className="text-sm leading-relaxed">
												Explore this room in detail before confirming your
												selection.
											</DrawerDescription>
										</div>
										<RoomType display="badge" className="mt-1" />
									</div>

									<div className="flex flex-wrap gap-2.5">
										<Badge size="lg" variant="secondary">
											{room.areaM2} sq ft
										</Badge>
										<Badge size="lg" variant="outline">
											{room.maxGuests} guests
										</Badge>
										<Badge size="lg" variant="outline">
											{room.beds} {room.beds > 1 ? "beds" : "bed"}
										</Badge>
									</div>
								</div>

								<RoomDetailTabs />
							</div>
						</div>
					</div>

					<div
						className={cn(
							"absolute inset-x-0 border-border/70 border-t",
							"bg-background/95 px-5 py-3 backdrop-blur",
							"supports-backdrop-filter:bg-background/88",
						)}
						style={{
							bottom:
								"calc(var(--drawer-snap-point-offset, 0px) + var(--drawer-swipe-movement-y, 0px))",
						}}
					>
						<div className="flex items-center gap-3">
							<div className="min-w-0 flex-1">
								<p className="text-muted-foreground text-xs uppercase tracking-[0.14em]">
									{totalLabel}
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
							<Button
								className="min-w-44 rounded-2xl"
								size="xl"
								onClick={handleAction}
							>
								{actionLabel}
							</Button>
						</div>
					</div>
				</DrawerContent>
			</DrawerPopup>
		</Drawer>
	);
}
