import { cn } from "@zanadeal/ui";
import { useEffect, useMemo, useState } from "react";
import { useIntlayer, useIntlayerContext } from "react-intlayer";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogPanel,
	DialogPopup,
	DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Radio, RadioGroup } from "@/components/ui/radio-group";
import {
	getLanguages,
	getStoredLocale,
	isLocaleValid,
	storeLocale,
} from "../services/locale";

export default function LocaleDialog() {
	const t = useIntlayer("locale-dialog");
	const { locale, setLocale } = useIntlayerContext();
	const [selectedLocale, setSelectedLocale] = useState(locale);
	const [isOpen, setIsOpen] = useState(() => !getStoredLocale());

	useEffect(() => {
		if (!isOpen) setSelectedLocale(locale);
	}, [isOpen, locale]);

	const locales = useMemo(() => {
		return getLanguages(locale);
	}, [locale]);

	const canSave = isLocaleValid(selectedLocale);

	const onLocaleChange = (value: string) => {
		if (!isLocaleValid(value)) return;

		setSelectedLocale(value);
	};

	const onSave = () => {
		if (!canSave) return;

		storeLocale(selectedLocale);
		setLocale(selectedLocale);
		setIsOpen(false);
	};

	return (
		<Dialog
			onOpenChange={(open) => {
				if (open) {
					setIsOpen(true);
					return;
				}

				onSave();
			}}
			open={isOpen}
		>
			<DialogPopup className="sm:max-w-sm">
				<Form className="contents">
					<DialogHeader>
						<DialogTitle>{t.title.value}</DialogTitle>
						<DialogDescription>{t.description.value}</DialogDescription>
					</DialogHeader>

					<DialogPanel className="grid gap-4">
						<RadioGroup onValueChange={onLocaleChange} value={selectedLocale}>
							{locales.map((locale) => (
								<Label
									onClick={() => onLocaleChange(locale.code)}
									key={locale.code}
									className="flex items-start gap-2 rounded-lg border p-3 hover:bg-accent/50 has-data-checked:border-primary/48 has-data-checked:bg-accent/50"
								>
									<Radio value={locale.code} />
									<div className="flex flex-row items-center gap-1">
										<span className={cn("mr-2", locale.flag)} />
										<span className="text-muted-foreground">
											{locale.label}
										</span>
									</div>
								</Label>
							))}
						</RadioGroup>
					</DialogPanel>

					<DialogFooter>
						<Button onClick={onSave} type="button" disabled={!canSave}>
							{t.save.value}
						</Button>
					</DialogFooter>
				</Form>
			</DialogPopup>
		</Dialog>
	);
}
