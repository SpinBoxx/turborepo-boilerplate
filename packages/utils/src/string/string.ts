import { v4 as uuidv4 } from "uuid";
export const createUuid = () => {
	return uuidv4();
};

export const formatPrice = (price: number, separator = " ") => {
	const formattedPrice = price
		.toString()
		.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
	return `${formattedPrice} Ar`;
};

export const uppercaseFirstLetter = (str: string) => {
	if (!str) return "";
	return str.charAt(0).toUpperCase() + str.slice(1);
};
