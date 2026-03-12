import { HandPlatter, InfoIcon, MapIcon } from "lucide-react";
import { Tabs, TabsList, TabsPanel, TabsTab } from "@/components/ui/tabs";
import HotelDetailAmenitiesTab from "./HotelDetailAmenitiesTab";
import HotelDetailInformationTab from "./HotelDetailInformationTab";
import HotelDetailMapsTab from "./HotelDetailMapsTab";

export default function HotelDetailTabs() {
	return (
		<Tabs defaultValue="tab-1">
			<div className="border-b">
				<TabsList variant="underline">
					<TabsTab value="tab-1">
						<InfoIcon />
						Informations
					</TabsTab>
					<TabsTab value="tab-2">
						<HandPlatter />
						Amenities
					</TabsTab>
					<TabsTab value="tab-3">
						<MapIcon />
						Maps
					</TabsTab>
				</TabsList>
			</div>
			<div className="mt-2 md:pl-3">
				<TabsPanel value="tab-1">
					<HotelDetailInformationTab />
				</TabsPanel>
				<TabsPanel value="tab-2">
					<HotelDetailAmenitiesTab />
				</TabsPanel>
				<TabsPanel value="tab-3">
					<HotelDetailMapsTab />
				</TabsPanel>
			</div>
		</Tabs>
	);
}
