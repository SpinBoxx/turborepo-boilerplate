"use client";

import type { CreateRoomPriceInput } from "@zanadeal/api/features/room/room.schemas";
import { Button, cn, Input, Label } from "@zanadeal/ui";
import { Pen, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import type { DateRange } from "react-day-picker";
import DateRangePicker from "./DateRangePicker";

interface RoomPricePeriodFormProps {
	onAddPeriod: (period: CreateRoomPriceInput) => void;
	onEditPeriod?: (period: CreateRoomPriceInput) => void;
	editingPeriod?: CreateRoomPriceInput | null;
	onCancelEdit?: () => void;
	className?: string;
	prices: CreateRoomPriceInput[];
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
	const [price, setPrice] = useState<string>("");
	const [promoPrice, setPromoPrice] = useState<string>("");

	const isEditing = !!editingPeriod;

	useEffect(() => {
		if (editingPeriod) {
			setDateRange({
				from: editingPeriod.startDate,
				to: editingPeriod.endDate ?? undefined,
			});
			setPrice(String(editingPeriod.price));
			setPromoPrice(
				editingPeriod.promoPrice > 0 ? String(editingPeriod.promoPrice) : "",
			);
		}
	}, [editingPeriod]);

	const handleSubmit = () => {
		if (!dateRange?.from || !price) {
			return;
		}

		const periodData: CreateRoomPriceInput = {
			price: Number.parseFloat(price),
			promoPrice: promoPrice ? Number.parseFloat(promoPrice) : 0,
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
		setPrice("");
		setPromoPrice("");
	};

	const handleCancel = () => {
		setDateRange(undefined);
		setPrice("");
		setPromoPrice("");
		onCancelEdit?.();
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
