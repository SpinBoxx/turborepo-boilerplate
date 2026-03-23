import { Moon, Sun } from "lucide-react";
import { useTheme } from "../ThemeProvider";
import { Button, type ButtonProps } from "../ui/button";

interface Props {
	variant?: ButtonProps["variant"];
	size?: ButtonProps["size"];
	iconClassName?: string;
}

export default function ToggleThemeButton({
	variant = "ghost",
	size = "icon",
	iconClassName,
}: Props) {
	const { theme, setTheme } = useTheme();
	return (
		<Button
			variant={variant}
			size={size}
			onClick={() => {
				if (theme === "light") {
					setTheme("dark");
				} else {
					setTheme("light");
				}
			}}
		>
			{theme === "light" ? (
				<Moon className={iconClassName} />
			) : (
				<Sun className={iconClassName} />
			)}
		</Button>
	);
}
