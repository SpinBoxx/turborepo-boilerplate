type RangePrice = {
	price: number;
	startDate: Date;
	endDate: Date | null;
};

export type NightBreakdownItem = {
	date: Date;
	price: number;
};

export const getNightlyBreakdown = (
	prices: RangePrice[],
	startDate: Date,
	endDate: Date,
): NightBreakdownItem[] => {
	const dayInMs = 24 * 60 * 60 * 1000;
	const totalNights = Math.round(
		(endDate.getTime() - startDate.getTime()) / dayInMs,
	);
	const breakdown: NightBreakdownItem[] = [];

	for (let i = 0; i < totalNights; i++) {
		const currentDate = new Date(startDate.getTime() + i * dayInMs);
		const priceForCurrentDate = prices.find(
			(price) =>
				currentDate >= price.startDate &&
				(!price.endDate || currentDate <= price.endDate),
		);
		breakdown.push({
			date: currentDate,
			price: priceForCurrentDate?.price ?? 0,
		});
	}

	return breakdown;
};

export const getTotalPriceByRange = (
	prices: RangePrice[],
	startDate: Date,
	endDate: Date,
) => {
	const breakdown = getNightlyBreakdown(prices, startDate, endDate);
	return breakdown.reduce((sum, item) => sum + item.price, 0);
};

export const getPercentage = (percentage: number) => {
	return percentage / 100;
};

export const getValueWithPercentage = (value: number, percentage: number) => {
	return value + (value * getPercentage(percentage)) / 100;
};
