import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@zanadeal/ui";

export default function HotelEmptyState() {
	return (
		<Empty>
			<EmptyHeader>
				<EmptyMedia variant="icon" />
				<EmptyTitle>Aucun hôtel</EmptyTitle>
				<EmptyDescription>
					Ajoutez votre premier établissement pour commencer à gérer vos
					services, photos et informations bancaires.
				</EmptyDescription>
			</EmptyHeader>
		</Empty>
	);
}
