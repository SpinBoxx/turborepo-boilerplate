import { withForm } from "@/hooks/useAppForm";
import { RoomType } from "../../../../../../../../packages/db/prisma/generated/enums";
import { ROOM_UPSERT_DEFAULT_VALUES } from "../upsertRoom.config";

const RoomInformationsFormStep = withForm({
	defaultValues: ROOM_UPSERT_DEFAULT_VALUES,

	render: function Render({ form }) {
		// const name = useStore(form.store, (state) => state.values.name);
		return (
			<div className="w-full space-y-4">
				<form.AppField name="type">
					{(field) => (
						<field.Select
							label="Adresse"
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
				<div className="grid grid-cols-2 gap-5">
					<form.AppField name="capacity">
						{(field) => (
							<div className="flex flex-col gap-1">
								<field.TextField
									label="Capacité"
									inputProps={{
										type: "number",
										min: 1,
										placeholder:
											"Nombre de personnes pouvant occuper la chambre",
									}}
								/>
								<small className="text-muted-foreground">
									Nombre de personnes pouvant occuper la chambre
								</small>
							</div>
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
