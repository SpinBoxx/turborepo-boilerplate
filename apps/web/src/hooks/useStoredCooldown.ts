import { useCallback, useEffect, useState } from "react";

const DEFAULT_INTERVAL_MS = 1000;

type UseStoredCooldownOptions = {
	storageKey: string;
	durationSeconds: number;
	intervalMs?: number;
	storage?: Storage | null;
};

type ReadStoredCooldownOptions = {
	storage: Storage | null;
	storageKey: string;
	nowMs?: number;
};

function resolveStorage(storage?: Storage | null) {
	if (storage !== undefined) return storage;
	if (typeof window === "undefined") return null;
	return window.localStorage;
}

function removeStoredCooldown(storage: Storage, storageKey: string) {
	try {
		storage.removeItem(storageKey);
	} catch {
		// Storage can be unavailable in private or restricted browser contexts.
	}
}

export function getCooldownEndsAt(nowMs: number, durationSeconds: number) {
	return nowMs + Math.max(0, durationSeconds) * 1000;
}

export function getRemainingCooldownSeconds(
	cooldownEndsAtMs: number,
	nowMs = Date.now(),
) {
	return Math.max(0, Math.ceil((cooldownEndsAtMs - nowMs) / 1000));
}

export function readStoredCooldownRemainingSeconds({
	storage,
	storageKey,
	nowMs = Date.now(),
}: ReadStoredCooldownOptions) {
	if (!storage) return 0;

	let storedValue: string | null = null;
	try {
		storedValue = storage.getItem(storageKey);
	} catch {
		return 0;
	}

	if (!storedValue) return 0;

	const cooldownEndsAtMs = Number(storedValue);
	if (!Number.isFinite(cooldownEndsAtMs)) {
		removeStoredCooldown(storage, storageKey);
		return 0;
	}

	const remainingSeconds = getRemainingCooldownSeconds(cooldownEndsAtMs, nowMs);
	if (remainingSeconds <= 0) {
		removeStoredCooldown(storage, storageKey);
	}

	return remainingSeconds;
}

export function useStoredCooldown({
	storageKey,
	durationSeconds,
	intervalMs = DEFAULT_INTERVAL_MS,
	storage,
}: UseStoredCooldownOptions) {
	const readRemainingSeconds = useCallback(() => {
		return readStoredCooldownRemainingSeconds({
			storage: resolveStorage(storage),
			storageKey,
		});
	}, [storage, storageKey]);

	const [remainingSeconds, setRemainingSeconds] =
		useState(readRemainingSeconds);

	useEffect(() => {
		setRemainingSeconds(readRemainingSeconds());
	}, [readRemainingSeconds]);

	useEffect(() => {
		if (remainingSeconds <= 0) return;

		const intervalId = setInterval(() => {
			setRemainingSeconds(readRemainingSeconds());
		}, intervalMs);

		return () => clearInterval(intervalId);
	}, [intervalMs, readRemainingSeconds, remainingSeconds]);

	useEffect(() => {
		if (typeof window === "undefined") return;

		const handleStorage = (event: StorageEvent) => {
			if (event.key === storageKey) {
				setRemainingSeconds(readRemainingSeconds());
			}
		};

		window.addEventListener("storage", handleStorage);
		return () => window.removeEventListener("storage", handleStorage);
	}, [readRemainingSeconds, storageKey]);

	const startCooldown = useCallback(() => {
		const cooldownStorage = resolveStorage(storage);
		const cooldownEndsAtMs = getCooldownEndsAt(Date.now(), durationSeconds);

		if (cooldownStorage) {
			try {
				cooldownStorage.setItem(storageKey, String(cooldownEndsAtMs));
			} catch {
				// The in-memory countdown still works when persistent storage is blocked.
			}
		}

		setRemainingSeconds(getRemainingCooldownSeconds(cooldownEndsAtMs));
	}, [durationSeconds, storage, storageKey]);

	const clearCooldown = useCallback(() => {
		const cooldownStorage = resolveStorage(storage);
		if (cooldownStorage) removeStoredCooldown(cooldownStorage, storageKey);
		setRemainingSeconds(0);
	}, [storage, storageKey]);

	return {
		remainingSeconds,
		isCoolingDown: remainingSeconds > 0,
		startCooldown,
		clearCooldown,
	};
}
