import { type Dictionary, enu, insert, t } from "intlayer";

const hotelFiltersDrawerContent = {
	key: "hotel-filters-drawer",
	content: {
		resetFilters: t({
			fr: "Réinitialiser les filtres",
			en: "Reset filters",
			"mg-MG": "Avereno ny sivana",
		}),
		applyFilters: t({
			fr: "Appliquer les filtres",
			en: "Apply filters",
			"mg-MG": "Ampiharo ny sivana",
		}),
		close: t({
			fr: "Fermer",
			en: "Close",
			"mg-MG": "Hakatona",
		}),
		filters: t({
			fr: "Filtres",
			en: "Filters",
			"mg-MG": "Sivana",
		}),
		sortBy: t({
			fr: "Trier par",
			en: "Sort by",
			"mg-MG": "Hamarino amin'ny",
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
			"mg-MG": enu({
				"0": insert("Tsy misy vokatra"),
				"1": insert("{{count}} vokatra"),
				">1": insert("{{count}} vokatra"),
			}),
		}),
		refineYourSearch: t({
			fr: "Affiner votre recherche",
			en: "Refine your search",
			"mg-MG": "Hamarino ny fikarohana",
			mg: "Hamarino ny fikarohana",
		}),
		searchIdealHotel: t({
			fr: "Trouver l'hotel idéal",
			en: "Find the ideal hotel",
			"mg-MG": "Mitadiava hotely tonga lafatra",
		}),
		searchHotelByName: t({
			fr: "Rechercher par nom d'hotel...",
			en: "Search by hotel name...",
			"mg-MG": "Mitadiava amin'ny anaran'ny hotely...",
		}),
		priceAscending: t({
			fr: "Prix croissant",
			en: "Price ascending",
			"mg-MG": "Vidiny miakatra",
		}),
		priceDescending: t({
			fr: "Prix décroissant",
			en: "Price descending",
			"mg-MG": "Vidiny midina",
		}),
		nameAscending: t({
			fr: "Nom A -> Z",
			en: "Name A -> Z",
			"mg-MG": "Anarana A -> Z",
		}),
		nameDescending: t({
			fr: "Nom Z -> A",
			en: "Name Z -> A",
			"mg-MG": "Anarana Z -> A",
		}),
		travelDates: t({
			fr: "Dates de séjour",
			en: "Travel dates",
			"mg-MG": "Daty fitsangatsanganana",
		}),
		checkIn: t({
			fr: "Arrivée",
			en: "Check-in",
			"mg-MG": "Fidirana",
		}),
		checkOut: t({
			fr: "Départ",
			en: "Check-out",
			"mg-MG": "Fivoahana",
		}),
		selectDate: t({
			fr: "Choisir une date",
			en: "Select a date",
			"mg-MG": "Safidio ny daty",
		}),
		priceRange: t({
			fr: "Fourchette de prix",
			en: "Price range",
			"mg-MG": "Salan'ny vidiny",
		}),
		min: t({
			fr: "Min",
			en: "Min",
			"mg-MG": "Kely indrindra",
		}),
		max: t({
			fr: "Max",
			en: "Max",
			"mg-MG": "Be indrindra",
		}),
		filterActive: t({
			fr: "Actif",
			en: "On",
			"mg-MG": "Mandeha",
		}),
		sortHotels: t({
			fr: "Trier les hôtels",
			en: "Sort hotels",
			"mg-MG": "Alaharo ny hotely",
		}),
		hotelSearch: t({
			fr: "Rechercher un hôtel",
			en: "Hotel search",
			"mg-MG": "Fikarohan'ny hotely",
		}),
	},
} satisfies Dictionary;

export default hotelFiltersDrawerContent;
