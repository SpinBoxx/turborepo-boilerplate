import {
	APIProvider,
	ColorScheme,
	Map as GoogleMaps,
} from "@vis.gl/react-google-maps";
import { cn } from "@zanadeal/ui";
import { useTheme } from "../ThemeProvider";
import PlacesMapContent from "./PlacesMapContent";
import type {
	MapConfig,
	MapsPoi,
	MapViewportMode,
	RenderPoiContent,
	RenderPoiMarker,
} from "./types";
import "../../google-maps-style.css";

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const DEFAULT_CENTER = { lat: -18.8792, lng: 47.5079 };
const DEFAULT_ZOOM = 13;

interface Props<TPoi extends MapsPoi = MapsPoi> {
	locations: TPoi[];
	config?: MapConfig;
	className?: string;
	viewportMode?: MapViewportMode;
	center?: google.maps.LatLngLiteral;
	zoom?: number;
	fitBoundsPadding?: number;
	onPoiClick?: (poi: TPoi) => void;
	renderPoiContent?: RenderPoiContent<TPoi>;
	children?: RenderPoiMarker<TPoi>;
}

export default function PlacesMap<TPoi extends MapsPoi = MapsPoi>({
	locations,
	config,
	className,
	viewportMode = "fit-bounds",
	center,
	zoom = DEFAULT_ZOOM,
	fitBoundsPadding = 48,
	onPoiClick,
	renderPoiContent,
	children,
}: Props<TPoi>) {
	const allowCluster = config?.allowCluster ?? false;
	const resolvedCenter = center ?? locations[0]?.location ?? DEFAULT_CENTER;

	const { theme } = useTheme();

	return (
		<APIProvider apiKey={API_KEY}>
			<GoogleMaps
				className={cn("w-full", className)}
				mapId={"a19425a6dc46018226582841"}
				defaultZoom={zoom}
				defaultCenter={resolvedCenter}
				mapTypeControl={false}
				streetViewControl={false}
				colorScheme={theme === "dark" ? ColorScheme.DARK : ColorScheme.LIGHT}
			>
				<PlacesMapContent<TPoi>
					locations={locations}
					allowCluster={allowCluster}
					viewportMode={viewportMode}
					center={resolvedCenter}
					zoom={zoom}
					fitBoundsPadding={fitBoundsPadding}
					onPoiClick={onPoiClick}
					renderPoiContent={renderPoiContent}
					renderMarker={children}
				/>
			</GoogleMaps>
		</APIProvider>
	);
}
