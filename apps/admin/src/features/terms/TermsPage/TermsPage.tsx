import { Link } from "@tanstack/react-router";
import { Button } from "@zanadeal/ui";
import { EmptyTerms } from "../components/EmptyTerms";
import TermCard from "../components/TermCard";
import { useListTerms } from "../terms.queries";

const TermsPage = () => {
	const terms = useListTerms({
		orderBy: {
			version: "desc",
		},
	});

	if (!terms.data?.length) {
		return <EmptyTerms />;
	}

	return (
		<div className="flex flex-col gap-4">
			<Link to="/dashboard/terms/create-term">
				<Button>Créer une condition générale</Button>
			</Link>
			<div className="grid grid-cols-2 gap-5 md:grid-cols-3 xl:grid-cols-4">
				{terms.data.map((term) => (
					<TermCard key={term.id} term={term} />
				))}
			</div>
		</div>
	);
};

export default TermsPage;
