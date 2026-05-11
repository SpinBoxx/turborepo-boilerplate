import { Prisma } from "../../../../db/prisma/generated/client";

export function getCallbackPayloadRecord(
	callbackPayload: unknown,
): Record<string, unknown> {
	if (
		!callbackPayload ||
		typeof callbackPayload !== "object" ||
		Array.isArray(callbackPayload)
	) {
		return {};
	}

	return callbackPayload as Record<string, unknown>;
}

export function toPrismaJsonValue(
	value: unknown,
): Prisma.InputJsonValue | Prisma.NullableJsonNullValueInput | undefined {
	if (value === undefined) {
		return undefined;
	}

	if (value === null) {
		return Prisma.JsonNull;
	}

	try {
		return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
	} catch {
		return String(value);
	}
}

export function toPrismaJsonPropertyValue(
	value: unknown,
): Prisma.InputJsonValue | null | undefined {
	if (value === undefined) {
		return undefined;
	}

	if (value === null) {
		return null;
	}

	try {
		return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
	} catch {
		return String(value);
	}
}