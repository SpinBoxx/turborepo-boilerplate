import { createLucideSvg } from "./svg";

type AmenitySeed = {
	icon: string;
	slug: string;
	translations: {
		en: { name: string };
		fr: { name: string };
		mg: { name: string };
	};
};

const wifiIcon = createLucideSvg([
	{ tag: "path", attrs: { d: "M12 20h.01" } },
	{ tag: "path", attrs: { d: "M2 8.82a15 15 0 0 1 20 0" } },
	{ tag: "path", attrs: { d: "M5 12.86a10 10 0 0 1 14 0" } },
	{ tag: "path", attrs: { d: "M8.5 16.43a5 5 0 0 1 7 0" } },
]);

const carIcon = createLucideSvg([
	{
		tag: "path",
		attrs: {
			d: "M14 16H9m10 0h2m-2 0v2m0-2-1.5-4.5A2 2 0 0 0 15.6 10H8.4a2 2 0 0 0-1.9 1.5L5 16m0 0H3m2 0v2",
		},
	},
	{ tag: "circle", attrs: { cx: "7.5", cy: "16.5", r: "1.5" } },
	{ tag: "circle", attrs: { cx: "16.5", cy: "16.5", r: "1.5" } },
]);

const wavesIcon = createLucideSvg([
	{
		tag: "path",
		attrs: {
			d: "M2 6c1.5 1 2.5 1 4 0s2.5-1 4 0 2.5 1 4 0 2.5-1 4 0 2.5 1 4 0",
		},
	},
	{
		tag: "path",
		attrs: {
			d: "M2 12c1.5 1 2.5 1 4 0s2.5-1 4 0 2.5 1 4 0 2.5-1 4 0 2.5 1 4 0",
		},
	},
	{
		tag: "path",
		attrs: {
			d: "M2 18c1.5 1 2.5 1 4 0s2.5-1 4 0 2.5 1 4 0 2.5-1 4 0 2.5 1 4 0",
		},
	},
]);

const bathIcon = createLucideSvg([
	{ tag: "path", attrs: { d: "M7 9V6a3 3 0 0 1 6 0" } },
	{ tag: "path", attrs: { d: "M4 12h16v2a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z" } },
	{ tag: "line", attrs: { x1: "6", x2: "6", y1: "18", y2: "20" } },
	{ tag: "line", attrs: { x1: "18", x2: "18", y1: "18", y2: "20" } },
]);

const snowflakeIcon = createLucideSvg([
	{ tag: "line", attrs: { x1: "12", x2: "12", y1: "2", y2: "22" } },
	{ tag: "line", attrs: { x1: "4.93", x2: "19.07", y1: "4.93", y2: "19.07" } },
	{ tag: "line", attrs: { x1: "2", x2: "22", y1: "12", y2: "12" } },
	{ tag: "line", attrs: { x1: "19.07", x2: "4.93", y1: "4.93", y2: "19.07" } },
]);

const utensilsIcon = createLucideSvg([
	{ tag: "path", attrs: { d: "M4 3v8a2 2 0 0 0 2 2v8" } },
	{ tag: "path", attrs: { d: "M8 3v8" } },
	{ tag: "path", attrs: { d: "M6 3v8" } },
	{ tag: "path", attrs: { d: "M14 3v18" } },
	{ tag: "path", attrs: { d: "M18 3c0 4-2 6-4 6" } },
]);

const tvIcon = createLucideSvg([
	{
		tag: "rect",
		attrs: { x: "3", y: "6", width: "18", height: "12", rx: "2" },
	},
	{ tag: "path", attrs: { d: "m9 18-2 3" } },
	{ tag: "path", attrs: { d: "m15 18 2 3" } },
	{ tag: "path", attrs: { d: "M8 21h8" } },
]);

const dumbbellIcon = createLucideSvg([
	{ tag: "path", attrs: { d: "M6 5v14" } },
	{ tag: "path", attrs: { d: "M18 5v14" } },
	{ tag: "path", attrs: { d: "M3 8v8" } },
	{ tag: "path", attrs: { d: "M21 8v8" } },
	{ tag: "line", attrs: { x1: "6", x2: "18", y1: "12", y2: "12" } },
]);

const bellIcon = createLucideSvg([
	{ tag: "path", attrs: { d: "M10.27 21a2 2 0 0 0 3.46 0" } },
	{ tag: "path", attrs: { d: "M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9" } },
]);

