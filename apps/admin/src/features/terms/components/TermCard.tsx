import { Link } from "@tanstack/react-router";
import type { Terms } from "@zanadeal/api/contracts";
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
	term: Terms;
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
						__html: term.content,
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
