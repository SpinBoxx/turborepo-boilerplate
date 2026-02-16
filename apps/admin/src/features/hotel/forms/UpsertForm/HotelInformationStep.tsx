import AutocompleteMap from "@/components/maps/AutocompleteMaps";
import { withForm } from "@/hooks/useAppForm";
import { HOTEL_UPSERT_DEFAULT_VALUES } from "./hotelUpsertForm.defaults";

const HotelInformationsStep = withForm({
	defaultValues: HOTEL_UPSERT_DEFAULT_VALUES,

	render: function Render({ form }) {
		// const name = useStore(form.store, (state) => state.values.name);
		return (
			<div className="w-full space-y-4">
				<AutocompleteMap
					defaultPlace={form.getFieldValue("name")}
					onUpdate={(selectedPlace) => {
						console.log("reset");

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
				<form.AppField name="email">
					{(field) => (
						<field.TextField
							label="Email"
							inputProps={{
								placeholder: "contact@hotel.com",
							}}
						/>
					)}
				</form.AppField>
				<form.AppField name="phoneNumber">
					{(field) => (
						<field.TextField
							label="Numéro de téléphone"
							inputProps={{
								placeholder: "06 12 34 56 78",
							}}
						/>
					)}
				</form.AppField>
			</div>
		);
	},
});

export default HotelInformationsStep;
