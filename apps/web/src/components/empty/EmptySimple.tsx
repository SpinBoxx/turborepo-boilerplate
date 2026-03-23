import { cn } from "@zanadeal/ui";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";

interface Props {
	className?: string;
	title: string;
	description?: string;
	children: React.ReactNode;
	icon: React.ReactNode;
}

export default function EmptySimple({
	className,
	title,
	description,
	children,
	icon,
}: Props) {
	return (
		<Empty className={cn("", className)}>
			<EmptyHeader>
				<EmptyMedia variant="icon">{icon}</EmptyMedia>
				<EmptyTitle>{title}</EmptyTitle>
				<EmptyDescription>{description}</EmptyDescription>
			</EmptyHeader>
			<EmptyContent>{children}</EmptyContent>
		</Empty>
	);
}
