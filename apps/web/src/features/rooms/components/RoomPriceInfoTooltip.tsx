import type { PropsWithChildren } from "react";
import { Tooltip, TooltipPopup, TooltipTrigger } from "@/components/ui/tooltip";

export default function RoomPriceInfoTooltip({ children }: PropsWithChildren) {
	return (
		<Tooltip>
			<TooltipTrigger delay={0}>{children}</TooltipTrigger>
			<TooltipPopup>Voir le detail du prix pour chaque nuit.</TooltipPopup>
		</Tooltip>
	);
}
