import { Search, SlidersHorizontalIcon } from "lucide-react";
import { useIntlayer } from "react-intlayer";
import { Badge } from "@/components/ui/badge";
import { ButtonGroupSeparator, Group } from "@/components/ui/group";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";
import HotelFiltersDrawer from "./HotelFiltersDrawer";
import { useHotelToolbarStore } from "./hotel-toolbar.store";

export default function HotelToolbar() {
	const total = useHotelToolbarStore((state) => state.total);
	const name = useHotelToolbarStore((state) => state.name);
	const setName = useHotelToolbarStore((state) => state.setName);

	const t = useIntlayer("hotel-filters-drawer");

	return (
		<div className="flex flex-col gap-4 rounded-3xl border border-border/60 bg-card/80 p-4 shadow-sm backdrop-blur sm:p-5">
			<div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
				<div>
					<div className="flex items-center gap-2 text-muted-foreground text-sm">
						<SlidersHorizontalIcon className="size-4" />
						<span>{t.refineYourSearch.value}</span>
					</div>
					<h1 className="mt-1 font-semibold text-2xl sm:text-3xl">
						{t.searchIdealHotel.value}
					</h1>
				</div>
				<Badge variant="outline" size="lg" className="w-fit">
					{t.results(total)({ count: total })}
				</Badge>
			</div>

			<div className="flex flex-col gap-3">
				{/* FOR MOBILE */}
				<Group aria-label="Hotel search" className="w-full">
					<InputGroup>
						<InputGroupAddon>
							<Search />
						</InputGroupAddon>
						<InputGroupInput
							onChange={(event) => setName(event.target.value)}
							placeholder={t.searchHotelByName.value}
							size="lg"
							value={name}
						/>
					</InputGroup>
					<ButtonGroupSeparator />
					<HotelFiltersDrawer />
				</Group>
			</div>
		</div>
	);
}
