import type { ReviewBookingRequestInput } from "@zanadeal/api/features/payment";
import { orpc } from "@/lib/orpc";

export async function reviewBookingRequest(input: ReviewBookingRequestInput) {
	return await orpc.payment.reviewBookingRequest(input);
}