import { Link, useNavigate } from "@tanstack/react-router";
import { X } from "lucide-react";
import type * as React from "react";
import { useIntlayer } from "react-intlayer";
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
import { useBookingStore } from "@/features/booking/hooks/useBookingHook";
import { cn } from "@/lib/utils";
import RoomArea from "../components/RoomArea";
import RoomAvailableQuantity from "../components/RoomAvailableQuantity";
import RoomBaths from "../components/RoomBaths";
import RoomBeds from "../components/RoomBeds";
import RoomCarousel from "../components/RoomCarousel";
import { useRoomContext } from "../components/RoomProvider";
import RoomTotalPrice from "../components/RoomTotalPrice";
import RoomType from "../components/RoomType";
import RoomDetailTabs from "./RoomDetailTabs/RoomDetailTabs";

interface Props {
	children: React.ReactElement;
}

export default function RoomDetailDialog({ children }: Props) {
	const { room } = useRoomContext();
	const t = useIntlayer("room-detail");
	const { setRoomId } = useBookingStore();
	const navigate = useNavigate();
	const onConfirm = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
		e.preventDefault();
		e.stopPropagation();
		setRoomId(room.id);
		navigate({
			to: "/review-cart-checkout",
			replace: true,
		});
	};
	return (
		<Dialog modal>
			<DialogTrigger render={children} />
			<DialogPopup showCloseButton={false} className={"md:max-w-xl"}>
				<div className="flex min-h-0 flex-1 flex-col gap-3.5 space-y-1 p-4 pb-6">
					<DialogClose
						className={
							"absolute top-5.5 right-5.5 z-50 text-white opacity-70 transition-opacity hover:opacity-100 dark:opacity-100"
						}
						render={<Button variant={"outline"} />}
					>
						<X className="size-5 stroke-3 text-black dark:text-white dark:opacity-100" />
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
										{t.exploreRoom.value}
									</DialogDescription>
								</div>
								<RoomType display="badge" className="mt-1" />
							</div>

							<div className="flex flex-wrap gap-2.5">
								<RoomAvailableQuantity
									type="badge"
									className="[&_svg]:size-5!"
								/>
								<RoomArea variant="badge" />
								<RoomBaths variant="badge" />
								<RoomBeds variant="badge" />
							</div>
						</div>

						<RoomDetailTabs />
					</DialogPanel>
				</div>

				<DialogFooter>
					<div className={cn("flex w-full items-center justify-between gap-3")}>
						<RoomTotalPrice className="justify-self-start" />
						<Link to="/review-cart-checkout" onClick={onConfirm}>
							<Button className="min-w-44 rounded-2xl" size="xl">
								{t.confirm.value}
							</Button>
						</Link>
					</div>
				</DialogFooter>
			</DialogPopup>
		</Dialog>
	);
}
