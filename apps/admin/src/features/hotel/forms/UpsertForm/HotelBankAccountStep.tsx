import { withForm } from "@/hooks/useAppForm";
import { HOTEL_UPSERT_DEFAULT_VALUES } from "./hotelUpsertForm.defaults";

const HotelBankAccountStep = withForm({
	defaultValues: HOTEL_UPSERT_DEFAULT_VALUES,

	render: function Render({ form }) {
		return (
			<div className="w-full space-y-4">
				<form.AppField name="bankAccount.accountHolderName">
					{(field) => (
						<field.TextField
							label="Titulaire du compte"
							inputProps={{ placeholder: "Société Hôtelière du Grand Palais" }}
						/>
					)}
				</form.AppField>
				<form.AppField name="bankAccount.bankName">
					{(field) => (
						<field.TextField
							label="Nom de la banque"
							inputProps={{ placeholder: "BNP Paribas" }}
						/>
					)}
				</form.AppField>
				<form.AppField name="bankAccount.iban">
					{(field) => (
						<field.TextField
							label="IBAN"
							inputProps={{ placeholder: "FR76 1234 5678 9012 3456 7890 123" }}
						/>
					)}
				</form.AppField>
				<form.AppField name="bankAccount.bic">
					{(field) => (
						<field.TextField
							label="BIC / SWIFT"
							inputProps={{ placeholder: "BNPAFRPP" }}
						/>
					)}
				</form.AppField>
			</div>
		);
	},
});

export default HotelBankAccountStep;
