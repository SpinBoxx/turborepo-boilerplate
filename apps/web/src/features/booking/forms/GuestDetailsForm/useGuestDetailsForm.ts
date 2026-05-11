import { revalidateLogic } from "@tanstack/react-form";
import { useAppForm } from "@/hooks/useAppForm";

export interface GuestDetailsValues {
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	specialRequests: string;
}

interface UseGuestDetailsFormOptions {
	onSubmit: (values: GuestDetailsValues) => Promise<void>;
}

export function useGuestDetailsForm({ onSubmit }: UseGuestDetailsFormOptions) {
	return useAppForm({
		defaultValues: {
			firstName: "",
			lastName: "",
			email: "",
			phone: "",
			specialRequests: "",
		} satisfies GuestDetailsValues,
		validationLogic: revalidateLogic(),
		onSubmit: async ({ value }) => {
			await onSubmit(value);
		},
	});
}
