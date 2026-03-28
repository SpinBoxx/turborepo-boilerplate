import { Link } from "@tanstack/react-router";
import type { ComponentProps } from "react";
import { useIntlayer } from "react-intlayer";
import { cn } from "@/lib/utils";
import { Button } from "../../components/ui/button";

interface Props extends ComponentProps<"div"> {}

export default function NavbarMenu({ className, ...props }: Props) {
	const t = useIntlayer("navbar");
	return (
		<div className={cn("flex items-center gap-3", className)} {...props}>
			<Link to="/" className="w-full">
				<Button variant={"link"}>{t.home.value}</Button>
			</Link>
		</div>
	);
}
