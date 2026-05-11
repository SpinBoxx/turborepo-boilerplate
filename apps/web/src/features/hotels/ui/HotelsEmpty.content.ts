import { type Dictionary, t } from "intlayer";

const hotelsEmptyContent = {
	key: "hotels-empty",
	content: {
		noHotelForDates: t({
			fr: "Aucun hôtel disponible pour ces dates",
			en: "No hotels available for these dates",
			mg: "Tsy misy hotely misy efitrano ho an'ireo daty ireo",
		}),
		noHotelForDatesDescription: t({
			fr: "Aucun hôtel ne propose de chambres disponibles pour ces dates. Essayez d'autres dates de séjour.",
			en: "No hotel offers available rooms for these dates. Try other travel dates.",
			mg: "Tsy misy hotely manana efitrano ho an'ireo daty ireo. Andramo daty hafa.",
		}),
		noHotelFound: t({
			fr: "Aucun hôtel trouvé",
			en: "No hotels found",
			mg: "Tsy nahitana hotely",
		}),
		noHotelFoundDescription: t({
			fr: "Essayez un autre tri ou modifiez votre filtre pour élargir les résultats.",
			en: "Try a different sort or adjust your filters to broaden the results.",
			mg: "Andramo fandaminana hafa na ovao ny sivana mba hanitarana ny vokatra.",
		}),
	},
} satisfies Dictionary;

export default hotelsEmptyContent;
