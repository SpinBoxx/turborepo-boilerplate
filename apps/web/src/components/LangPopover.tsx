import { cn } from "@zanadeal/ui";
import { Locales } from "intlayer";
import { Globe } from "lucide-react";
import { useIntlayerContext } from "react-intlayer";
import { Button } from "./ui/button";
import {
	Menu,
	MenuPopup,
	MenuRadioGroup,
	MenuRadioItem,
	MenuTrigger,
} from "./ui/menu";

interface Props {
	className?: string;
}

const LangPopover = ({ className }: Props) => {
	const languages = [
		{ code: Locales.FRENCH, label: "Français", flag: "🇫🇷" },
		{ code: Locales.ENGLISH, label: "English", flag: "🇺🇸" },
		{ code: Locales.MALAGASY_MADAGASCAR, label: "Malagasy", flag: "🇲🇬" },
	];

	const { setLocale, locale } = useIntlayerContext();

	return (
		<Menu>
			<MenuTrigger
				render={
					<Button
						onClick={() => {}}
						size={"icon"}
						className={cn(className)}
						variant="ghost"
					/>
				}
			>
				<Globe />
			</MenuTrigger>
			<MenuPopup className="">
				<MenuRadioGroup value={locale} onValueChange={setLocale}>
					{languages.map((lang) => (
						<MenuRadioItem key={lang.code} value={lang.code}>
							<span className="mr-2">{lang.flag}</span>
							{lang.label}
						</MenuRadioItem>
					))}
				</MenuRadioGroup>
			</MenuPopup>
		</Menu>
	);
};

export default LangPopover;
