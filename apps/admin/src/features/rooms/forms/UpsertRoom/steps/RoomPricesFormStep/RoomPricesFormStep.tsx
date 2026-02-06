import { useStore } from "@tanstack/react-form";
import type { CreateRoomPriceInput } from "@zanadeal/api/features/room/room.schemas";
import { withForm } from "@/hooks/useAppForm";
import { ROOM_UPSERT_DEFAULT_VALUES } from "../../upsertRoom.config";
import RoomPricePeriodForm from "./components/RoomPricePeriodForm";
import RoomPricePeriodList from "./components/RoomPricePeriodList";
import { cleanPriceData, cleanPricesData } from "./utils/price.utils";

const RoomPricesFormStep = withForm({
	defaultValues: ROOM_UPSERT_DEFAULT_VALUES,

	render: function Render({ form }) {
		const prices = useStore(form.store, (state) => state.values.prices);

		const handleAddPeriod = (period: CreateRoomPriceInput) => {
			form.setFieldValue("prices", [
				...cleanPricesData(prices),
				cleanPriceData(period),
			]);
		};

		const handleDeletePeriod = (index: number) => {
			const filteredPrices = prices.filter((_, i) => i !== index);
			form.setFieldValue("prices", cleanPricesData(filteredPrices));
		};

		return (
			<div className="w-full space-y-6">
				<RoomPricePeriodForm onAddPeriod={handleAddPeriod} />

				<RoomPricePeriodList
					periods={prices}
					onDeletePeriod={handleDeletePeriod}
				/>
			</div>
		);
	},
});

export default RoomPricesFormStep;
