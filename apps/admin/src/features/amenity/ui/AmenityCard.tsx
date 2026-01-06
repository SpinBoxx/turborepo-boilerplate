import type { Amenity } from "@zanadeal/api/contracts";
import { Button, Card, CardContent, cn } from "@zanadeal/ui";
import { Pencil, Trash2 } from "lucide-react";
import AmenityIcon from "./AmenityIcon";

export default function AmenityCard({
	amenity,
	onEdit,
	onDelete,
}: {
	amenity: Amenity;
	onEdit: () => void;
	onDelete: () => void;
}) {
	return (
		<Card className="group relative">
			<CardContent className="grid gap-3">
				<div className="flex items-start justify-between gap-3">
					<AmenityIcon svg={amenity.icon} />
					<div
						className={cn(
							"flex gap-1",
							"opacity-100 transition-opacity",
							"sm:opacity-0 sm:group-hover:opacity-100",
							"sm:group-focus-within:opacity-100",
						)}
					>
						<Button
							variant="ghost"
							size="icon"
							className="h-8 w-8"
							onClick={onEdit}
						>
							<Pencil className="size-4" />
							<span className="sr-only">Modifier</span>
						</Button>
						<Button
							variant="ghost"
							size="icon"
							className="h-8 w-8 hover:bg-red-500/30 hover:text-red-500 dark:hover:bg-red-500/30 dark:hover:text-red-500"
							onClick={onDelete}
						>
							<Trash2 className="size-4" />
							<span className="sr-only">Supprimer</span>
						</Button>
					</div>
				</div>

				<div className="min-w-0">
					<p className="truncate font-semibold text-foreground">
						{amenity.name}
					</p>
				</div>
			</CardContent>
		</Card>
	);
}
