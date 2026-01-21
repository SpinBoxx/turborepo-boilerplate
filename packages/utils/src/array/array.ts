export type SplitByKeyResult<T> = {
	in: T[];
	out: T[];
};

export function splitByKey<T extends Record<string, unknown>>(
	newItems: T[],
	currItems: T[],
	key: keyof T & string,
): SplitByKeyResult<T> {
	const currKeys = new Set<PropertyKey>();
	for (const item of currItems) {
		currKeys.add(item[key] as PropertyKey);
	}

	const inItems: T[] = [];
	const outItems: T[] = [];

	for (const item of newItems) {
		const value = item[key] as PropertyKey;
		if (currKeys.has(value)) {
			inItems.push(item);
		} else {
			outItems.push(item);
		}
	}

	return {
		in: inItems,
		out: outItems,
	};
}
