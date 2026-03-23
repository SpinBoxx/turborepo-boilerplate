import { Link } from "@tanstack/react-router";
import type { TermsComputed } from "@zanadeal/api/features/terms";
import { cn } from "@zanadeal/ui";
import { getTranslation } from "intlayer";
import { FileText } from "lucide-react";
import { useIntlayer, useIntlayerContext } from "react-intlayer";
import EmptySimple from "@/components/empty/EmptySimple";
import { Button } from "@/components/ui/button";

interface Props {
	className?: string;
	term?: TermsComputed | null;
}

export default function TermsAndConditionsOfSalePage({
	className,
	term,
}: Props) {
	const t = useIntlayer("terms-and-conditions-of-sale-page");
	const { locale } = useIntlayerContext();

	if (!term) {
		return (
			<EmptySimple
				icon={<FileText />}
				title={t.notFoundTitle.value}
				description={t.notFoundDescription.value}
				className={cn("", className)}
			>
				<Link to={"/"}>
					<Button>{t.returnHome.value}</Button>
				</Link>
			</EmptySimple>
		);
	}

	return (
		<div>
			<div
				// biome-ignore lint/security/noDangerouslySetInnerHtml: This is safe because the content is sanitized before being stored in the database.
				dangerouslySetInnerHTML={{
					__html: getTranslation(term.translations, locale)?.content || "",
				}}
			/>
		</div>
	);
}
