"use client";

import {
	Field,
	SelectContent,
	SelectGroup,
	SelectItem,
	Select as SelectPrimitive,
	SelectTrigger,
	SelectValue,
} from "@zanadeal/ui";
import type { ReactElement } from "react";

interface IconPlaceholderProps {
	lucide: string;
	tabler: string;
	hugeicons: string;
	phosphor: string;
	remixicon: string;
	className?: string;
}

interface Item {
	label: string;
	value: string | null;
	icon?: ReactElement<IconPlaceholderProps>;
}

interface Props {
	items: Item[];
	placeholder: string;
}

export function Select({ items, placeholder }: Props) {
	return (
		<Field className="max-w-xs">
			<SelectPrimitive>
				<SelectTrigger className="w-[200px]">
					<SelectValue placeholder={placeholder} />
				</SelectTrigger>
				<SelectContent position="popper">
					<SelectGroup>
						{items.slice(1).map((item) => (
							<SelectItem key={item.value} value={item.value ?? ""}>
								{item.icon}
								{item.label}
							</SelectItem>
						))}
					</SelectGroup>
				</SelectContent>
			</SelectPrimitive>
		</Field>
	);
}
