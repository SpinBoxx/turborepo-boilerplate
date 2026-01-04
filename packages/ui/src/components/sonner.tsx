import {
	CircleCheckIcon,
	InfoIcon,
	Loader2Icon,
	OctagonXIcon,
	TriangleAlertIcon,
} from "lucide-react";
import type { CSSProperties } from "react";
import { Toaster as Sonner, type ToasterProps } from "sonner";

function getThemeFromDom(): ToasterProps["theme"] {
	const doc = (
		globalThis as unknown as {
			document?: {
				documentElement?: { classList?: { contains?: (v: string) => boolean } };
			};
		}
	).document;
	const classList = doc?.documentElement?.classList;
	const contains = classList?.contains;
	if (typeof contains !== "function") return "system";

	if (contains("dark")) return "dark";
	if (contains("light")) return "light";

	const matchMedia = (
		globalThis as unknown as {
			matchMedia?: (q: string) => { matches: boolean };
		}
	).matchMedia;
	if (typeof matchMedia === "function") {
		return matchMedia("(prefers-color-scheme: dark)").matches
			? "dark"
			: "light";
	}

	return "system";
}

const Toaster = ({ ...props }: ToasterProps) => {
	const theme = props.theme ?? getThemeFromDom();

	return (
		<Sonner
			theme={theme as ToasterProps["theme"]}
			className="toaster group"
			icons={{
				success: <CircleCheckIcon className="size-4" />,
				info: <InfoIcon className="size-4" />,
				warning: <TriangleAlertIcon className="size-4" />,
				error: <OctagonXIcon className="size-4" />,
				loading: <Loader2Icon className="size-4 animate-spin" />,
			}}
			style={
				{
					"--normal-bg": "var(--popover)",
					"--normal-text": "var(--popover-foreground)",
					"--normal-border": "var(--border)",
					"--border-radius": "var(--radius)",
				} as CSSProperties
			}
			{...props}
		/>
	);
};

export { Toaster };
