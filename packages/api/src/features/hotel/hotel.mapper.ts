import type { Amenity } from "../amenity/amenity.schemas";
import type { Contact } from "../contact/contact.schemas";
import type { HotelImage } from "../hotel-image/hotel-image.schemas";
import type { Review } from "../review/review.schemas";
import type { Room } from "../room/room.schemas";
import type { Hotel } from "./hotel.schemas";

export type HotelDb = {
	id: string;
	name: string;
	description: string;
	address: string;
	mapLink: string;
	isArchived: boolean;
	latitude: string;
	longitude: string;
	bankAccount?: {
		id: string;
		iban: string;
		bic: string;
		bankName: string;
		accountHolderName: string;
		createdAt: Date;
		updatedAt: Date;
	} | null;
	createdAt: Date;
	updatedAt: Date;
	amenities?: Amenity[];
	images?: HotelImage[];
	reviews?: Review[];
	contacts?: Contact[];
	rooms?: Room[];
	favorites?: Array<{ id: string }>;
};

export type HotelMapperContext = {
	viewerUserId?: string;
};

type HotelMapperStep = (
	draft: Hotel,
	source: HotelDb,
	ctx: HotelMapperContext,
) => void | Promise<void>;

function createHotelDraft(source: HotelDb): Hotel {
	return {
		id: source.id,
		name: source.name,
		rating: 0,
		description: source.description,
		address: source.address,
		mapLink: source.mapLink,
		isArchived: source.isArchived,
		latitude: source.latitude,
		longitude: source.longitude,
		bankAccount: source.bankAccount ?? null,
		createdAt: source.createdAt,
		updatedAt: source.updatedAt,
		amenities: [],
		images: [],
		reviews: [],
		contacts: [],
		rooms: [],
		isUserFavorite: false,
		startingPrice: 0,
	};
}

const mapRelations: HotelMapperStep = (draft, source, _ctx) => {
	draft.amenities = source.amenities ?? [];
	draft.images = source.images ?? [];
	draft.reviews = source.reviews ?? [];
	draft.contacts = source.contacts ?? [];
	draft.rooms = source.rooms ?? [];
};

const mapComputed: HotelMapperStep = (draft, source, _ctx) => {
	draft.isUserFavorite = (source.favorites?.length ?? 0) > 0;

	const rooms = draft.rooms;
	draft.startingPrice =
		rooms.length === 0
			? 0
			: Math.min(...rooms.map((room) => Math.min(room.price, room.promoPrice)));
};

const mapHotelRating: HotelMapperStep = (draft) => {
	let rating = 0;

	if (draft.reviews && draft.reviews.length > 0) {
		rating =
			draft.reviews.reduce((acc, review) => acc + review.rating, 0) /
			draft.reviews.length;
	}

	draft.rating = rating ?? 0;
};

export function createHotelMapper(
	steps: HotelMapperStep[] = [mapRelations, mapComputed, mapHotelRating],
) {
	return {
		async toSchema(
			source: HotelDb,
			ctx: HotelMapperContext = {},
		): Promise<Hotel> {
			const draft = createHotelDraft(source);
			for (const step of steps) {
				await step(draft, source, ctx);
			}
			return draft;
		},
	};
}

export const hotelMapper = createHotelMapper();

// Keep a simple public API for callers.
export async function mapHotelDbToSchema(
	hotel: HotelDb,
	ctx: HotelMapperContext = {},
): Promise<Hotel> {
	return hotelMapper.toSchema(hotel, ctx);
}
