import prisma from "@zanadeal/db";
import type { Prisma } from "../../../../db/prisma/generated/client";

export type PaymentAttemptCreateInput = Prisma.PaymentAttemptCreateInput;
export type PaymentAttemptUpdateInput = Prisma.PaymentAttemptUpdateInput;
type PaymentStoreClient = typeof prisma | Prisma.TransactionClient;
const paymentAttemptStatusInclude = {
	quote: {
		select: {
			id: true,
			userId: true,
		},
	},
} satisfies Prisma.PaymentAttemptInclude;

export type PaymentAttemptStatusDB = Prisma.PaymentAttemptGetPayload<{
	include: typeof paymentAttemptStatusInclude;
}>;

export async function createPaymentAttemptInDb(
	data: PaymentAttemptCreateInput,
	client: PaymentStoreClient = prisma,
) {
	return await client.paymentAttempt.create({ data });
}

export async function updatePaymentAttemptInDb(
	id: string,
	data: PaymentAttemptUpdateInput,
	client: PaymentStoreClient = prisma,
) {
	return await client.paymentAttempt.update({
		where: { id },
		data,
	});
}

export async function getPaymentAttemptById(
	id: string,
	client: PaymentStoreClient = prisma,
): Promise<PaymentAttemptStatusDB | null> {
	return await client.paymentAttempt.findUnique({
		where: { id },
		include: paymentAttemptStatusInclude,
	});
}