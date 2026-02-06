import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@zanadeal/ui";
import { HotelIcon } from "lucide-react";

export default function HotelEmptyState() {
	return (
		<Empty>
			<EmptyHeader>
				<EmptyMedia variant="icon">
					<HotelIcon />
				</EmptyMedia>
				<EmptyTitle>Aucun hôtel</EmptyTitle>
				<EmptyDescription>
					Ajoutez votre premier établissement pour commencer à gérer vos
					services, photos et informations bancaires.
				</EmptyDescription>
			</EmptyHeader>
		</Empty>
	);
}
