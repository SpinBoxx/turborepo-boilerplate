import { type Dictionary, enu, t } from "intlayer";

const roomQuantityContent = {
	key: "room-quantity",
	content: {
		quantity: t({
			fr: enu({
				"1": "chambre disponible",
				">1": "chambres disponibles",
			}),
			en: enu({
				"1": "room available",
				">1": "rooms available",
			}),
			mg: enu({
				"1": "efitra azo misy",
				">1": "efitra azo misy",
			}),
		}),
	},
} satisfies Dictionary;

export default roomQuantityContent;
