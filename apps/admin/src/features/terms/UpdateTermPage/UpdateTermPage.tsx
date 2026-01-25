import { redirect } from "@tanstack/react-router";
import {
	EditorContext,
	EditorProvider,
} from "@/components/editor/EditorProvider";
import UpsertTermForm from "../forms/UpsertTermForm";
import { useTerm } from "../terms.queries";

interface Props {
	termId: string;
}

const UpdateTermPage = ({ termId }: Props) => {
	const { isFetching, data } = useTerm(termId);

	if (!isFetching && !data) redirect({ to: "/dashboard/terms" });

	return (
		<div>
			<EditorProvider>
				<div className="flex gap-6">
					<UpsertTermForm term={data} className="w-1/2 2xl:w-1/3" />
					<div className="w-1/2 2xl:w-2/3">
						<EditorContext.Consumer>
							{(ctx) => (
								<div
									// biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
									dangerouslySetInnerHTML={{
										// biome-ignore lint/suspicious/noNonNullAssertedOptionalChain: <explanation>
										__html: ctx?.inlineCss()!,
									}}
								/>
							)}
						</EditorContext.Consumer>
					</div>
				</div>
			</EditorProvider>
		</div>
	);
};

export default UpdateTermPage;
