import { cn } from "@zanadeal/ui";
import { useMemo, useState } from "react";
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
import { getLanguages } from "../services/locale";

interface Props {
	isDefaultOpen?: boolean;
}

export default function LocaleDialog({ isDefaultOpen }: Props) {
	const t = useIntlayer("locale-dialog");
	const [isOpen, setIsOpenn] = useState(isDefaultOpen ?? false);
	const { setLocale, locale } = useIntlayerContext();

	const locales = useMemo(() => {
		return getLanguages(locale);
	}, [locale]);

	const canClose = locales.some((l) => l.code === locale);

	const onClose = () => {
		if (!canClose) return;
		setIsOpenn(false);
	};

	return (
		<Dialog open={isOpen}>
			<DialogPopup className="sm:max-w-sm">
				<Form className="contents">
					<DialogHeader>
						<DialogTitle>{t.title.value}</DialogTitle>
						<DialogDescription>{t.description.value}</DialogDescription>
					</DialogHeader>

					<DialogPanel className="grid gap-4">
						<RadioGroup defaultValue={locale}>
							{locales.map((locale) => (
								<Label
									onClick={() => setLocale(locale.code)}
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
						<Button onClick={onClose} type="button" disabled={!canClose}>
							{t.save.value}
						</Button>
					</DialogFooter>
				</Form>
			</DialogPopup>
		</Dialog>
	);
}
