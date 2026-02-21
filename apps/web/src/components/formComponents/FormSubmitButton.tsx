import { Button, type ButtonVariants, cn, Spinner } from "@zanadeal/ui";
import type { ComponentProps } from "react";
import { useFormContext } from "@/hooks/useFormContext";

interface Props extends ComponentProps<"button"> {
	variants?: ButtonVariants;
	loadingLabel?: string;
}

export function FormSubmitButton({
	variants,
	loadingLabel,
	children,
	className,
}: Props) {
	const form = useFormContext();
	return (
		<form.Subscribe selector={(state) => state.isSubmitting}>
			{(isSubmitting) => (
				<Button
					type="submit"
					className={cn("", className)}
					disabled={isSubmitting}
					{...variants}
				>
					{isSubmitting ? (
						<>
							<Spinner />
							{loadingLabel && <span className="ml-0">{loadingLabel}</span>}
						</>
					) : (
						children
					)}
				</Button>
			)}
		</form.Subscribe>
	);
}
