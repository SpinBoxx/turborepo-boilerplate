import { Button, cn } from "@zanadeal/ui";
import { Pencil, Trash2 } from "lucide-react";
import { useHotelCard } from "./HotelCardProvider";

export function HotelCardActions({
	className,
	buttonClassName,
}: {
	className?: string;
	buttonClassName?: string;
}) {
	const { hotel, onEdit, onDelete } = useHotelCard();

	return (
		<div className={cn("flex items-center gap-2", className)}>
			<Button
				type="button"
				variant="ghost"
				size="icon"
				className={cn(
					"size-10 rounded-full bg-background/70 backdrop-blur hover:bg-background/80",
					buttonClassName,
				)}
				onClick={() => onEdit?.(hotel)}
			>
				<Pencil className="size-4" />
				<span className="sr-only">Modifier</span>
			</Button>
			<Button
				type="button"
				variant="ghost"
				size="icon"
				className={cn(
					"size-10 rounded-full bg-background/70 backdrop-blur hover:bg-background/80",
					buttonClassName,
				)}
				onClick={() => onDelete?.(hotel)}
			>
				<Trash2 className="size-4" />
				<span className="sr-only">Supprimer</span>
			</Button>
		</div>
	);
}
