import { withForm } from "@/hooks/useAppForm";
import { RoomType } from "../../../../../../../../packages/db/prisma/generated/enums";
import { ROOM_UPSERT_DEFAULT_VALUES } from "../upsertRoom.config";

const RoomInformationsFormStep = withForm({
	defaultValues: ROOM_UPSERT_DEFAULT_VALUES,

	render: function Render({ form }) {
		// const name = useStore(form.store, (state) => state.values.name);
		return (
			<div className="w-full space-y-4">
				<form.AppField name="title">
					{(field) => (
						<field.TextField
							label="Titre"
							inputProps={{
								placeholder: "Ex: Suite vue mer",
							}}
						/>
					)}
				</form.AppField>
				<form.AppField name="type">
					{(field) => (
						<field.Select
							label="Type"
							values={Object.values(RoomType).map((roomType) => ({
								label: roomType,
								value: roomType,
							}))}
						/>
					)}
				</form.AppField>
				<form.AppField name="description">
					{(field) => (
						<field.TextArea
							label="Description"
							placeholder="Description de la chambre d'hotel"
						/>
					)}
				</form.AppField>
				<div className="grid grid-cols-2 gap-5 lg:grid-cols-3">
					<form.AppField name="beds">
						{(field) => (
							<div className="flex flex-col gap-1">
								<field.TextField
									label="Lits"
									inputProps={{
										type: "number",
										min: 1,
										placeholder: "Nombre de lits",
									}}
								/>
								<small className="text-muted-foreground">
									Nombre de lits disponibles dans la chambre
								</small>
							</div>
						)}
					</form.AppField>
					<form.AppField name="maxGuests">
						{(field) => (
							<div className="flex flex-col gap-1">
								<field.TextField
									label="Voyageurs max"
									inputProps={{
										type: "number",
										min: 1,
										placeholder: "Capacité maximale",
									}}
								/>
								<small className="text-muted-foreground">
									Nombre maximal de voyageurs pour cette chambre
								</small>
							</div>
						)}
					</form.AppField>
					<form.AppField name="baths">
						{(field) => (
							<field.TextField
								label="Salles de bain"
								inputProps={{
									type: "number",
									min: 1,
									placeholder: "Nombre de salles de bain",
								}}
							/>
						)}
					</form.AppField>
					<form.AppField name="areaM2">
						{(field) => (
							<field.TextField
								label="Surface (m²)"
								inputProps={{
									type: "number",
									min: 1,
									step: "0.1",
									placeholder: "Surface de la chambre",
								}}
							/>
						)}
					</form.AppField>
					<form.AppField name="quantity">
						{(field) => (
							<field.TextField
								label="Quantité"
								inputProps={{
									type: "number",
									min: 1,
									placeholder: "Nombre de chambres disponibles",
								}}
							/>
						)}
					</form.AppField>
				</div>
			</div>
		);
	},
});

export default RoomInformationsFormStep;
