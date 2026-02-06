import {
	Empty,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
	Spinner,
} from "@zanadeal/ui";

export default function HotelsLoading() {
	return (
		<Empty>
			<EmptyHeader>
				<EmptyMedia variant="icon">
					<Spinner />
				</EmptyMedia>
				<EmptyTitle>Chargement des hôtels...</EmptyTitle>
			</EmptyHeader>
		</Empty>
	);
}
