import { type Dictionary, t } from "intlayer";

const hotelRoomsPageContent = {
	key: "hotel-rooms-page",
	content: {
		filterRooms: t({
			fr: "Filtrer les chambres",
			en: "Filter rooms",
			mg: "Sivana efitrano",
		}),
		chooseRoom: t({
			fr: "Choisissez la chambre qui vous convient le mieux parmi notre sélection de chambres confortables et élégantes, conçues pour répondre à tous vos besoins pendant votre séjour chez nous.",
			en: "Choose the room that suits you best from our selection of comfortable and elegant rooms, designed to meet all your needs during your stay with us.",
			mg: "Safidio ny efitrano mifanaraka aminao indrindra amin'ny efitrano tsara sy kanto izay nataonay, natao hifanaraka amin'ny filànao rehetra amin'ny fijanonao.",
		}),
	},
} satisfies Dictionary;

export default hotelRoomsPageContent;
