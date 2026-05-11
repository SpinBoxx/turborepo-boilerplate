import { MailCheck } from "lucide-react";
import { useIntlayer } from "react-intlayer";
import { Card, CardHeader, CardPanel, CardTitle } from "@/components/ui/card";
import { useContactForm } from "./useContactForm";

export function ContactForm() {
	const t = useIntlayer("contact-form");
	const { form, validators, isAuthenticated, identityName, identityEmail } =
		useContactForm();

	return (
		<Card>
			<CardHeader className="space-y-2">
				<CardTitle>{t.title.value}</CardTitle>
				<p className="text-muted-foreground text-sm">{t.description.value}</p>
			</CardHeader>
			<form
				onSubmit={(event) => {
					event.preventDefault();
					event.stopPropagation();
					form.handleSubmit();
				}}
			>
				<CardPanel className="flex flex-col gap-4">
					{isAuthenticated ? (
						<div className="rounded-md border bg-muted/30 p-4">
							<div className="flex items-start gap-3">
								<MailCheck className="mt-0.5 size-4 text-primary" />
								<div className="min-w-0 space-y-1">
									<p className="font-medium text-sm">{t.identityTitle.value}</p>
									<p className="text-muted-foreground text-sm">
										{identityName} · {identityEmail}
									</p>
									<p className="text-muted-foreground text-xs">
										{t.identityDescription.value}
									</p>
								</div>
							</div>
						</div>
					) : (
						<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
							<form.AppField name="name" validators={validators.name}>
								{(field) => (
									<field.TextField
										label={t.name.value}
										inputProps={{ autoComplete: "name", type: "text" }}
									/>
								)}
							</form.AppField>

							<form.AppField name="email" validators={validators.email}>
								{(field) => (
									<field.TextField
										label={t.email.value}
										inputProps={{
											autoComplete: "email",
											placeholder: "john@example.com",
											type: "email",
										}}
									/>
								)}
							</form.AppField>
						</div>
					)}

					<form.AppField name="subject" validators={validators.subject}>
						{(field) => (
							<field.TextField
								label={t.subject.value}
								inputProps={{
									autoComplete: "off",
									maxLength: 160,
									placeholder: t.subjectPlaceholder.value,
									type: "text",
								}}
							/>
						)}
					</form.AppField>

					<form.AppField name="message" validators={validators.message}>
						{(field) => (
							<field.TextAreaField
								label={t.message.value}
								textareaProps={{
									maxLength: 4000,
									placeholder: t.messagePlaceholder.value,
									rows: 7,
								}}
							/>
						)}
					</form.AppField>

					<form.Field name="website">
						{(field) => (
							<input
								tabIndex={-1}
								aria-hidden="true"
								autoComplete="off"
								className="sr-only"
								name={field.name}
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(event) => field.handleChange(event.target.value)}
								type="text"
							/>
						)}
					</form.Field>

					<form.AppForm>
						<form.SubmitButton
							className="w-full sm:w-fit"
							loadingLabel={t.submitting.value}
							variants={{ variant: "default" }}
						>
							{t.submit.value}
						</form.SubmitButton>
					</form.AppForm>
				</CardPanel>
			</form>
		</Card>
	);
}
