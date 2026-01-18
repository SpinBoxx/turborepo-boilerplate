import {
	AdvancedMarker,
	APIProvider,
	ControlPosition,
	Map as GoogleMaps,
	MapControl,
	useAdvancedMarkerRef,
	useMap,
	useMapsLibrary,
} from "@vis.gl/react-google-maps";
import { Input } from "@zanadeal/ui";
import { useEffect, useRef, useState } from "react";

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

interface Props {
	defaultPlace: string | undefined;
	onUpdate?: (selectedPlace: google.maps.places.PlaceResult | null) => void;
}

const AutocompleteMap = ({ onUpdate, defaultPlace }: Props) => {
	const [selectedPlace, setSelectedPlace] =
		useState<google.maps.places.PlaceResult | null>(null);
	const [markerRef, marker] = useAdvancedMarkerRef();

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (onUpdate) onUpdate(selectedPlace);
	}, [selectedPlace]);

	return (
		<APIProvider
			apiKey={API_KEY}
			solutionChannel="GMP_devsite_samples_v3_rgmautocomplete"
		>
			<GoogleMaps
				mapId={"bf51a910020fa25a"}
				defaultZoom={3}
				className="h-60"
				defaultCenter={{ lat: 22.54992, lng: 0 }}
				gestureHandling={"greedy"}
				disableDefaultUI={true}
			>
				<AdvancedMarker ref={markerRef} position={null} />
			</GoogleMaps>
			<MapControl position={ControlPosition.TOP_CENTER}>
				<div className="autocomplete-control mt-2 w-[250px]">
					<PlaceAutocomplete
						name={defaultPlace || ""}
						onPlaceSelect={setSelectedPlace}
					/>
				</div>
			</MapControl>
			<MapHandler place={selectedPlace} marker={marker} />
		</APIProvider>
	);
};

interface MapHandlerProps {
	place: google.maps.places.PlaceResult | null;
	marker: google.maps.marker.AdvancedMarkerElement | null;
}

const MapHandler = ({ place, marker }: MapHandlerProps) => {
	const map = useMap();

	useEffect(() => {
		if (!map || !place || !marker) return;

		if (place.geometry?.viewport) {
			map.fitBounds(place.geometry?.viewport);
		}
		marker.position = place.geometry?.location;
	}, [map, place, marker]);

	return null;
};

interface PlaceAutocompleteProps {
	onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void;
	name: string;
}

const PlaceAutocomplete = ({ onPlaceSelect, name }: PlaceAutocompleteProps) => {
	const [placeAutocomplete, setPlaceAutocomplete] =
		useState<google.maps.places.Autocomplete | null>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const places = useMapsLibrary("places");

	useEffect(() => {
		if (!places || !inputRef.current) return;

		const options = {
			fields: ["geometry", "name", "formatted_address", "place_id"],
		};

		setPlaceAutocomplete(new places.Autocomplete(inputRef.current, options));
	}, [places]);

	useEffect(() => {
		if (!placeAutocomplete) return;

		placeAutocomplete.addListener("place_changed", () => {
			onPlaceSelect(placeAutocomplete.getPlace());
		});
	}, [onPlaceSelect, placeAutocomplete]);

	return (
		<div className="autocomplete-container">
			<Input
				type="text"
				defaultValue={name}
				ref={inputRef}
				className="rounded-lg border bg-white px-3 py-2 shadow-md focus:ring-2 focus:ring-primary dark:bg-input/90"
			/>
			{/* Custom style for the dropdown container */}
			<style>{`
					.custom-autocomplete-container {
						position: relative;
						width: 100%;
						max-width: 800px;
					}
					.pac-container {
						cursor: default;
						border-radius: 0.75rem !important;
						box-shadow: 0 4px 16px rgba(0,0,0,0.08);
						border: 1px solid #e5e7eb !important;
						padding: 0rem 0;
						position: absolute !important;
						font-size: 1rem;
						z-index: 9999999999 !important;
						point-events: all !important
          } 
					.pac-item {
						padding: 0.1rem 0.5rem;
						border-bottom: 1px solid #f3f4f6;
						cursor: pointer;
					};
					.pac-item:last-child {
						border-bottom: none;
					}
					.pac-item-selected, .pac-item:hover {
						background: #f3f4f6 !important;
					}
				`}</style>
		</div>
	);
};

export default AutocompleteMap;
