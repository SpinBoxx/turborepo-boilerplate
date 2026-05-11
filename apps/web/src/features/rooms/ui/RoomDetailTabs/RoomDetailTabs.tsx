import { HandPlatter, InfoIcon } from "lucide-react";
import { useIntlayer } from "react-intlayer";
import { Tabs, TabsList, TabsPanel, TabsTab } from "@/components/ui/tabs";
import RoomDetailAmenitiesTab from "./RoomDetailAmenitiesTab";
import RoomDetailInformationTab from "./RoomDetailInformationTab";

export default function RoomDetailTabs() {
	const t = useIntlayer("room-detail");

	return (
		<Tabs defaultValue="information">
			<div className="border-b">
				<TabsList variant="underline" className="w-full justify-start gap-1">
					<TabsTab value="information">
						<InfoIcon />
						{t.information.value}
					</TabsTab>
					<TabsTab value="amenities">
						<HandPlatter />
						{t.amenities.value}
					</TabsTab>
				</TabsList>
			</div>
			<div className="pt-4">
				<TabsPanel value="information">
					<RoomDetailInformationTab />
				</TabsPanel>
				<TabsPanel value="amenities">
					<RoomDetailAmenitiesTab />
				</TabsPanel>
			</div>
		</Tabs>
	);
}
