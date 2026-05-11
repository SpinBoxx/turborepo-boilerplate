import { useIntlayer } from "react-intlayer";
import {
	Select,
	SelectItem,
	SelectPopup,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Toggle } from "@/components/ui/toggle";
import { ToggleGroup } from "@/components/ui/toggle-group";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import {
	getHotelSortOptions,
	type HotelSortValue,
} from "./hotel-toolbar.options";
import { useHotelToolbarStore } from "./hotel-toolbar.store";

export default function HotelSortBy() {
	const t = useIntlayer("hotel-filters-drawer");
	const sortOptions = getHotelSortOptions({
		priceAscending: t.priceAscending.value,
		priceDescending: t.priceDescending.value,
		nameAscending: t.nameAscending.value,
		nameDescending: t.nameDescending.value,
	});
	const isMobile = useIsMobile();
	const value = useHotelToolbarStore((state) =>
		isMobile ? state.draftSort : state.sort,
	);
	const setSort = useHotelToolbarStore((state) =>
		isMobile ? state.setDraftSort : state.setSort,
	);

	if (isMobile) {
		return (
			<ToggleGroup className="flex flex-wrap gap-3">
				{sortOptions.map(({ label, value: optionValue }) => (
					<Toggle
						variant="outline"
						className={cn(
							"data-pressed:bg-primary data-pressed:text-white dark:data-pressed:bg-primary",
							value === optionValue &&
								"bg-primary text-white hover:bg-primary dark:bg-primary",
						)}
						key={optionValue}
						value={optionValue}
						onClick={() => setSort(optionValue as HotelSortValue)}
					>
						{label}
					</Toggle>
				))}
			</ToggleGroup>
		);
	}

	return (
		<Select
			aria-label={t.sortBy.value}
			items={sortOptions}
			onValueChange={(nextValue) => {
				if (!nextValue) {
					return;
				}
				setSort(nextValue as HotelSortValue);
			}}
			value={value}
		>
			<SelectTrigger>
				<SelectValue placeholder={t.sortBy.value} />
			</SelectTrigger>
			<SelectPopup>
				{sortOptions.map(({ label, value: optionValue }) => (
					<SelectItem key={optionValue} value={optionValue}>
						{label}
					</SelectItem>
				))}
			</SelectPopup>
		</Select>
	);
}
