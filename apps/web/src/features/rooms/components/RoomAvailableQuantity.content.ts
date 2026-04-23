import { type Dictionary, enu, insert, t } from "intlayer";

const roomAvailableQuantityContent = {
	key: "room-available-quantity",
	content: {
		availableQuantity: t({
			fr: enu({
				"1": insert("{{count}} chambre disponible"),
				">1": insert("{{count}} chambres disponibles"),
			}),
			en: enu({
				"1": insert("{{count}} room available"),
				">1": insert("{{count}} rooms available"),
			}),
			mg: enu({
				"1": insert("{{count}} efitra misy"),
				">1": insert("{{count}} efitra misy"),
			}),
		}),
		availableQuantityOverlay: t({
			fr: enu({
				"1": insert("{{count}} chambre restante"),
				">1": insert("{{count}} chambres restantes"),
			}),
			en: enu({
				"1": insert("{{count}} room left"),
				">1": insert("{{count}} rooms left"),
			}),
			mg: enu({
				"1": insert("{{count}} efitra sisa"),
				">1": insert("{{count}} efitra sisa"),
			}),
		}),
	},
} satisfies Dictionary;

export default roomAvailableQuantityContent;
