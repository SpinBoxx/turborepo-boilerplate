const BYTES_PER_MB = 1024 * 1024;

export function getErrorMessage(
	error: unknown,
	fallback = "Unknown error",
): string {
	if (error instanceof Error && error.message) {
		return error.message;
	}
	return fallback;
}

export function toMegabytes(bytes: number): number {
	return Math.round(bytes / BYTES_PER_MB);
}

export function assertNonEmptyString(value: string, fieldName: string): void {
	if (!value.trim()) {
		throw new Error(`${fieldName} is required`);
	}
}
