export const formatPrice = (price: number, separator = " ") => {
	const formattedPrice = price
		.toString()
		.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
	return `${formattedPrice} Ar`;
};
