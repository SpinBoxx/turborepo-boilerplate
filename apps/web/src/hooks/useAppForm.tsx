import { createFormHook } from "@tanstack/react-form";
import { FormSubmitButton } from "@/components/formComponents/FormSubmitButton";
import { PasswordField } from "@/components/formComponents/PasswordField";
import { SelectField } from "@/components/formComponents/SelectField";
import { SwitchField } from "@/components/formComponents/SwitchField";
import { TextAreaField } from "@/components/formComponents/TextAreaField";
import { TextField } from "@/components/formComponents/TextField";
import { fieldContext, formContext } from "./useFormContext";

export const { useAppForm, withForm, withFieldGroup } = createFormHook({
	fieldComponents: {
		TextField,
		SelectField,
		TextAreaField,
		SwitchField,
		PasswordField,
	},
	formComponents: {
		SubmitButton: FormSubmitButton,
	},
	fieldContext,
	formContext,
});
