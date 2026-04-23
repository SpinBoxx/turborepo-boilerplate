import { Link } from "@tanstack/react-router";
import { LogOut, User, UserCog2 } from "lucide-react";
import { useIntlayer } from "react-intlayer";
import { useAuth } from "@/auth/providers/AuthProvider";
import { Button } from "../../components/ui/button";
import {
	Menu,
	MenuGroup,
	MenuGroupLabel,
	MenuItem,
	MenuPopup,
	MenuTrigger,
} from "../../components/ui/menu";

export default function NavbarAuthActions() {
	const { user, signOut } = useAuth();
	const t = useIntlayer("navbar");
	if (!user) {
		return (
			<div className="flex gap-2">
				<Link to="/login">
					<Button>{t.login.value}</Button>
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
						<MenuGroupLabel>{user.email}</MenuGroupLabel>
						<MenuItem>
							<UserCog2 className="size-5" />
							<span>{t.profile.value}</span>
						</MenuItem>
					</MenuGroup>
					<MenuItem
						className={"mt-1 cursor-pointer"}
						render={<Button variant="outline" className="w-full" />}
						onClick={() => signOut()}
					>
						<LogOut className="size-5 text-destructive" />
						<span className="text-destructive">{t.signOut.value}</span>
					</MenuItem>
				</MenuPopup>
			</Menu>
		</div>
	);
}