const shieldIcon = createLucideSvg([
	{ tag: "path", attrs: { d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" } },
	{ tag: "path", attrs: { d: "m9 12 2 2 4-4" } },
]);

const coffeeIcon = createLucideSvg([
	{ tag: "path", attrs: { d: "M10 2v2" } },
	{ tag: "path", attrs: { d: "M14 2v2" } },
	{ tag: "path", attrs: { d: "M8 2v2" } },
	{ tag: "path", attrs: { d: "M3 8h13v5a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" } },
	{ tag: "path", attrs: { d: "M16 10h1a3 3 0 1 1 0 6h-1" } },
]);

const fanIcon = createLucideSvg([
	{ tag: "circle", attrs: { cx: "12", cy: "12", r: "2" } },
	{
		tag: "path",
		attrs: {
			d: "M12 4c2.5 0 4 1.5 4 4-2.5.5-4.5-.5-5.5-2.5C10 4.7 10.8 4 12 4",
		},
	},
	{
		tag: "path",
		attrs: {
			d: "M20 12c0 2.5-1.5 4-4 4-.5-2.5.5-4.5 2.5-5.5.8-.5 1.5.3 1.5 1.5",
		},
	},
	{
		tag: "path",
		attrs: {
			d: "M12 20c-2.5 0-4-1.5-4-4 2.5-.5 4.5.5 5.5 2.5.5.8-.3 1.5-1.5 1.5",
		},
	},
	{
		tag: "path",
		attrs: {
			d: "M4 12c0-2.5 1.5-4 4-4 .5 2.5-.5 4.5-2.5 5.5C4.7 14 4 13.2 4 12",
		},
	},
]);

const treesIcon = createLucideSvg([
	{ tag: "path", attrs: { d: "m7 19 4-7H3z" } },
	{ tag: "path", attrs: { d: "m17 15 4-7h-8z" } },
	{ tag: "path", attrs: { d: "M11 19h2" } },
	{ tag: "path", attrs: { d: "M17 15v6" } },
	{ tag: "path", attrs: { d: "M7 19v2" } },
]);

const sparklesIcon = createLucideSvg([
	{
		tag: "path",
		attrs: { d: "m12 3 1.9 4.1L18 9l-4.1 1.9L12 15l-1.9-4.1L6 9l4.1-1.9Z" },
	},
	{ tag: "path", attrs: { d: "M5 3v4" } },
	{ tag: "path", attrs: { d: "M3 5h4" } },
	{ tag: "path", attrs: { d: "M19 16v5" } },
	{ tag: "path", attrs: { d: "M16.5 18.5h5" } },
]);

const washingMachineIcon = createLucideSvg([
	{
		tag: "rect",
		attrs: { x: "3", y: "2", width: "18", height: "20", rx: "2" },
	},
	{ tag: "circle", attrs: { cx: "12", cy: "13", r: "5" } },
	{ tag: "path", attrs: { d: "M8 6h.01" } },
	{ tag: "path", attrs: { d: "M16 6h.01" } },
]);

export const amenitySeeds: AmenitySeed[] = [
	{
		slug: "wifi",
		icon: wifiIcon,
		translations: {
			en: { name: "Free Wi-Fi" },
			fr: { name: "Wi-Fi gratuit" },
			mg: { name: "Wi-Fi maimaim-poana" },
		},
	},
	{
		slug: "parking",
		icon: carIcon,
		translations: {
			en: { name: "Parking" },
			fr: { name: "Parking" },
			mg: { name: "Toerana fiantsonana" },
		},
	},
	{
		slug: "pool",
		icon: wavesIcon,
		translations: {
			en: { name: "Pool" },
			fr: { name: "Piscine" },
			mg: { name: "Dobo filomanosana" },
		},
	},
	{
		slug: "private-bathroom",
		icon: bathIcon,
		translations: {
			en: { name: "Private bathroom" },
			fr: { name: "Salle de bain privee" },
			mg: { name: "Efitra fandroana manokana" },
		},
	},
	{
		slug: "air-conditioning",
		icon: snowflakeIcon,
		translations: {
			en: { name: "Air conditioning" },
			fr: { name: "Climatisation" },
			mg: { name: "Rivotra mangatsiaka" },
		},
	},
	{
		slug: "breakfast",
		icon: utensilsIcon,
		translations: {
			en: { name: "Breakfast included" },
			fr: { name: "Petit-dejeuner inclus" },
			mg: { name: "Sakafo maraina tafiditra" },
		},
	},
	{
		slug: "tv",
		icon: tvIcon,
		translations: {
			en: { name: "Television" },
			fr: { name: "Television" },
			mg: { name: "Fahitalavitra" },
		},
	},
	{
		slug: "gym",
		icon: dumbbellIcon,
		translations: {
			en: { name: "Gym" },
			fr: { name: "Salle de sport" },
			mg: { name: "Efitra fanaovana fanatanjahantena" },
		},
	},
	{
		slug: "room-service",
		icon: bellIcon,
		translations: {
			en: { name: "Room service" },
			fr: { name: "Service en chambre" },
			mg: { name: "Fanompoana an-efitra" },
		},
	},
	{
		slug: "security",
		icon: shieldIcon,
		translations: {
			en: { name: "24/7 security" },
			fr: { name: "Securite 24h/24" },
			mg: { name: "Filaminana 24/7" },
		},
	},
	{
		slug: "coffee-maker",
		icon: coffeeIcon,
		translations: {
			en: { name: "Coffee maker" },
			fr: { name: "Machine a cafe" },
			mg: { name: "Milina fanaovana kafe" },
		},
	},
	{
		slug: "ceiling-fan",
		icon: fanIcon,
		translations: {
			en: { name: "Ceiling fan" },
			fr: { name: "Ventilateur de plafond" },
			mg: { name: "Ventilatera ambony" },
		},
	},
	{
		slug: "garden",
		icon: treesIcon,
		translations: {
			en: { name: "Garden" },
			fr: { name: "Jardin" },
			mg: { name: "Zaridaina" },
		},
	},
	{
		slug: "spa",
		icon: sparklesIcon,
		translations: {
			en: { name: "Spa" },
			fr: { name: "Spa" },
			mg: { name: "Spa" },
		},
	},
	{
		slug: "laundry",
		icon: washingMachineIcon,
		translations: {
			en: { name: "Laundry service" },
			fr: { name: "Service de blanchisserie" },
			mg: { name: "Fanadiovana akanjo" },
		},
	},
];
