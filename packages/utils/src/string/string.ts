import { v4 as uuidv4 } from "uuid";

export const createUuid = () => {
	return uuidv4();
};

export const DEFAULT_CURRENCY = "MGA";

const CURRENCY_CONFIG = {
	MGA: {
		decimalSeparator: ",",
		fractionDigits: 0,
		groupSeparator: " ",
		symbol: "Ar",
		symbolPosition: "suffix",
	},
} as const;

type SupportedCurrency = keyof typeof CURRENCY_CONFIG;

type CurrencyOptions = {
	compact?: boolean;
	currency?: SupportedCurrency | (string & {});
	maximumFractionDigits?: number;
	minimumFractionDigits?: number;
	signDisplay?: "auto" | "always" | "exceptZero" | "never";
};

const getCurrencyConfig = (currencyCode: string) => {
	const config = CURRENCY_CONFIG[currencyCode as SupportedCurrency];
	if (!config) {
		throw new Error(`Unsupported currency: ${currencyCode}`);
	}
	return config;
};

export const getCurrencySymbol = (currencyCode = DEFAULT_CURRENCY) => {
	return getCurrencyConfig(currencyCode).symbol;
};

const groupIntegerPart = (value: string, separator: string) => {
	return value.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
};

const trimTrailingCompactZero = (value: string) => {
	return value.replace(/\.0$/, "");
};

const formatCompactAmount = (amount: number) => {
	const absoluteAmount = Math.abs(amount);

	if (absoluteAmount >= 1_000_000) {
		return `${trimTrailingCompactZero((absoluteAmount / 1_000_000).toFixed(1))}M`;
	}

	if (absoluteAmount >= 1_000) {
		return `${trimTrailingCompactZero((absoluteAmount / 1_000).toFixed(1))}k`;
	}

	return String(Math.round(absoluteAmount));
};

const resolveSign = (
	amount: number,
	signDisplay: NonNullable<CurrencyOptions["signDisplay"]>,
) => {
	if (signDisplay === "never") return "";
	if (amount < 0) return "-";
	if (signDisplay === "always") return "+";
	if (signDisplay === "exceptZero" && amount !== 0) return "+";
	return "";
};

export const currency = (amount: number, options: CurrencyOptions = {}) => {
	const {
		compact = false,
		currency: currencyCode = DEFAULT_CURRENCY,
		maximumFractionDigits,
		minimumFractionDigits,
		signDisplay = "auto",
	} = options;
	const config = getCurrencyConfig(currencyCode);
	const sign = resolveSign(amount, signDisplay);
	const absoluteAmount = Math.abs(amount);
	const fractionDigits = maximumFractionDigits ?? config.fractionDigits;

	const formattedAmount = compact
		? formatCompactAmount(absoluteAmount)
		: (() => {
				const fixedAmount = absoluteAmount.toFixed(fractionDigits);
				const [integerPart = "0", decimalPart = ""] = fixedAmount.split(".");
				const groupedIntegerPart = groupIntegerPart(
					integerPart,
					config.groupSeparator,
				);
				const resolvedMinimumFractionDigits = minimumFractionDigits ?? fractionDigits;
				const resolvedDecimalPart = decimalPart
					.padEnd(resolvedMinimumFractionDigits, "0")
					.slice(0, Math.max(fractionDigits, resolvedMinimumFractionDigits));

				return resolvedDecimalPart
					? `${groupedIntegerPart}${config.decimalSeparator}${resolvedDecimalPart}`
					: groupedIntegerPart;
			})();

	return config.symbolPosition === "suffix"
		? `${sign}${formattedAmount} ${config.symbol}`
		: `${config.symbol} ${sign}${formattedAmount}`;
};

export const uppercaseFirstLetter = (str: string) => {
	if (!str) return "";
	return str.charAt(0).toUpperCase() + str.slice(1);
};
