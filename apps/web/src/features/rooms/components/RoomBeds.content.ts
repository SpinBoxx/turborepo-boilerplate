import { type Dictionary, enu, t } from "intlayer";

const roomBedsContent = {
	key: "room-beds",
	content: {
		beds: t({
			fr: enu({
				"1": "lit",
				">1": "lits",
			}),
			en: enu({
				"1": "bed",
				">1": "beds",
			}),
			mg: enu({
				"1": "fandriana",
				">1": "fandriana",
			}),
		}),
	},
} satisfies Dictionary;

export default roomBedsContent;
