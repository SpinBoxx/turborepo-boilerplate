import { Input, SidebarTrigger } from "@zanadeal/ui";

import { useIsMobile } from "../../../../../packages/ui/src/hooks/use-mobile";

export default function SidebarNavbar() {
	const isMobile = useIsMobile();

	return (
		<div className="flex items-center justify-between gap-3 md:gap-0">
			{isMobile && <SidebarTrigger />}
			<Input placeholder="Rechercher" className="md:w-1/4" />
		</div>
	);
}
