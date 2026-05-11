import { Button } from "@zanadeal/ui";
import { Moon, Sun } from "lucide-react";
import { useIntlayer } from "react-intlayer";
import { useTheme } from "./ThemeProvider";

export function ModeToggle() {
	const { setTheme, theme } = useTheme();
	const t = useIntlayer("common");

	const onClick = () => {
		if (theme === "dark") {
			setTheme("light");
		} else {
			setTheme("dark");
		}
	};

	return (
		<Button variant="outline" size="icon" onClick={onClick}>
			<Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
			<Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
			<span className="sr-only">{t.toggleTheme.value}</span>
		</Button>
	);
}
