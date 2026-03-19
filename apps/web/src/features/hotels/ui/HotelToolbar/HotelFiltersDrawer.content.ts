import { type Dictionary, enu, insert, t } from "intlayer";

const hotelFiltersDrawerContent = {
	key: "hotel-filters-drawer",
	content: {
		resetFilters: t({
			fr: "Réinitialiser les filtres",
			en: "Reset filters",
			mg: "Avereno ny sivana",
		}),
		applyFilters: t({
			fr: "Appliquer les filtres",
			en: "Apply filters",
			mg: "Ampiharo ny sivana",
		}),
		close: t({
			fr: "Fermer",
			en: "Close",
			mg: "Hakatona",
		}),
		filters: t({
			fr: "Filtres",
			en: "Filters",
			mg: "Sivana",
		}),
		sortBy: t({
			fr: "Trier par",
			en: "Sort by",
			mg: "Hamarino amin'ny",
		}),
		results: t({
			fr: enu({
				"0": insert("Aucun résultat"),
				"1": insert("{{count}} résultat"),
				">1": insert("{{count}} résultats"),
			}),
			en: enu({
				"0": insert("No results"),
				"1": insert("{{count}} result"),
				">1": insert("{{count}} results"),
			}),
			mg: enu({
				"0": insert("Tsy misy vokatra"),
				"1": insert("{{count}} vokatra"),
				">1": insert("{{count}} vokatra"),
			}),
		}),
		refineYourSearch: t({
			fr: "Affiner votre recherche",
			en: "Refine your search",
			mg: "Hamarino ny fikarohana",
		}),
		searchIdealHotel: t({
			fr: "Trouver l'hotel idéal",
			en: "Find the ideal hotel",
			mg: "Mitadiava hotely tonga lafatra",
		}),
		searchHotelByName: t({
			fr: "Rechercher par nom d'hotel...",
			en: "Search by hotel name...",
			mg: "Mitadiava amin'ny anaran'ny hotely...",
		}),
	},
} satisfies Dictionary;

export default hotelFiltersDrawerContent;
