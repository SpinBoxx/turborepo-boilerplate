import { Link } from "@tanstack/react-router";
import type { TermsComputed } from "@zanadeal/api/features/terms/terms-schemas";
import {
	Button,
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	cn,
} from "@zanadeal/ui";
import { Edit } from "lucide-react";
import type { ComponentProps } from "react";
import DeleteTermButton from "./DeleteTermButton";

interface Props extends ComponentProps<"div"> {
	term: TermsComputed;
}

const TermCard = ({ term, className, ...props }: Props) => {
	return (
		<Card className={cn("group relative", className)}>
			<CardHeader>
				<CardTitle>
					{term.type}, {term.version}
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div
					className="line-clamp-13"
					// biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
					dangerouslySetInnerHTML={{
						__html: term.translations.fr?.content ?? "",
					}}
				/>
				<Link to={"/dashboard/terms/$id/update-term"} params={{ id: term.id }}>
					<Button
						size="icon"
						className="absolute top-0 right-10 opacity-0 transition-opacity group-hover:opacity-100"
					>
						<Edit />
					</Button>
				</Link>
				<DeleteTermButton
					id={term.id}
					className="absolute top-0 right-0 opacity-0 transition-opacity group-hover:opacity-100"
				/>
			</CardContent>
		</Card>
	);
};

export default TermCard;
