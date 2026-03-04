import { Link } from "@tanstack/react-router";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

interface Props extends ComponentProps<"div"> {}

export default function NavbarMenu({ className, ...props }: Props) {
	return (
		<div className={cn("flex items-center gap-3", className)} {...props}>
			<Link to="/" className="w-full">
				<Button variant={"link"}>Home</Button>
			</Link>
		</div>
	);
}
