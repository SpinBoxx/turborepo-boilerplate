import type { Amenity } from "@zanadeal/api/contracts";
import { Button, Card, CardContent, cn } from "@zanadeal/ui";
import { cva, type VariantProps } from "class-variance-authority";
import { Check, Pencil, Trash2 } from "lucide-react";
import type { ComponentProps } from "react";
import AmenityIcon from "../components/AmenityIcon";

const cardVariants = cva("group relative", {
	variants: {
		size: {
			sm: "p-1",
			md: "p-1",
			lg: "",
		},
	},
	defaultVariants: {
		size: "lg",
	},
});

const contentVariants = cva("grid", {
	variants: {
		size: {
			sm: "gap-1.5 p-2",
			md: "gap-2 p-3",
			lg: "gap-3",
		},
	},
	defaultVariants: {
		size: "lg",
	},
});

const iconVariants = cva("", {
	variants: {
		size: {
			sm: "size-9",
			md: "size-10",
			lg: "size-10",
		},
	},
	defaultVariants: {
		size: "lg",
	},
});

const iconInnerVariants = cva("", {
	variants: {
		size: {
			sm: "size-5",
			md: "size-4",
			lg: "size-4",
		},
	},
	defaultVariants: {
		size: "lg",
	},
});

const checkVariants = cva(
	"absolute flex items-center justify-center rounded-full bg-primary",
	{
		variants: {
			size: {
				sm: "top-4 right-5 size-5",
				md: "top-5 right-5 size-5",
				lg: "top-5 right-5 size-5",
			},
		},
		defaultVariants: {
			size: "lg",
		},
	},
);

const checkIconVariants = cva("text-primary-foreground", {
	variants: {
		size: {
			sm: "size-3",
			md: "size-3",
			lg: "size-3",
		},
	},
	defaultVariants: {
		size: "lg",
	},
});

const textVariants = cva("truncate font-semibold", {
	variants: {
		size: {
			sm: "text-sm",
			md: "text-sm",
			lg: "text-base",
		},
	},
	defaultVariants: {
		size: "lg",
	},
});

const buttonVariants = cva("", {
	variants: {
		size: {
			sm: "h-5 w-5",
			md: "h-6 w-6",
			lg: "h-8 w-8",
		},
	},
	defaultVariants: {
		size: "lg",
	},
});

const buttonIconVariants = cva("", {
	variants: {
		size: {
			sm: "size-3",
			md: "size-3.5",
			lg: "size-4",
		},
	},
	defaultVariants: {
		size: "lg",
	},
});

const gapVariants = cva("flex items-start justify-between", {
	variants: {
		size: {
			sm: "gap-1.5",
			md: "gap-2",
			lg: "gap-3",
		},
	},
	defaultVariants: {
		size: "lg",
	},
});

interface Props
	extends ComponentProps<"div">,
		VariantProps<typeof cardVariants> {
	amenity: Amenity;
	onEdit?: () => void;
	onDelete?: () => void;
	isSelected?: boolean;
	onClick?: () => void;
}

export default function AmenityCard({
	amenity,
	onEdit,
	onDelete,
	isSelected,
	onClick,
	size = "lg",
	className,
}: Props) {
	return (
		<Card
			className={cn(
				cardVariants({ size }),
				onClick &&
					"cursor-pointer transition-all duration-200 hover:border-primary/50 hover:shadow-sm",
				isSelected && "border-primary bg-primary/5 shadow-sm",
				className,
			)}
			onClick={onClick}
		>
			<CardContent className={contentVariants({ size })}>
				<div className={gapVariants({ size })}>
					<AmenityIcon
						svg={amenity.icon}
						className={iconVariants({ size })}
						iconClassName={iconInnerVariants({ size })}
					/>

					{isSelected && (
						<div className={checkVariants({ size })}>
							<Check className={checkIconVariants({ size })} />
						</div>
					)}

					<div
						className={cn(
							"flex gap-1",
							"opacity-100 transition-opacity",
							"sm:opacity-0 sm:group-hover:opacity-100",
							"sm:group-focus-within:opacity-100",
						)}
					>
						{onEdit && (
							<Button
								variant="ghost"
								size="icon"
								className={buttonVariants({ size })}
								onClick={onEdit}
							>
								<Pencil className={buttonIconVariants({ size })} />
								<span className="sr-only">Modifier</span>
							</Button>
						)}
						{onDelete && (
							<Button
								variant="ghost"
								size="icon"
								className={cn(
									buttonVariants({ size }),
									"hover:bg-red-500/30 hover:text-red-500 dark:hover:bg-red-500/30 dark:hover:text-red-500",
								)}
								onClick={onDelete}
							>
								<Trash2 className={buttonIconVariants({ size })} />
								<span className="sr-only">Supprimer</span>
							</Button>
						)}
					</div>
				</div>

				<div className="min-w-0">
					<p
						className={cn(
							textVariants({ size }),
							isSelected ? "text-primary" : "text-foreground",
						)}
					>
						{amenity.name}
					</p>
				</div>
			</CardContent>
		</Card>
	);
}
