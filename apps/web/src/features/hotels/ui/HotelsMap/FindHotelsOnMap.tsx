import { cn } from "@zanadeal/ui";
import { useMemo } from "react";
import { useIntlayer } from "react-intlayer";
import PlacesMap from "@/components/maps/PlacesMap";
import { useHotels } from "../../hotel.queries";
import { type HotelMapPoi, hotelsToMapPois } from "./find-hotels-on-map.utils";
import HotelMarker from "./HotelMarker";
import HotelMarkerPreviewCard from "./HotelMarkerPreviewCard";

interface Props {
	className?: string;
}

export default function FindHotelsOnMap({ className }: Props) {
	const t = useIntlayer("find-hotels-on-map");

	const hotelsQuery = useHotels({
		filters: {},
		page: 1,
		sort: {
			direction: "asc",
			field: "name",
		},
		skip: 0,
		limit: 20,
		take: 20,
	});
	const hotels = hotelsQuery.data?.items ?? [];
	const hotelPois = useMemo(() => hotelsToMapPois(hotels), [hotels]);

	return (
		<div className={cn("space-y-4", className)}>
			<div className="flex items-end justify-between">
				<div>
					<h3 className="font-semibold text-xl md:text-2xl">{t.title.value}</h3>
					<p className="mt-1 text-muted-foreground">{t.description.value}</p>
				</div>
			</div>
			<PlacesMap<HotelMapPoi>
				className="h-150 overflow-hidden rounded-lg"
				locations={hotelPois}
				config={{ allowCluster: true }}
				renderPoiContent={(poi, { close }) => (
					<HotelMarkerPreviewCard hotel={poi.hotel} onClose={close} />
				)}
			>
				{(poi, { selected }) => (
					<HotelMarker selected={selected} hotel={poi.hotel} />
				)}
			</PlacesMap>
		</div>
	);
}
