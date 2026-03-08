import { Input } from "@zanadeal/ui";
import { Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDebounceValue } from "usehooks-ts";

interface Props {
	placeholder?: string;
	debounceMs?: number;
	onSearch: (value: string) => void;
}

export default function SearchFilter({
	placeholder = "Rechercher...",
	debounceMs = 300,
	onSearch,
}: Props) {
	const inputRef = useRef<HTMLInputElement>(null);
	const [value, setValue] = useState("");
	const [debouncedValue] = useDebounceValue(value, debounceMs);

	useEffect(() => {
		onSearch(debouncedValue);
	}, [debouncedValue, onSearch]);

	const handleClear = () => {
		setValue("");
		inputRef.current?.focus();
	};

	return (
		<div className="relative w-full sm:max-w-xs">
			<Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
			<Input
				ref={inputRef}
				placeholder={placeholder}
				value={value}
				onChange={(e) => setValue(e.target.value)}
				className="pr-8 pl-9"
			/>
			{value && (
				<button
					type="button"
					onClick={handleClear}
					className="absolute top-1/2 right-2.5 -translate-y-1/2 text-muted-foreground hover:text-foreground"
				>
					<X className="size-4" />
					<span className="sr-only">Effacer la recherche</span>
				</button>
			)}
		</div>
	);
}
