import { cn } from "@zanadeal/ui";
import { uppercaseFirstLetter } from "@zanadeal/utils";
import { getLocaleName, Locales } from "intlayer";
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
	const { setLocale, locale } = useIntlayerContext();

	const languages = [
		{
			code: Locales.FRENCH,
			label: uppercaseFirstLetter(getLocaleName(Locales.FRENCH, locale)),
			flag: "🇫🇷",
		},
		{
			code: Locales.ENGLISH,
			label: uppercaseFirstLetter(getLocaleName(Locales.ENGLISH, locale)),
			flag: "🇺🇸",
		},
		{
			code: Locales.MALAGASY_MADAGASCAR,
			label: uppercaseFirstLetter(
				getLocaleName(Locales.MALAGASY_MADAGASCAR, locale),
			),
			flag: "🇲🇬",
		},
	];

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
						<MenuRadioItem key={lang.code} value={lang.code} closeOnClick>
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
