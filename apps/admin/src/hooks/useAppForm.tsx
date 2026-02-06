import { createFormHook } from "@tanstack/react-form";
import { FormSubmitButton } from "@/components/formComponents/FormSubmitButton";
import {
	PasswordField,
	Select,
	Switch,
	SwitchContainer,
	TextArea,
	TextField,
} from "../components/formComponents/FormComponents";
import { fieldContext, formContext } from "./useFormContext";

export const { useAppForm, withForm, withFieldGroup } = createFormHook({
	fieldComponents: {
		TextField,
		Select,
		TextArea,
		Switch,
		SwitchContainer,
		PasswordField,
	},
	formComponents: {
		SubmitButton: FormSubmitButton,
	},
	fieldContext,
	formContext,
});
