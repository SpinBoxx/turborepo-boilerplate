import { cn } from "@/lib/utils";

interface UserInitialAvatarProps {
	initial: string;
	size?: "trigger" | "menu";
	className?: string;
}

export default function UserInitialAvatar({
	initial,
	size = "trigger",
	className,
}: UserInitialAvatarProps) {
	return (
		<span
			className={cn(
				"flex shrink-0 items-center justify-center rounded-full bg-primary font-semibold text-primary-foreground uppercase",
				size === "trigger" &&
					"size-6 text-xs sm:size-5.5 md:size-6.5 md:text-base",
				size === "menu" && "size-9 text-sm md:size-8.5 md:text-sm",
				className,
			)}
		>
			{initial}
		</span>
	);
}
