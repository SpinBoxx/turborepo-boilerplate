import { createFileRoute } from "@tanstack/react-router";
import TermsPage from "@/features/terms/TermsPage/TermsPage";

export const Route = createFileRoute("/dashboard/terms/")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div>
			<TermsPage />
		</div>
	);
}
