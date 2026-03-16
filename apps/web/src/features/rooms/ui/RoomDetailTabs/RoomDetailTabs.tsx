import { HandPlatter, InfoIcon } from "lucide-react";
import { Tabs, TabsList, TabsPanel, TabsTab } from "@/components/ui/tabs";
import RoomDetailAmenitiesTab from "./RoomDetailAmenitiesTab";
import RoomDetailInformationTab from "./RoomDetailInformationTab";

export default function RoomDetailTabs() {
	return (
		<Tabs defaultValue="information">
			<div className="border-b">
				<TabsList variant="underline" className="w-full justify-start gap-1">
					<TabsTab value="information">
						<InfoIcon />
						Information
					</TabsTab>
					<TabsTab value="amenities">
						<HandPlatter />
						Amenities
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
