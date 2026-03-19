import { type Dictionary, enu, t } from "intlayer";

const roomGuestsContent = {
	key: "room-guests",
	content: {
		guests: t({
			fr: enu({
				"1": "invité",
				">1": "invités",
				fallback: "fe",
			}),
			en: enu({
				"1": "guest",
				">1": "guests",
			}),
			mg: enu({
				"1": "vahiny",
				">1": "vahiny",
			}),
		}),
	},
} satisfies Dictionary;

export default roomGuestsContent;
