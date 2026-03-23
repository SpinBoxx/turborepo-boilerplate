import { createFileRoute } from "@tanstack/react-router";
import TermsOfServicePage from "@/features/terms/pages/termsOfService/TermsOfServicePage";
import { listTerms } from "@/features/terms/terms.api";

export const Route = createFileRoute("/_legal/terms-of-service")({
	component: RouteComponent,
	loader: async () => {
		const term = await listTerms({
			filters: {
				type: {
					equal: "CGU",
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

	return <TermsOfServicePage term={term} />;
}
