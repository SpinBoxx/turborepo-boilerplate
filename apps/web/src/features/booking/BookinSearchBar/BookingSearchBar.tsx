import { Search } from "lucide-react";
import type { ComponentProps } from "react";
import CalendarWithComboBox from "@/components/calendar/CalendarWithComboBox";
import { Button } from "@/components/ui/button";
import { Card, CardPanel } from "@/components/ui/card";
import {
	NumberField,
	NumberFieldDecrement,
	NumberFieldGroup,
	NumberFieldIncrement,
	NumberFieldInput,
} from "@/components/ui/number-field";
import { cn } from "@/lib/utils";

interface Props extends ComponentProps<"div"> {}

export default function BookingSearchBar({ className, ...props }: Props) {
	return (
		<Card
			className={cn("flex flex-col sm:w-4/5 sm:flex-row", className)}
			{...props}
		>
			<CardPanel>
				<div className="flex flex-col gap-2 sm:w-full sm:flex-row">
					<div className="flex-1">
						<p className="font-semibold text-lg">Check-in</p>
						<CalendarWithComboBox
							placeholder="Arrival"
							triggerProps={{
								className: "!font-normal !text-base !text-muted-foreground",
								size: "xl",
							}}
						/>
					</div>
					<div className="flex-1">
						<p className="font-semibold text-lg">Check-out</p>
						<CalendarWithComboBox
							placeholder="Departure"
							triggerProps={{
								size: "xl",
								className: "!font-normal !text-base !text-muted-foreground",
							}}
						/>
					</div>
					<div className="flex-none font-no sm:w-32">
						<p className="font-semibold text-lg">Guests</p>
						<NumberField defaultValue={1} min={1} max={5} size="xl">
							<NumberFieldGroup>
								<NumberFieldDecrement />
								<NumberFieldInput />
								<NumberFieldIncrement />
							</NumberFieldGroup>
						</NumberField>
					</div>
					<Button className="mt-2 sm:mt-0 sm:self-end" size={"xl"}>
						<Search className="hidden text-white opacity-100 md:block md:size-6" />
						Search
					</Button>
				</div>
			</CardPanel>
		</Card>
	);
}
