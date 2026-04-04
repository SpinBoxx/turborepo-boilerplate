import { HandPlatter, InfoIcon, MapIcon } from "lucide-react";
import { useIntlayer } from "react-intlayer";
import { Tabs, TabsList, TabsPanel, TabsTab } from "@/components/ui/tabs";
import HotelDetailAmenitiesTab from "./HotelDetailAmenitiesTab";
import HotelDetailInformationTab from "./HotelDetailInformationTab";
import HotelDetailMapsTab from "./HotelDetailMapsTab";

export default function HotelDetailTabs() {
	const t = useIntlayer("hotel-detail");

	return (
		<Tabs defaultValue="tab-1">
			<div className="border-b">
				<TabsList variant="underline">
					<TabsTab value="tab-1">
						<InfoIcon />
						{t.informations.value}
					</TabsTab>
					<TabsTab value="tab-2">
						<HandPlatter />
						{t.amenities.value}
					</TabsTab>
					<TabsTab value="tab-3">
						<MapIcon />
						{t.maps.value}
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
