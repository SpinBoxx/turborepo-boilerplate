import { cn } from "@zanadeal/ui";
import { AlertTriangle } from "lucide-react";
import type { ComponentProps } from "react";
import { useRoomContext } from "./RoomProvider";

interface Props extends ComponentProps<"div"> {}

export default function RoomPrice({ className, ...props }: Props) {
	const { room } = useRoomContext();
	const { prices } = room;

	if (room.price === 0) {
		return (
			<div className="">
				<div
					className={cn(
						"inline-flex items-center text-base text-red-600",
						className,
					)}
				>
					<AlertTriangle className="mr-2 size-5 shrink-0 self-start" />
					<span>Prix non défini !</span>
				</div>
				<div className="text-sm">
					<p className="text-muted-foreground">
						Prochaine période de prix active le:
					</p>
					<div>
						{prices[0] ? (
							<span className="font-medium">
								{new Date(prices[0].startDate).toLocaleDateString("fr-FR", {
									day: "2-digit",
									month: "2-digit",
									year: "2-digit",
								})}
							</span>
						) : (
							<span className="text-orange-500">
								! Aucune période définie !
							</span>
						)}
					</div>
				</div>
			</div>
		);
	}

	const basePrice = Math.min(...prices.map((p) => p.price));

	return (
		<div className={cn("flex items-baseline gap-1", className)} {...props}>
			<span className="font-bold text-2xl">{basePrice}€</span>
			<span className="text-muted-foreground text-sm">/ nuit</span>
		</div>
	);
}
