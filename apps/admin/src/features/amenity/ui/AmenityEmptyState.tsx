import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@zanadeal/ui";

export default function AmenityEmptyState() {
	return (
		<Empty>
			<EmptyHeader>
				<EmptyMedia variant="icon" />
				<EmptyTitle>Aucun service</EmptyTitle>
				<EmptyDescription>
					Créez votre premier service pour l'associer aux hôtels et chambres.
				</EmptyDescription>
			</EmptyHeader>
		</Empty>
	);
}
