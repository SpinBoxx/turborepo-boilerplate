import { useStore } from "@tanstack/react-form";
import type { CreateRoomPriceInput } from "@zanadeal/api/features/room/room.schemas";
import { useState } from "react";
import { withForm } from "@/hooks/useAppForm";
import { ROOM_UPSERT_DEFAULT_VALUES } from "../../upsertRoom.config";
import RoomPricePeriodForm from "./components/RoomPricePeriodForm";
import RoomPricePeriodList from "./components/RoomPricePeriodList";
import { cleanPriceData, cleanPricesData } from "./utils/price.utils";

const RoomPricesFormStep = withForm({
	defaultValues: ROOM_UPSERT_DEFAULT_VALUES,

	render: function Render({ form }) {
		const prices = useStore(form.store, (state) => state.values.prices);
		const [editingIndex, setEditingIndex] = useState<number | null>(null);

		const editingPeriod =
			editingIndex !== null ? (prices[editingIndex] ?? null) : null;

		const handleAddPeriod = (period: CreateRoomPriceInput) => {
			form.setFieldValue("prices", [
				...cleanPricesData(prices),
				cleanPriceData(period),
			]);
		};

		const handleEditPeriod = (period: CreateRoomPriceInput) => {
			if (editingIndex === null) return;
			const updatedPrices = [...prices];
			updatedPrices[editingIndex] = cleanPriceData(period);
			form.setFieldValue("prices", cleanPricesData(updatedPrices));
			setEditingIndex(null);
		};

		const handleDeletePeriod = (index: number) => {
			const filteredPrices = prices.filter((_, i) => i !== index);
			form.setFieldValue("prices", cleanPricesData(filteredPrices));
			if (editingIndex === index) {
				setEditingIndex(null);
			}
		};

		return (
			<div className="w-full space-y-6">
				<RoomPricePeriodForm
					prices={prices}
					onAddPeriod={handleAddPeriod}
					onEditPeriod={handleEditPeriod}
					editingPeriod={editingPeriod}
					onCancelEdit={() => setEditingIndex(null)}
				/>

				<RoomPricePeriodList
					periods={prices}
					onEditPeriod={(index) => setEditingIndex(index)}
					onDeletePeriod={handleDeletePeriod}
				/>
			</div>
		);
	},
});

export default RoomPricesFormStep;
