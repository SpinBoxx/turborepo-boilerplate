import { createFormHook } from "@tanstack/react-form";

import {
	PasswordField,
	Select,
	SubscribeButton,
	Switch,
	SwitchContainer,
	TextArea,
	TextField,
} from "../components/formComponents/FormComponents";
import { fieldContext, formContext } from "./useFormContext";

export const { useAppForm } = createFormHook({
	fieldComponents: {
		TextField,
		Select,
		TextArea,
		Switch,
		SwitchContainer,
		PasswordField,
	},
	formComponents: {
		SubscribeButton,
	},
	fieldContext,
	formContext,
});
