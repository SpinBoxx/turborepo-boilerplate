import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardPanel } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import RoomArea from "../components/RoomArea";
import RoomAveragePricePerNight from "../components/RoomAveragePricePerNight";
import RoomBaths from "../components/RoomBaths";
import RoomBeds from "../components/RoomBeds";
import RoomDescription from "../components/RoomDescription";
import RoomImage from "../components/RoomImage";
import RoomTitle from "../components/RoomTitle";
import RoomType from "../components/RoomType";
import RoomMobileDrawer from "./RoomMobileDrawer";

interface Props {
	className?: string;
	onViewDetails?: () => void;
}

const RoomCard = ({ className, onViewDetails }: Props) => {
	const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
	const isMobile = useIsMobile();

	const handlePrimaryAction = () => {
		if (isMobile) {
			setMobileDrawerOpen(true);
			return;
		}

		onViewDetails?.();
	};

	return (
		<>
			<Card
				className={cn(
					"group overflow-hidden rounded-4xl border-border/70 bg-card p-0 shadow-[0_6px_20px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_44px_rgba(15,23,42,0.14)]",
					className,
				)}
			>
				<CardPanel className="p-0">
					<div className="relative overflow-hidden">
						<RoomImage
							variant="listing-card"
							className="aspect-[1.65/1] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.08]"
						/>

						<RoomType className="absolute top-3 right-4" display={"badge"} />
					</div>

					<div className="space-y-4 px-5 py-5 md:px-6 md:py-6">
						<div className="flex flex-col gap-1">
							<div className="items-start-safe flex justify-between gap-3">
								<RoomTitle className="font-semibold text-xl" />
							</div>
							<RoomDescription className="text-muted-foreground text-sm" />
						</div>

						<div className="flex flex-row flex-wrap items-center gap-2.5">
							<RoomBeds />
							<Separator orientation="vertical" />
							<RoomBaths />
							<Separator orientation="vertical" />
							<RoomArea />
						</div>

						<Separator className="bg-border/80" />

						<div className="flex flex-row items-center justify-between gap-4">
							<RoomAveragePricePerNight label="Average price" />
							<Button
								type="button"
								size="lg"
								onClick={handlePrimaryAction}
								className="rounded-2xl text-base"
							>
								View details
								<ArrowRight className="size-5" />
							</Button>
						</div>
					</div>
				</CardPanel>
			</Card>

			{isMobile && (
				<RoomMobileDrawer
					onAction={onViewDetails}
					onOpenChange={setMobileDrawerOpen}
					open={mobileDrawerOpen}
				/>
			)}
		</>
	);
};

export default RoomCard;
