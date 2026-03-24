import { InfoWindow, useMap } from "@vis.gl/react-google-maps";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import PoiMarkers from "./PoiMarker";
import type {
	MapsPoi,
	MapViewportMode,
	RenderPoiContent,
	RenderPoiMarker,
} from "./types";

type MarkerClustererModule = typeof import("@googlemaps/markerclusterer");
type ClusterableMarker = google.maps.marker.AdvancedMarkerElement;

interface PlacesMapContentProps<TPoi extends MapsPoi> {
	locations: TPoi[];
	allowCluster: boolean;
	viewportMode: MapViewportMode;
	center?: google.maps.LatLngLiteral;
	zoom?: number;
	fitBoundsPadding?: number;
	onPoiClick?: (poi: TPoi) => void;
	renderPoiContent?: RenderPoiContent<TPoi>;
	renderMarker?: RenderPoiMarker<TPoi>;
}

export default function PlacesMapContent<TPoi extends MapsPoi>({
	locations,
	allowCluster,
	viewportMode,
	center,
	zoom,
	fitBoundsPadding,
	onPoiClick,
	renderPoiContent,
	renderMarker,
}: PlacesMapContentProps<TPoi>) {
	const map = useMap();
	// Live registry of rendered AdvancedMarker instances used by both clustering
	// and InfoWindow anchoring.
	const [markers, setMarkers] = useState<Record<string, ClusterableMarker>>({});
	const [selectedPoiKey, setSelectedPoiKey] = useState<string | null>(null);
	const [clustererModule, setClustererModule] =
		useState<MarkerClustererModule | null>(null);
	const clustererRef = useRef<InstanceType<
		MarkerClustererModule["MarkerClusterer"]
	> | null>(null);
	const clustererSyncFrameRef = useRef<number | null>(null);
	const shouldTrackMarkers = allowCluster || !!renderPoiContent;
	// The selected marker instance is the concrete anchor for the floating content.
	const selectedMarker = selectedPoiKey
		? (markers[selectedPoiKey] ?? null)
		: null;
	// Selection is stored by key only; the current POI is always derived from the
	// latest source data so refreshes do not leave stale POI objects in state.
	const selectedPoi = useMemo(
		() => locations.find((poi) => poi.key === selectedPoiKey) ?? null,
		[locations, selectedPoiKey],
	);

	const closePoiContent = useCallback(() => {
		setSelectedPoiKey(null);
	}, []);

	// Theme or map-style changes can recreate the underlying Google Map instance.
	// When that happens, previously registered marker refs must be discarded.
	useEffect(() => {
		if (clustererSyncFrameRef.current != null) {
			cancelAnimationFrame(clustererSyncFrameRef.current);
			clustererSyncFrameRef.current = null;
		}

		clustererRef.current?.clearMarkers();
		clustererRef.current = null;
		setMarkers({});
	}, []);

	// A single effect owns viewport placement so the map follows one explicit
	// strategy: fixed center, first POI, or bounds covering all POI.
	useEffect(() => {
		if (!map) {
			return;
		}

		if (viewportMode === "center") {
			if (center) {
				map.setCenter(center);
			}

			if (zoom != null) {
				map.setZoom(zoom);
			}

			return;
		}

		const firstLocation = locations[0]?.location;

		if (viewportMode === "first") {
			if (!firstLocation) {
				return;
			}

			map.setCenter(firstLocation);

			if (zoom != null) {
				map.setZoom(zoom);
			}

			return;
		}

		if (locations.length === 0) {
			if (center) {
				map.setCenter(center);
			}

			if (zoom != null) {
				map.setZoom(zoom);
			}

			return;
		}

		if (locations.length === 1 && firstLocation) {
			map.setCenter(firstLocation);

			if (zoom != null) {
				map.setZoom(zoom);
			}

			return;
		}

		const bounds = new google.maps.LatLngBounds();

		for (const poi of locations) {
			bounds.extend(poi.location);
		}

		map.fitBounds(bounds, fitBoundsPadding);
	}, [center, fitBoundsPadding, locations, map, viewportMode, zoom]);

	const handlePoiClick = useCallback(
		(poi: TPoi) => {
			// In controlled mode, click behavior is delegated upward.
			if (onPoiClick) {
				onPoiClick(poi);
				return;
			}

			// Without local content there is nothing to open on click.
			if (!renderPoiContent) {
				return;
			}

			// Clicking the same POI twice toggles its floating content.
			setSelectedPoiKey((currentKey) =>
				currentKey === poi.key ? null : poi.key,
			);
		},
		[onPoiClick, renderPoiContent],
	);

	const handleMarkerChange = useCallback(
		(key: string, marker: ClusterableMarker | null) => {
			// Marker registration is incremental during mount/unmount, so we update the
			// registry surgically instead of rebuilding it blindly every time.
			setMarkers((currentMarkers) => {
				if (!marker) {
					if (!(key in currentMarkers)) {
						return currentMarkers;
					}

					const nextMarkers = { ...currentMarkers };
					delete nextMarkers[key];
					return nextMarkers;
				}

				if (currentMarkers[key] === marker) {
					return currentMarkers;
				}

				return {
					...currentMarkers,
					[key]: marker,
				};
			});
		},
		[],
	);

	// If a selected POI disappears after a data refresh, the floating content must
	// close to avoid anchoring to a marker that no longer exists.
	useEffect(() => {
		if (!selectedPoiKey) {
			return;
		}

		const isSelectedPoiStillPresent = locations.some(
			(poi) => poi.key === selectedPoiKey,
		);

		if (!isSelectedPoiStillPresent) {
			setSelectedPoiKey(null);
		}
	}, [locations, selectedPoiKey]);

	// Load the clustering library only when clustering is enabled so the default map
	// path stays lighter.
	useEffect(() => {
		if (!allowCluster) {
			if (clustererSyncFrameRef.current != null) {
				cancelAnimationFrame(clustererSyncFrameRef.current);
				clustererSyncFrameRef.current = null;
			}

			setClustererModule(null);
			return;
		}

		let isCancelled = false;

		import("@googlemaps/markerclusterer").then((module) => {
			if (!isCancelled) {
				setClustererModule(module);
			}
		});

		return () => {
			isCancelled = true;
		};
	}, [allowCluster]);

	// Marker refs are registered over several micro-steps while React mounts the
	// tree. We batch cluster rebuilds to the next frame to avoid thrashing.
	useEffect(() => {
		if (clustererSyncFrameRef.current != null) {
			cancelAnimationFrame(clustererSyncFrameRef.current);
			clustererSyncFrameRef.current = null;
		}

		if (!allowCluster || !map || !clustererModule) {
			clustererRef.current?.clearMarkers();
			clustererRef.current = null;
			return;
		}

		if (!clustererRef.current) {
			clustererRef.current = new clustererModule.MarkerClusterer({ map });
		}

		clustererSyncFrameRef.current = requestAnimationFrame(() => {
			clustererRef.current?.clearMarkers();
			clustererRef.current?.addMarkers(Object.values(markers));
			clustererSyncFrameRef.current = null;
		});

		return () => {
			if (clustererSyncFrameRef.current != null) {
				cancelAnimationFrame(clustererSyncFrameRef.current);
				clustererSyncFrameRef.current = null;
			}
		};
	}, [allowCluster, clustererModule, map, markers]);

	// Local InfoWindow rendering is only active when the map owns click handling.
	// If the parent handles clicks, it can render a drawer or side panel instead.
	const shouldShowPoiContent =
		!!selectedPoi && !!selectedMarker && !!renderPoiContent && !onPoiClick;

	return (
		<>
			<PoiMarkers
				pois={locations}
				selectedKey={selectedPoiKey}
				onPoiClick={handlePoiClick}
				renderMarker={renderMarker}
				onMarkerChange={shouldTrackMarkers ? handleMarkerChange : undefined}
			/>
			{shouldShowPoiContent ? (
				<InfoWindow
					headerDisabled
					disableAutoPan
					style={{
						padding: 0,
					}}
					anchor={selectedMarker}
					onCloseClick={closePoiContent}
					className="bg-background"
				>
					{renderPoiContent(selectedPoi, { close: closePoiContent })}
				</InfoWindow>
			) : null}
		</>
	);
}
