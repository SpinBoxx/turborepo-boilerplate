import { v4 as uuidv4 } from "uuid";
export const createUuid = () => {
	return uuidv4();
};

export const uppercaseFirstLetter = (str: string) => {
	if (!str) return "";
	return str.charAt(0).toUpperCase() + str.slice(1);
};
