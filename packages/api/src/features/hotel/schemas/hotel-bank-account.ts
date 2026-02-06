import z from "zod";

export const UpsertBankAccountInputSchema = z.object({
	iban: z.string().min(1),
	bic: z.string().min(1),
	bankName: z.string().min(1),
	accountHolderName: z.string().min(1),
});

export const BankAccountSchema = z.object({
	id: z.string().min(1),
	iban: z.string().min(1),
	bic: z.string().min(1),
	bankName: z.string().min(1),
	accountHolderName: z.string().min(1),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export type BankAccount = z.infer<typeof BankAccountSchema>;
export type UpsertBankAccountInput = z.infer<
	typeof UpsertBankAccountInputSchema
>;
