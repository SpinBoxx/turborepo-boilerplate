import { Prisma } from "../../../../db/prisma/generated/client";
import { describe, expect, it } from "vitest";
import {
	getCallbackPayloadRecord,
	toPrismaJsonPropertyValue,
	toPrismaJsonValue,
} from "./payment-json.service";

describe("payment-json.service", () => {
	it("normalizes callback payload values to plain records", () => {
		expect(getCallbackPayloadRecord(null)).toEqual({});
		expect(getCallbackPayloadRecord(["a"]) ).toEqual({});
		expect(getCallbackPayloadRecord("foo")).toEqual({});
		expect(getCallbackPayloadRecord({ sentAt: "2026-04-16" })).toEqual({
			sentAt: "2026-04-16",
		});
	});

	it("preserves null and undefined semantics for Prisma json values", () => {
		expect(toPrismaJsonValue(undefined)).toBeUndefined();
		expect(toPrismaJsonValue(null)).toBe(Prisma.JsonNull);
		expect(toPrismaJsonValue({ foo: "bar" })).toEqual({ foo: "bar" });
	});

	it("serializes nested details for Prisma json properties", () => {
		expect(toPrismaJsonPropertyValue(undefined)).toBeUndefined();
		expect(toPrismaJsonPropertyValue(null)).toBeNull();
		expect(toPrismaJsonPropertyValue({ code: "amount_too_small" })).toEqual({
			code: "amount_too_small",
		});
	});
});
