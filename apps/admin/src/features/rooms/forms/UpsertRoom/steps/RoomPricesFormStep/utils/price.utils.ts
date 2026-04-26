import type { UpsertRoomPriceInput } from "@zanadeal/api/features/room";

/**
 * Nettoie les données de prix pour retirer les champs non désirés (comme meta de TanStack Form)
 * et ne conserver que les champs nécessaires pour l'API
 */
export const cleanPriceData = (
	period: UpsertRoomPriceInput,
): UpsertRoomPriceInput => ({
	price: period.price,
	promoPrice: period.promoPrice,
	startDate: period.startDate,
	endDate: period.endDate,
});

/**
 * Nettoie un tableau de prix
 */
export const cleanPricesData = (
	prices: UpsertRoomPriceInput[],
): UpsertRoomPriceInput[] => prices.map(cleanPriceData);
