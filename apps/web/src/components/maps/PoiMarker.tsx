import {
	AdvancedMarker,
	Pin,
	useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";
import { useEffect } from "react";
import type { MapsPoi, RenderPoiMarker } from "./types";

interface Props<TPoi extends MapsPoi> {
	pois: TPoi[];
	selectedKey?: string | null;
	onPoiClick?: (poi: TPoi) => void;
	renderMarker?: RenderPoiMarker<TPoi>;
	onMarkerChange?: (
		key: string,
		marker: google.maps.marker.AdvancedMarkerElement | null,
	) => void;
}

function PoiMarker<TPoi extends MapsPoi>({
	poi,
	selected,
	onPoiClick,
	renderMarker,
	onMarkerChange,
}: {
	poi: TPoi;
	selected: boolean;
	onPoiClick?: (poi: TPoi) => void;
	renderMarker?: RenderPoiMarker<TPoi>;
	onMarkerChange?: Props<TPoi>["onMarkerChange"];
}) {
	const [markerRef, marker] = useAdvancedMarkerRef();

	useEffect(() => {
		onMarkerChange?.(poi.key, marker);

		return () => {
			onMarkerChange?.(poi.key, null);
		};
	}, [marker, onMarkerChange, poi.key]);

	return (
		<AdvancedMarker
			ref={markerRef}
			position={poi.location}
			clickable
			onClick={() => onPoiClick?.(poi)}
		>
			{renderMarker ? (
				renderMarker(poi, { selected })
			) : (
				<Pin background={"#FBBC04"} glyphColor={"#000"} borderColor={"#000"} />
			)}
		</AdvancedMarker>
	);
}

const PoiMarkers = <TPoi extends MapsPoi>({
	pois,
	selectedKey,
	onPoiClick,
	renderMarker,
	onMarkerChange,
}: Props<TPoi>) => {
	return (
		<>
			{pois.map((poi) => (
				<PoiMarker
					key={poi.key}
					poi={poi}
					selected={selectedKey === poi.key}
					onPoiClick={onPoiClick}
					renderMarker={renderMarker}
					onMarkerChange={onMarkerChange}
				/>
			))}
		</>
	);
};

export default PoiMarkers;
