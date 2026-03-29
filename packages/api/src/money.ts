export const MONEY_STORAGE_SCALE = 100;

export function toStoredMoneyAmount(amount: number): number {
	return Math.round(amount * MONEY_STORAGE_SCALE);
}

export function fromStoredMoneyAmount(amount: number): number {
	return amount / MONEY_STORAGE_SCALE;
}