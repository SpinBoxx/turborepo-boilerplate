import type {
	GetPaymentStatusInput,
	StartPaymentInput,
} from "@zanadeal/api/features/payment";
import { orpc } from "@/lib/orpc";

export async function startPayment(input: StartPaymentInput) {
	return await orpc.payment.start(input);
}

export async function getPaymentStatus(input: GetPaymentStatusInput) {
	return await orpc.payment.getStatus(input);
}