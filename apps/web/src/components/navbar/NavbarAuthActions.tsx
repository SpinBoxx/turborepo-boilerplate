import { Link } from "@tanstack/react-router";
import { LogOut, User, UserCog2 } from "lucide-react";
import { useAuth } from "@/auth/providers/AuthProvider";
import { Button } from "../ui/button";
import {
	Menu,
	MenuGroup,
	MenuGroupLabel,
	MenuItem,
	MenuPopup,
	MenuTrigger,
} from "../ui/menu";

export default function NavbarAuthActions() {
	const { user, signOut } = useAuth();
	if (!user) {
		return (
			<div className="flex gap-2">
				<Link to="/login">
					<Button>Login</Button>
				</Link>
			</div>
		);
	}

	return (
		<div>
			<Menu>
				<MenuTrigger render={<Button variant="outline" size={"icon-xl"} />}>
					<User className="size-6" />
				</MenuTrigger>
				<MenuPopup align="end">
					<MenuGroup>
						<MenuGroupLabel>Profile</MenuGroupLabel>
						<MenuItem>
							<UserCog2 className="size-5" />
							<span>View Profile</span>
						</MenuItem>
					</MenuGroup>
					<MenuItem
						className={"mt-1 cursor-pointer"}
						render={<Button variant="outline" className="w-full" />}
						onClick={() => signOut()}
					>
						<LogOut className="size-5 text-destructive" />
						<span className="text-destructive">Log Out</span>
					</MenuItem>
				</MenuPopup>
			</Menu>
		</div>
	);
}
