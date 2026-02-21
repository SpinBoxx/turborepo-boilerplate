import { LOCALES } from "@zanadeal/api/constants";
import type { AmenityTranslationInput } from "@zanadeal/api/features/amenity/amenity-translation.schemas";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@zanadeal/ui";
import { useCallback } from "react";

interface Props {
	value: AmenityTranslationInput[];
	onChange: (value: AmenityTranslationInput[]) => void;
}

export function TranslationTabsForm({ value, onChange }: Props) {
	const isTranslationSet = useCallback(
		(locale: AmenityTranslationInput["locale"]) => {
			const existingTranslation = value.find((t) => t.locale === locale);
			return existingTranslation !== undefined;
		},
		[value],
	);

	const _handleChange = (
		locale: AmenityTranslationInput["locale"],
		newValue: string,
	) => {
		const existingTranslation = value.find((t) => t.locale === locale);
		if (existingTranslation) {
			if (newValue === "") {
				onChange(value.filter((t) => t.locale !== locale));
				return;
			}
			onChange(
				value.map((t) => (t.locale === locale ? { ...t, name: newValue } : t)),
			);
		} else {
			onChange([
				...value,
				{
					locale: locale as AmenityTranslationInput["locale"],
					name: newValue,
				},
			]);
		}
	};

	return (
		<Tabs className="" defaultValue={LOCALES[0]}>
			<TabsList>
				{Object.values(LOCALES).map((locale) => (
					<TabsTrigger key={locale} value={locale} className="relative">
						{locale.toUpperCase()}
						{isTranslationSet(locale) && (
							<span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-green-500" />
						)}
					</TabsTrigger>
				))}
			</TabsList>
			{Object.values(LOCALES).map((locale) => (
				<TabsContent key={locale} value={locale}>
					<InputGroup>
						<InputGroupAddon>{locale.toUpperCase()}</InputGroupAddon>
						<InputGroupInput
							placeholder={`Texte en ${locale.toUpperCase()}`}
							value={value.find((t) => t.locale === locale)?.name || ""}
							onChange={(e) => _handleChange(locale, e.target.value)}
						/>
					</InputGroup>
				</TabsContent>
			))}
		</Tabs>
	);
}
