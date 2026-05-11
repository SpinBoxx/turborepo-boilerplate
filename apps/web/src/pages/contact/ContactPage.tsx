import { useIntlayer } from "react-intlayer";
import { ContactForm } from "@/features/contact";

export default function ContactPage() {
	const t = useIntlayer("contact-page");

	return (
		<div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-10 sm:px-6 lg:py-14">
			<div className="space-y-3">
				<div className="space-y-2">
					<h1 className="font-semibold text-3xl tracking-normal sm:text-4xl">
						{t.title.value}
					</h1>
					<p className="max-w-2xl text-muted-foreground">
						{t.description.value}
					</p>
				</div>
			</div>

			<ContactForm />
		</div>
	);
}
