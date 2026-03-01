import { Link } from "@tanstack/react-router";
import { Home } from "lucide-react";
import Logo from "../Logo";
import { Button } from "../ui/button";

export default function LoginNavbar() {
	return (
		<div className="flex items-center justify-between">
			<Link to="/">
				<Logo />
			</Link>
			<Link to="/">
				<Button variant={"outline"}>
					<Home />
					Home
				</Button>
			</Link>
		</div>
	);
}
