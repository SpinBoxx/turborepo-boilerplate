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
import Editor from "./editor/Editor";

type InputType = "text" | "code";

interface Props<T> {
	fieldKey: keyof Omit<T, "locale">;
	value: T[];
	onChange: (value: T[]) => void;
	inputType?: InputType;
}

export function TranslationTabsForm<
	T extends {
		locale: AmenityTranslationInput["locale"];
		[key: string]: string;
	},
>({ value, onChange, fieldKey, inputType = "text" }: Props<T>) {
	const isTranslationSet = useCallback(
		(locale: AmenityTranslationInput["locale"]) => {
			const existingTranslation = value.find((t) => t.locale === locale);
			return existingTranslation !== undefined;
		},
		[value],
	);

	const handleChange = (
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
				value.map((t) =>
					t.locale === locale ? { ...t, [fieldKey]: newValue } : t,
				),
			);
		} else {
			onChange([...value, { locale, [fieldKey]: newValue } as T]);
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
					{
						{
							text: (
								<InputGroup>
									<InputGroupAddon>{locale.toUpperCase()}</InputGroupAddon>
									<InputGroupInput
										placeholder={`Texte en ${locale.toUpperCase()}`}
										value={
											value.find((t) => t.locale === locale)?.[fieldKey] || ""
										}
										onChange={(e) => handleChange(locale, e.target.value)}
									/>
								</InputGroup>
							),
							code: (
								<Editor
									value={
										value.find((t) => t.locale === locale)?.[fieldKey] || ""
									}
									language="html"
									className="overflow-x-auto"
									setValue={(newValue) => handleChange(locale, newValue)}
								/>
							),
						}[inputType]
					}
				</TabsContent>
			))}
		</Tabs>
	);
}
