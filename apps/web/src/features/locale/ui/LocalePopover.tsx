import { cn } from "@zanadeal/ui";
import { Globe } from "lucide-react";
import { useMemo } from "react";
import { useIntlayerContext } from "react-intlayer";
import { Button } from "../../../components/ui/button";
import {
	Menu,
	MenuPopup,
	MenuRadioGroup,
	MenuRadioItem,
	MenuTrigger,
} from "../../../components/ui/menu";
import { getLanguages } from "../services/locale";

interface Props {
	className?: string;
}

const LocalePopover = ({ className }: Props) => {
	const { setLocale, locale } = useIntlayerContext();

	const locales = useMemo(() => {
		return getLanguages(locale);
	}, [locale]);

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
					{locales.map((lang) => (
						<MenuRadioItem key={lang.code} value={lang.code} closeOnClick>
							<span className={cn("mr-2", lang.flag)} />
							{lang.label}
						</MenuRadioItem>
					))}
				</MenuRadioGroup>
			</MenuPopup>
		</Menu>
	);
};

export default LocalePopover;
