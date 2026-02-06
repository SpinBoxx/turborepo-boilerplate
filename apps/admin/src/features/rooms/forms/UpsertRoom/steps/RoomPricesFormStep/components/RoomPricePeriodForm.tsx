"use client";

import type { CreateRoomPriceInput } from "@zanadeal/api/features/room/room.schemas";
import { Button, cn, Input, Label } from "@zanadeal/ui";
import { Plus } from "lucide-react";
import { useState } from "react";
import type { DateRange } from "react-day-picker";
import DateRangePicker from "./DateRangePicker";

interface RoomPricePeriodFormProps {
	onAddPeriod: (period: CreateRoomPriceInput) => void;
	className?: string;
}

export default function RoomPricePeriodForm({
	onAddPeriod,
	className,
}: RoomPricePeriodFormProps) {
	const [dateRange, setDateRange] = useState<DateRange | undefined>();
	const [price, setPrice] = useState<string>("");
	const [promoPrice, setPromoPrice] = useState<string>("");

	const handleSubmit = () => {
		if (!dateRange?.from || !price) {
			return;
		}

		const newPeriod: CreateRoomPriceInput = {
			price: Number.parseFloat(price),
			promoPrice: promoPrice ? Number.parseFloat(promoPrice) : 0,
			startDate: dateRange.from,
			endDate: dateRange.to ?? null,
		};

		onAddPeriod(newPeriod);

		// Reset form
		setDateRange(undefined);
		setPrice("");
		setPromoPrice("");
	};

	const isFormValid = dateRange?.from && price && Number.parseFloat(price) > 0;

	return (
		<div
			className={cn(
				"space-y-4 rounded-lg border border-muted-foreground/30 border-dashed p-4",
				className,
			)}
		>
			<div className="flex items-center gap-2 text-muted-foreground">
				<Plus className="size-4" />
				<span className="font-medium text-sm">Ajouter une période</span>
			</div>

			<DateRangePicker dateRange={dateRange} onDateRangeChange={setDateRange} />

			<div className="grid grid-cols-2 gap-4">
				<div className="space-y-1.5">
					<Label htmlFor="price" className="text-xs">
						Prix (€)
					</Label>
					<div className="relative">
						<Input
							id="price"
							type="number"
							min="0"
							step="0.01"
							placeholder="250"
							value={price}
							onChange={(e) => setPrice(e.target.value)}
							className="pr-8"
						/>
						<span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground text-sm">
							€
						</span>
					</div>
				</div>

				<div className="space-y-1.5">
					<Label htmlFor="promoPrice" className="text-xs">
						Prix promo (€)
					</Label>
					<div className="relative">
						<Input
							id="promoPrice"
							type="number"
							min="0"
							step="0.01"
							placeholder="200"
							value={promoPrice}
							onChange={(e) => setPromoPrice(e.target.value)}
							className="pr-8"
						/>
						<span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground text-sm">
							€
						</span>
					</div>
				</div>
			</div>

			<Button
				type="button"
				onClick={handleSubmit}
				disabled={!isFormValid}
				className="w-full"
			>
				Ajouter
			</Button>
		</div>
	);
}
