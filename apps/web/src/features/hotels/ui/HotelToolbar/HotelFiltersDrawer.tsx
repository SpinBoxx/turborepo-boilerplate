import { SlidersHorizontal } from "lucide-react";
import { useIntlayer } from "react-intlayer";
import { Button } from "@/components/ui/button";
import {
	Drawer,
	DrawerClose,
	DrawerFooter,
	DrawerHeader,
	DrawerPanel,
	DrawerPopup,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import HotelFiltersPanel from "./HotelFiltersPanel";
import { useHotelToolbarStore } from "./hotel-toolbar.store";

export default function HotelFiltersDrawer() {
	const drawerOpen = useHotelToolbarStore((state) => state.drawerOpen);
	const setDrawerOpen = useHotelToolbarStore((state) => state.setDrawerOpen);
	const applyDraft = useHotelToolbarStore((state) => state.applyDraft);
	const reset = useHotelToolbarStore((state) => state.reset);
	const hasActiveFilter = useHotelToolbarStore((state) =>
		state.hasActiveFilter(),
	);
	const { total } = useHotelToolbarStore();

	const isMobile = useIsMobile();
	const t = useIntlayer("hotel-filters-drawer");
	return (
		<Drawer
			open={drawerOpen}
			onOpenChange={setDrawerOpen}
			position={isMobile ? "bottom" : "right"}
		>
			<DrawerTrigger
				render={<Button type="button" variant="outline" size="lg" />}
			>
				<SlidersHorizontal />
				{t.filters.value}
				{hasActiveFilter ? (
					<span className="rounded-full bg-primary/12 px-2 py-0.5 text-primary text-xs">
						{t.filterActive.value}
					</span>
				) : null}
			</DrawerTrigger>
			<DrawerPopup
				position={isMobile ? "bottom" : "right"}
				showBar={!!isMobile}
				variant={isMobile ? "default" : "inset"}
			>
				<DrawerHeader>
					<div className="flex items-center justify-between">
						<DrawerTitle>{t.filters.value}</DrawerTitle>
						<Button
							type="button"
							variant="ghost"
							className="text-primary text-sm uppercase tracking-wide"
							onClick={reset}
						>
							{t.resetFilters.value}
						</Button>
					</div>
				</DrawerHeader>
				<DrawerPanel>
					<HotelFiltersPanel showSort />
				</DrawerPanel>
				<DrawerFooter variant="bare">
					<div className="flex w-full flex-col gap-4">
						<Button
							type="button"
							className="w-full"
							onClick={isMobile ? applyDraft : () => setDrawerOpen(false)}
						>
							{t.applyFilters.value} ({t.results(total)({ count: total })})
						</Button>
						{!isMobile && (
							<DrawerClose
								render={<Button variant={"outline"} className="w-full" />}
							>
								{t.close.value}
							</DrawerClose>
						)}
					</div>
				</DrawerFooter>
			</DrawerPopup>
		</Drawer>
	);
}
