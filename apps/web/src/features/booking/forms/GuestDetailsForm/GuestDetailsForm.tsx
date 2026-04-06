import { forwardRef } from "react";
import { useIntlayer } from "react-intlayer";
import { Card, CardHeader, CardPanel, CardTitle } from "@/components/ui/card";
import type { GuestDetailsValues } from "./useGuestDetailsForm";
import { useGuestDetailsForm } from "./useGuestDetailsForm";

interface GuestDetailsFormProps {
	onSubmit: (values: GuestDetailsValues) => Promise<void>;
}

const GuestDetailsForm = forwardRef<HTMLFormElement, GuestDetailsFormProps>(
	function GuestDetailsForm({ onSubmit }, ref) {
		const t = useIntlayer("guest-details-form");
		const form = useGuestDetailsForm({ onSubmit });

		return (
			<Card>
				<CardHeader>
					<CardTitle>{t.title}</CardTitle>
				</CardHeader>
				<form
					ref={ref}
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						form.handleSubmit();
					}}
				>
					<CardPanel className="flex flex-col gap-4">
						<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
							<form.AppField
								name="firstName"
								validators={{
									onDynamic: ({ value }) => {
										if (!value || value.trim().length === 0) {
											return t.errors.firstNameRequired.value;
										}
										return undefined;
									},
								}}
							>
								{(field) => (
									<field.TextField
										label={t.firstName.value}
										inputProps={{ type: "text" }}
									/>
								)}
							</form.AppField>

							<form.AppField
								name="lastName"
								validators={{
									onDynamic: ({ value }) => {
										if (!value || value.trim().length === 0) {
											return t.errors.lastNameRequired.value;
										}
										return undefined;
									},
								}}
							>
								{(field) => (
									<field.TextField
										label={t.lastName.value}
										inputProps={{ type: "text" }}
									/>
								)}
							</form.AppField>
						</div>

						<form.AppField
							name="email"
							validators={{
								onDynamic: ({ value }) => {
									if (!value || value.trim().length === 0) {
										return t.errors.emailRequired.value;
									}
									if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
										return t.errors.emailInvalid.value;
									}
									return undefined;
								},
							}}
						>
							{(field) => (
								<field.TextField
									label={t.email.value}
									inputProps={{
										type: "email",
										placeholder: "john@example.com",
									}}
								/>
							)}
						</form.AppField>

						<p className="text-muted-foreground text-xs">{t.emailHelper}</p>

						<form.AppField
							name="phone"
							validators={{
								onDynamic: ({ value }) => {
									if (!value || value.trim().length === 0) {
										return t.errors.phoneRequired.value;
									}
									return undefined;
								},
							}}
						>
							{(field) => (
								<field.TextField
									label={t.phone.value}
									prefix={
										<span className="text-muted-foreground text-sm">+261</span>
									}
									inputProps={{ type: "tel" }}
								/>
							)}
						</form.AppField>

						<form.AppField name="specialRequests">
							{(field) => (
								<field.TextAreaField
									label={t.specialRequests.value}
									textareaProps={{
										placeholder: t.specialRequestsPlaceholder.value,
									}}
								/>
							)}
						</form.AppField>
					</CardPanel>
				</form>
			</Card>
		);
	},
);

export default GuestDetailsForm;
export type { GuestDetailsValues };
