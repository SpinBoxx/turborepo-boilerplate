"use client";

import type { UpsertRoomPriceInput } from "@zanadeal/api/features/room";
import { Button, cn } from "@zanadeal/ui";
import { Pen, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import type { DateRange } from "react-day-picker";
import PriceInput from "@/features/currency/PriceInput";
import DateRangePicker from "./DateRangePicker";

interface RoomPricePeriodFormProps {
	onAddPeriod: (period: UpsertRoomPriceInput) => void;
	onEditPeriod?: (period: UpsertRoomPriceInput) => void;
	editingPeriod?: UpsertRoomPriceInput | null;
	onCancelEdit?: () => void;
	className?: string;
	prices: UpsertRoomPriceInput[];
}

export default function RoomPricePeriodForm({
	prices,
	onAddPeriod,
	onEditPeriod,
	editingPeriod,
	onCancelEdit,
	className,
}: RoomPricePeriodFormProps) {
	const [dateRange, setDateRange] = useState<DateRange | undefined>();
	const [price, setPrice] = useState<number | null>(null);
	const [promoPrice, setPromoPrice] = useState<number | null>(null);

	const isEditing = !!editingPeriod;

	useEffect(() => {
		if (editingPeriod) {
			setDateRange({
				from: editingPeriod.startDate,
				to: editingPeriod.endDate ?? undefined,
			});
			setPrice(editingPeriod.price);
			setPromoPrice(editingPeriod.promoPrice > 0 ? editingPeriod.promoPrice : null);
		}
	}, [editingPeriod]);

	const handleSubmit = () => {
		if (!dateRange?.from || !price) {
			return;
		}

		const periodData: UpsertRoomPriceInput = {
			price,
			promoPrice: promoPrice ?? 0,
			startDate: dateRange.from,
			endDate: dateRange.to ?? null,
		};

		if (isEditing && onEditPeriod) {
			onEditPeriod(periodData);
		} else {
			onAddPeriod(periodData);
		}

		// Reset form
		setDateRange(undefined);
		setPrice(null);
		setPromoPrice(null);
	};

	const handleCancel = () => {
		setDateRange(undefined);
		setPrice(null);
		setPromoPrice(null);
		onCancelEdit?.();
	};

	const hasValidPromoPrice =
		promoPrice === null || (promoPrice >= 0 && price !== null && promoPrice < price);
	const isFormValid = !!dateRange?.from && price !== null && price > 0 && hasValidPromoPrice;

	return (
		<div
			className={cn(
				"space-y-4 rounded-lg border border-muted-foreground/30 border-dashed p-4",
				className,
			)}
		>
			<div className="flex items-center gap-2 text-muted-foreground">
				{isEditing ? <Pen className="size-4" /> : <Plus className="size-4" />}
				<span className="font-medium text-sm">
					{isEditing ? "Modifier la période" : "Ajouter une période"}
				</span>
			</div>

			<DateRangePicker
				dateRange={dateRange}
				onDateRangeChange={setDateRange}
				prices={prices}
			/>

			<div className="grid gap-4 md:grid-cols-2">
				<PriceInput
					id="price"
					label="Prix"
					value={price}
					onValueChange={setPrice}
				/>

				<PriceInput
					id="promoPrice"
					label="Prix promo"
					value={promoPrice}
					onValueChange={setPromoPrice}
					aria-invalid={!hasValidPromoPrice}
				/>
			</div>

			<div className="flex gap-2">
				{isEditing && (
					<Button
						type="button"
						variant="outline"
						onClick={handleCancel}
						className="w-1/2"
					>
						Annuler
					</Button>
				)}
				<Button
					type="button"
					onClick={handleSubmit}
					disabled={!isFormValid}
					className={cn(isEditing ? "w-1/2" : "w-full")}
				>
					{isEditing ? "Modifier" : "Ajouter"}
				</Button>
			</div>
		</div>
	);
}
