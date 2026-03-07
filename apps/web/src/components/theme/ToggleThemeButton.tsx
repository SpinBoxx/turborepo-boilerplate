import { Moon, Sun } from "lucide-react";
import { useTheme } from "../ThemeProvider";
import { Button } from "../ui/button";

export default function ToggleThemeButton() {
	const { theme, setTheme } = useTheme();
	return (
		<Button
			variant={"ghost"}
			onClick={() => {
				if (theme === "light") {
					setTheme("dark");
				} else {
					setTheme("light");
				}
			}}
		>
			{theme === "light" ? <Moon /> : <Sun />}
		</Button>
	);
}
