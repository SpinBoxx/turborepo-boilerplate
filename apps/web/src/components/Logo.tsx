import type { ComponentProps } from "react";
import { useIntlayer } from "react-intlayer";

export default function Logo({ className, ...props }: ComponentProps<"svg">) {
	const t = useIntlayer("common");
	return (
		<div className="flex items-start gap-0.5">
			<img src="/logo.png" alt={t.logo.value} className="size-6" />
			<span className="-translate-y-[1px] font-bold text-2xl text-[#844b9b]">
				anadeal
			</span>
		</div>
	);
}
