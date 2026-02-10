import type { CreateRoomPriceInput } from "@zanadeal/api/features/room/room.schemas";
import { cn } from "@zanadeal/ui";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon, Pen, Trash2 } from "lucide-react";

interface RoomPricePeriodItemProps {
	period: CreateRoomPriceInput;
	onEdit?: () => void;
	onDelete?: () => void;
	className?: string;
}

export default function RoomPricePeriodItem({
	period,
	onEdit,
	onDelete,
	className,
}: RoomPricePeriodItemProps) {
	const formatPeriodDate = (date: Date) => {
		return format(date, "d MMM", { locale: fr });
	};

	const getYear = (date: Date) => {
		return format(date, "yyyy", { locale: fr });
	};

	const startDateFormatted = formatPeriodDate(period.startDate);
	const endDateFormatted = period.endDate
		? formatPeriodDate(period.endDate)
		: null;
	const yearEnd = period.endDate
		? getYear(period.endDate)
		: getYear(period.startDate);

	return (
		<div
			className={cn(
				"flex items-center justify-between rounded-lg bg-muted/50 p-3 transition-colors hover:bg-muted",
				className,
			)}
		>
			<div className="flex items-center gap-3">
				<div className="flex size-10 items-center justify-center rounded-md bg-background">
					<CalendarIcon className="size-4 text-muted-foreground" />
				</div>
				<div className="flex flex-col">
					<span className="font-medium text-sm">
						{startDateFormatted}
						{endDateFormatted && (
							<>
								{" "}
								- {endDateFormatted} {yearEnd}
							</>
						)}
					</span>
					<span className="text-muted-foreground text-xs">Saisonnalité</span>
				</div>
			</div>

			<div className="flex items-center gap-3">
				<div className="text-right">
					<div className="font-semibold">{period.price}€</div>
					{period.promoPrice > 0 && period.promoPrice < period.price && (
						<div className="text-green-500 text-xs">
							Promo: {period.promoPrice}€
						</div>
					)}
				</div>
				<div className="flex flex-col">
					{onEdit && (
						<button
							type="button"
							onClick={onEdit}
							className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-blue-600/10 hover:text-blue-500"
						>
							<Pen className="size-4" />
						</button>
					)}
					{onDelete && (
						<button
							type="button"
							onClick={onDelete}
							className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
						>
							<Trash2 className="size-4" />
						</button>
					)}
				</div>
			</div>
		</div>
	);
}
