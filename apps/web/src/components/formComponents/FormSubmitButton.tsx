import type { ComponentProps } from "react";
import { useFormContext } from "@/hooks/useFormContext";
import { cn } from "@/lib/utils";
import { Button, type ButtonProps } from "../ui/button";
import { Spinner } from "../ui/spinner";

interface Props extends ComponentProps<"button"> {
	variants?: ButtonProps;
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
