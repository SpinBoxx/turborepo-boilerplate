import { describe, expect, it } from "vitest";
import {
	getCooldownEndsAt,
	getRemainingCooldownSeconds,
	readStoredCooldownRemainingSeconds,
} from "./useStoredCooldown";

class MemoryStorage implements Storage {
	private readonly values = new Map<string, string>();

	get length() {
		return this.values.size;
	}

	clear() {
		this.values.clear();
	}

	getItem(key: string) {
		return this.values.get(key) ?? null;
	}

	key(index: number) {
		return Array.from(this.values.keys())[index] ?? null;
	}

	removeItem(key: string) {
		this.values.delete(key);
	}

	setItem(key: string, value: string) {
		this.values.set(key, value);
	}
}

describe("stored cooldown helpers", () => {
	it("builds a cooldown end timestamp from a duration in seconds", () => {
		expect(getCooldownEndsAt(1000, 60)).toBe(61000);
	});

	it("rounds the remaining cooldown up to the next second", () => {
		expect(getRemainingCooldownSeconds(10_001, 1000)).toBe(10);
		expect(getRemainingCooldownSeconds(10_000, 1000)).toBe(9);
	});

	it("reads the remaining cooldown from storage", () => {
		const storage = new MemoryStorage();
		storage.setItem("email-cooldown", "61000");

		expect(
			readStoredCooldownRemainingSeconds({
				storage,
				storageKey: "email-cooldown",
				nowMs: 1000,
			}),
		).toBe(60);
	});

	it("clears expired cooldown values", () => {
		const storage = new MemoryStorage();
		storage.setItem("email-cooldown", "1000");

		expect(
			readStoredCooldownRemainingSeconds({
				storage,
				storageKey: "email-cooldown",
				nowMs: 2000,
			}),
		).toBe(0);
		expect(storage.getItem("email-cooldown")).toBeNull();
	});

	it("clears invalid cooldown values", () => {
		const storage = new MemoryStorage();
		storage.setItem("email-cooldown", "soon");

		expect(
			readStoredCooldownRemainingSeconds({
				storage,
				storageKey: "email-cooldown",
				nowMs: 1000,
			}),
		).toBe(0);
		expect(storage.getItem("email-cooldown")).toBeNull();
	});
});
