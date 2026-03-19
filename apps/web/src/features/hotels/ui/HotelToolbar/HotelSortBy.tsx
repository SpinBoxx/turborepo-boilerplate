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
	HOTEL_SORT_OPTIONS,
	type HotelSortValue,
} from "./hotel-toolbar.options";
import { useHotelToolbarStore } from "./hotel-toolbar.store";

export default function HotelSortBy() {
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
				{HOTEL_SORT_OPTIONS.map(({ label, value: optionValue }) => (
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
			aria-label="Trier les hotels"
			items={HOTEL_SORT_OPTIONS}
			onValueChange={(nextValue) => {
				if (!nextValue) {
					return;
				}
				setSort(nextValue as HotelSortValue);
			}}
			value={value}
		>
			<SelectTrigger>
				<SelectValue placeholder="Trier par" />
			</SelectTrigger>
			<SelectPopup>
				{HOTEL_SORT_OPTIONS.map(({ label, value: optionValue }) => (
					<SelectItem key={optionValue} value={optionValue}>
						{label}
					</SelectItem>
				))}
			</SelectPopup>
		</Select>
	);
}
