import { Input, SidebarTrigger } from "@zanadeal/ui";
import { useEffect, useState } from "react";
import { useIsMobile } from "../../../../../packages/ui/src/hooks/use-mobile";

export default function SidebarNavbar() {
	const [now, setNow] = useState(() => new Date());

	useEffect(() => {
		const id = setInterval(() => {
			setNow(new Date());
		}, 1000);

		return () => clearInterval(id);
	}, []);

	const isMobile = useIsMobile();

	return (
		<div className="flex items-center justify-between gap-3 md:gap-0">
			{isMobile && <SidebarTrigger />}
			<Input placeholder="Rechercher" className="md:w-1/4" />
			<div className="flex flex-col text-muted-foreground">
				<span className="font-semibold text-sm md:text-lg">
					{now.toLocaleTimeString()}
				</span>
				<span className="font-light text-xs md:text-base">
					{now.toLocaleDateString()}
				</span>
			</div>
		</div>
	);
}
