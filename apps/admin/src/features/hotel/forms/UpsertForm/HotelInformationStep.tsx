import AutocompleteMap from "@/components/maps/AutocompleteMaps";
import { withForm } from "@/hooks/useAppForm";
import { HOTEL_UPSERT_DEFAULT_VALUES } from "./hotelUpsertForm.defaults";

const HotelInformationsStep = withForm({
	defaultValues: HOTEL_UPSERT_DEFAULT_VALUES,

	render: function Render({ form }) {
		return (
			<div className="w-full space-y-4">
				<AutocompleteMap
					defaultPlace={form.getFieldValue("name")}
					onUpdate={(selectedPlace) => {
						form.setFieldValue(
							"address",
							selectedPlace?.formatted_address || "",
						);
						form.setFieldValue(
							"latitude",
							selectedPlace?.geometry?.location?.lat().toString() || "",
						);
						form.setFieldValue(
							"longitude",
							selectedPlace?.geometry?.location?.lng().toString() || "",
						);
						form.setFieldValue("name", selectedPlace?.name || "");
						// Générer le lien Google Maps Embed avec le place_id
						if (selectedPlace?.place_id) {
							const _apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
							form.setFieldValue(
								"mapLink",
								`https://www.google.com/maps/embed/v1/place?q=place_id:${selectedPlace.place_id}`,
							);
						}
					}}
				/>
				<form.AppField name="address">
					{(field) => (
						<field.TextField
							label="Adresse"
							inputProps={{
								placeholder: "123 Avenue des Champs-Élysées, Paris",
							}}
						/>
					)}
				</form.AppField>
				<form.AppField name="name">
					{(field) => (
						<field.TextField
							label="Nom de l'hôtel"
							inputProps={{ placeholder: "Le Grand Palais" }}
						/>
					)}
				</form.AppField>
				<form.AppField name="description">
					{(field) => (
						<field.TextArea
							label="Description"
							placeholder="Décrivez l'hôtel..."
							rows={4}
						/>
					)}
				</form.AppField>
				<form.AppField name="latitude">
					{(field) => (
						<field.TextField
							label="Latitude"
							inputProps={{ placeholder: "48.8566" }}
						/>
					)}
				</form.AppField>
				<form.AppField name="longitude">
					{(field) => (
						<field.TextField
							label="Longitude"
							inputProps={{
								placeholder: "2.3522",
							}}
						/>
					)}
				</form.AppField>
				<form.AppField name="mapLink">
					{(field) => (
						<field.TextField
							label="Google Maps Link"
							inputProps={{
								placeholder: "https://maps.google.com/?q=48.8566,2.3522",
							}}
						/>
					)}
				</form.AppField>
			</div>
		);
	},
});

export default HotelInformationsStep;
