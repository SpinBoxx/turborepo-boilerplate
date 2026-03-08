import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@zanadeal/ui";

export interface SortOption {
	label: string;
	value: string;
}

interface Props {
	options: SortOption[];
	value: string;
	onChange: (value: string) => void;
}

export default function SortSelect({ options, value, onChange }: Props) {
	return (
		<Select value={value} onValueChange={onChange}>
			<SelectTrigger className="w-[180px]">
				<SelectValue placeholder="Trier par..." />
			</SelectTrigger>
			<SelectContent>
				{options.map((option) => (
					<SelectItem key={option.value} value={option.value}>
						{option.label}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
