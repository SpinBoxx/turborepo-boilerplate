import type { CreateRoomPriceInput } from "@zanadeal/api/features/room/room.schemas";
import { cn } from "@zanadeal/ui";
import RoomPricePeriodItem from "./RoomPricePeriodItem";

interface RoomPricePeriodListProps {
	periods: CreateRoomPriceInput[];
	onEditPeriod?: (index: number) => void;
	onDeletePeriod?: (index: number) => void;
	className?: string;
}

export default function RoomPricePeriodList({
	periods,
	onEditPeriod,
	onDeletePeriod,
	className,
}: RoomPricePeriodListProps) {
	if (periods.length === 0) {
		return (
			<div className={cn("py-8 text-center", className)}>
				<p className="text-muted-foreground text-sm">
					Aucune période configurée
				</p>
			</div>
		);
	}

	return (
		<div className={cn("space-y-2", className)}>
			<h4 className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
				Calendrier configuré
			</h4>
			<div className="space-y-2">
				{periods.map((period, index) => (
					<RoomPricePeriodItem
						key={`period-${period.startDate.getTime()}-${index}`}
						period={period}
						onEdit={onEditPeriod ? () => onEditPeriod(index) : undefined}
						onDelete={onDeletePeriod ? () => onDeletePeriod(index) : undefined}
					/>
				))}
			</div>
		</div>
	);
}
