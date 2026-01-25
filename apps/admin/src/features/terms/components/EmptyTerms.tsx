import { Link } from "@tanstack/react-router";
import {
	Button,
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@zanadeal/ui";
import { ScrollText } from "lucide-react";

export function EmptyTerms() {
	return (
		<Empty>
			<EmptyHeader>
				<EmptyMedia variant="icon">
					<ScrollText />
				</EmptyMedia>
				<EmptyTitle>Pas de conditions générales</EmptyTitle>
				<EmptyDescription>
					Il n'y a pas encore de conditions générales sur Zanadeal. Veuillez en
					créer une !
				</EmptyDescription>
			</EmptyHeader>
			<EmptyContent className="flex-row justify-center gap-2">
				<Link to="/dashboard/terms/create-term">
					<Button>Créer une condition générale</Button>
				</Link>
			</EmptyContent>
		</Empty>
	);
}
