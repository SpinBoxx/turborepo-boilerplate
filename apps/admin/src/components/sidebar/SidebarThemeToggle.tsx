import { Button, useSidebar } from "@zanadeal/ui";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../ThemeProvider";

export function SidebarThemeToggle() {
	const { setTheme, theme } = useTheme();
	const { state } = useSidebar();
	const isCollapsed = state === "collapsed";
	const onClick = () => {
		if (theme === "dark") {
			setTheme("light");
		} else {
			setTheme("dark");
		}
	};

	return (
		<Button
			variant="ghost"
			size={isCollapsed ? "icon" : "default"}
			onClick={onClick}
		>
			{isCollapsed ? (
				<>
					<Moon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
					<Sun className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
				</>
			) : theme === "dark" ? (
				<Sun className="h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
			) : (
				<Moon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
			)}

			{!isCollapsed ? (theme === "dark" ? "Light mode" : "Dark mode") : null}
			<span className="sr-only">Toggle theme</span>
		</Button>
	);
}
