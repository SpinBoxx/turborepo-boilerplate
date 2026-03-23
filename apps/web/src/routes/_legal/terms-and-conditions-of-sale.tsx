import { createFileRoute } from "@tanstack/react-router";

import TermsAndConditionsOfSalePage from "@/features/terms/pages/TermsAndConditionsOfSale/TermsAndConditionsOfSalePage";
import { listTerms } from "@/features/terms/terms.api";

export const Route = createFileRoute("/_legal/terms-and-conditions-of-sale")({
	component: RouteComponent,
	loader: async () => {
		const term = await listTerms({
			filters: {
				type: {
					equal: "CGV",
				},
			},
			sort: {
				field: "version",
				direction: "desc",
			},
			page: 1,
			skip: 0,
			take: 1,
			limit: 1,
		});

		return { term };
	},
});

function RouteComponent() {
	const { term } = Route.useLoaderData();
	return <TermsAndConditionsOfSalePage term={term} />;
}
