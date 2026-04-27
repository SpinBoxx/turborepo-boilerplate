import { Check, Languages, Moon, Palette, Settings2, Sun } from "lucide-react";
import { useMemo, useState } from "react";
import { useIntlayer, useIntlayerContext } from "react-intlayer";
import { useTheme } from "@/components/ThemeProvider";
import { Button } from "@/components/ui/button";
import {
	Menu,
	MenuGroup,
	MenuGroupLabel,
	MenuItem,
	MenuPopup,
	MenuSub,
	MenuSubPopup,
	MenuSubTrigger,
	MenuTrigger,
} from "@/components/ui/menu";
import { getLanguages } from "@/features/locale/services/locale";

type PreferenceSubmenu = "appearance" | "language" | null;

function NavbarPreferencesMenuGroup() {
	const t = useIntlayer("navbar");
	const { theme, setTheme } = useTheme();
	const { locale, setLocale } = useIntlayerContext();
	const [openSubmenu, setOpenSubmenu] = useState<PreferenceSubmenu>(null);

	const locales = useMemo(() => getLanguages(locale), [locale]);
	const selectedLanguage = locales.find((language) => language.code === locale);
	const selectedThemeLabel =
		theme === "light" ? t.lightTheme.value : t.darkTheme.value;

	return (
		<MenuGroup>
			<MenuGroupLabel className="px-2 pt-2 pb-1">
				{t.preferences.value}
			</MenuGroupLabel>
			<div className="space-y-1 px-1 pb-1">
				<MenuSub
					open={openSubmenu === "appearance"}
					onOpenChange={(open) => {
						setOpenSubmenu(open ? "appearance" : null);
					}}
				>
					<MenuSubTrigger
						className="min-h-10 rounded-md px-2.5 py-2"
						onClick={(event) => {
							if (openSubmenu === "appearance") {
								event.preventDefault();
								setOpenSubmenu(null);
							}
						}}
					>
						<span className="flex min-w-0 flex-1 items-center gap-2">
							<Palette className="size-4 md:size-4.5" />
							<span className="font-medium">{t.appearance.value}</span>
							<span className="ml-auto truncate text-muted-foreground text-xs">
								{selectedThemeLabel}
							</span>
						</span>
					</MenuSubTrigger>
					<MenuSubPopup className="w-40">
						<MenuItem
							className="min-h-9 rounded-md px-2 py-1.5"
							onClick={() => {
								setTheme("light");
								setOpenSubmenu(null);
							}}
						>
							<span className="flex size-4 items-center justify-center">
								{theme === "light" && <Check className="size-4 md:size-4.5" />}
							</span>
							<span className="inline-flex items-center gap-2">
								<Sun className="size-4 md:size-4.5" />
								{t.lightTheme.value}
							</span>
						</MenuItem>
						<MenuItem
							className="min-h-9 rounded-md px-2 py-1.5"
							onClick={() => {
								setTheme("dark");
								setOpenSubmenu(null);
							}}
						>
							<span className="flex size-4 items-center justify-center">
								{theme === "dark" && <Check className="size-4 md:size-4.5" />}
							</span>
							<span className="inline-flex items-center gap-2">
								<Moon className="size-4 md:size-4.5" />
								{t.darkTheme.value}
							</span>
						</MenuItem>
					</MenuSubPopup>
				</MenuSub>

				<MenuSub
					open={openSubmenu === "language"}
					onOpenChange={(open) => {
						setOpenSubmenu(open ? "language" : null);
					}}
				>
					<MenuSubTrigger
						className="min-h-10 rounded-md px-2.5 py-2"
						onClick={(event) => {
							if (openSubmenu === "language") {
								event.preventDefault();
								setOpenSubmenu(null);
							}
						}}
					>
						<span className="flex min-w-0 flex-1 items-center gap-2">
							<Languages className="size-4 md:size-4.5" />
							<span className="font-medium">{t.language.value}</span>
							<span className="ml-auto truncate text-muted-foreground text-xs">
								{selectedLanguage?.label}
							</span>
						</span>
					</MenuSubTrigger>
					<MenuSubPopup className="w-48">
						{locales.map((language) => (
							<MenuItem
								key={language.code}
								className="min-h-9 rounded-md px-2 py-1.5"
								onClick={() => {
									setLocale(language.code);
									setOpenSubmenu(null);
								}}
							>
								<span className="flex size-4 items-center justify-center">
									{locale === language.code && (
										<Check className="size-4 md:size-4.5" />
									)}
								</span>
								<span className="inline-flex items-center gap-2">
									<span className={language.flag} />
									{language.label}
								</span>
							</MenuItem>
						))}
					</MenuSubPopup>
				</MenuSub>
			</div>
		</MenuGroup>
	);
}

function NavbarPreferencesMenu() {
	const t = useIntlayer("navbar");

	return (
		<Menu>
			<MenuTrigger
				render={
					<Button
						aria-label={t.preferences.value}
						size="icon"
						variant="outline"
					/>
				}
			>
				<Settings2 className="size-4.5 md:size-4" />
			</MenuTrigger>
			<MenuPopup align="end" className="w-72">
				<NavbarPreferencesMenuGroup />
			</MenuPopup>
		</Menu>
	);
}

export { NavbarPreferencesMenuGroup };
export default NavbarPreferencesMenu;
