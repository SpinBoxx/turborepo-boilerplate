import type { ReactNode } from "react";

export type MapsPoi = {
	key: string;
	location: google.maps.LatLngLiteral;
};

export type MapMarkerRenderState = {
	selected: boolean;
};

export type MapPoiContentRenderApi = {
	close: () => void;
};

export type RenderPoiMarker<TPoi extends MapsPoi> = (
	poi: TPoi,
	state: MapMarkerRenderState,
) => ReactNode;

export type RenderPoiContent<TPoi extends MapsPoi> = (
	poi: TPoi,
	api: MapPoiContentRenderApi,
) => ReactNode;

export type MapViewportMode = "fit-bounds" | "first" | "center";

export type MapConfig = {
	allowZoom?: boolean;
	allowCluster?: boolean;
};
