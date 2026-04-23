import type { Prisma } from "../../../../db/prisma/generated/client";
import { Role } from "../../../../db/prisma/generated/enums";
import { stringToDate } from "@zanadeal/utils";
import {
	applyComputedFilters,
	applyComputedSort,
	buildHybridListExecutionPlan,
} from "../../listing/hybrid-list";
import {
	type PaginatedResult,
	toPaginatedResult,
} from "../../listing/paginated-result";
import { getReservedRoomQuantitiesByIds } from "../room/room.store";
import type { UserComputed } from "../user";
import { computeHotel } from "./computes/hotel-compute";
import { countHotelsFromDb, listHotelsFromDb } from "./hotel.store";
import {
	buildHotelVisibilityWhere,
	filterVisibleHotelsForUser,
	getHotelViewerRole,
} from "./hotel-visibility";
import {
	type HotelComputed,
	hotelListConfig,
	type ListHotelsInput,
} from "./schemas/hotel.schema";
import type { HotelComputeOptions } from "./services/hotel.service";

const HOTEL_FALLBACK_DB_ORDER: Prisma.HotelOrderByWithRelationInput[] = [
	{ updatedAt: "desc" },
	{ id: "desc" },
];

interface HotelCollectionContext {
	computedFilters: ReturnType<typeof buildHybridListExecutionPlan>["computed"]["filters"];
	computedSort: ReturnType<typeof buildHybridListExecutionPlan>["computed"]["sort"];
	mode: "db" | "post-compute";
	user: UserComputed | null | undefined;
}

type HotelCollectionRule = (
	hotels: HotelComputed[],
	context: HotelCollectionContext,
) => HotelComputed[];

function buildHotelWhere(
	filters: ListHotelsInput["filters"],
	user: UserComputed | null | undefined,
): Prisma.HotelWhereInput {
	const isAdmin = getHotelViewerRole(user) === Role.ADMIN;

	return {
		...buildHotelVisibilityWhere(user),
		isArchived: isAdmin ? undefined : false,
		name: filters.name?.contains
			? { contains: filters.name.contains, mode: "insensitive" }
			: filters.name?.equal
				? { equals: filters.name.equal, mode: "insensitive" }
				: undefined,
		updatedAt: {
			gte: filters.updatedAt?.gte,
			lte: filters.updatedAt?.lte,
		},
	};
}

function buildHotelDbOrder(
	plan: ReturnType<typeof buildHybridListExecutionPlan>,
):
	| Prisma.HotelOrderByWithRelationInput
	| Prisma.HotelOrderByWithRelationInput[] {
	if (!plan.db.sort) {
		return HOTEL_FALLBACK_DB_ORDER;
	}

	return [
		{ [plan.db.sort.field]: plan.db.sort.direction },
		{ id: "desc" },
	] as Prisma.HotelOrderByWithRelationInput[];
}

function buildHotelComputeOptions(
	input: ListHotelsInput,
): HotelComputeOptions | undefined {
	if (!input.checkInDate || !input.checkOutDate) return undefined;
	return {
		checkInDate: stringToDate(input.checkInDate),
		checkOutDate: stringToDate(input.checkOutDate),
	};
}

function buildHotelCollectionContext(
	plan: ReturnType<typeof buildHybridListExecutionPlan>,
	user: UserComputed | null | undefined,
	mode: HotelCollectionContext["mode"],
): HotelCollectionContext {
	return {
		computedFilters: plan.computed.filters,
		computedSort: plan.computed.sort,
		mode,
		user,
	};
}

const filterVisibleHotelsRule: HotelCollectionRule = (hotels, context) => {
	if (context.mode !== "post-compute") {
		return hotels;
	}

	return filterVisibleHotelsForUser(hotels, context.user);
};

const applyComputedFiltersRule: HotelCollectionRule = (hotels, context) => {
	if (context.mode !== "post-compute") {
		return hotels;
	}

	return applyComputedFilters(hotels, context.computedFilters);
};

const applyComputedSortRule: HotelCollectionRule = (hotels, context) => {
	if (context.mode !== "post-compute") {
		return hotels;
	}

	return applyComputedSort(hotels, context.computedSort);
};

function buildHotelCollectionRules(
	context: HotelCollectionContext,
): HotelCollectionRule[] {
	if (context.mode !== "post-compute") {
		return [];
	}

	return [
		filterVisibleHotelsRule,
		applyComputedFiltersRule,
		applyComputedSortRule,
	];
}

function applyHotelCollectionRules(
	hotels: HotelComputed[],
	context: HotelCollectionContext,
): HotelComputed[] {
	return buildHotelCollectionRules(context).reduce(
		(currentHotels, rule) => rule(currentHotels, context),
		hotels,
	);
}

function collectRoomIds(rows: Awaited<ReturnType<typeof listHotelsFromDb>>): string[] {
	return [...new Set(rows.flatMap((row) => row.rooms.map((room) => room.id)))];
}

async function resolveHotelComputeOptions(
	rows: Awaited<ReturnType<typeof listHotelsFromDb>>,
	computeOptions?: HotelComputeOptions,
): Promise<HotelComputeOptions | undefined> {
	if (!computeOptions?.checkInDate || !computeOptions?.checkOutDate) {
		return computeOptions;
	}

	const roomIds = collectRoomIds(rows);
	if (roomIds.length === 0) {
		return computeOptions;
	}

	return {
		...computeOptions,
		roomAvailabilityById: await getReservedRoomQuantitiesByIds({
			checkInDate: computeOptions.checkInDate,
			checkOutDate: computeOptions.checkOutDate,
			roomIds,
		}),
	};
}

async function computeHotelsCollection(
	rows: Awaited<ReturnType<typeof listHotelsFromDb>>,
	user: UserComputed | null | undefined,
	computeOptions?: HotelComputeOptions,
): Promise<HotelComputed[]> {
	return await Promise.all(
		rows.map(async (row) => await computeHotel(row, user, computeOptions)),
	);
}

export async function listHotels(
	input: ListHotelsInput,
	user: UserComputed | null | undefined,
): Promise<PaginatedResult<HotelComputed>> {
	const plan = buildHybridListExecutionPlan(input, hotelListConfig);
	const where = buildHotelWhere(input.filters, user);
	const computeOptions = buildHotelComputeOptions(input);

	// When dates are provided, room filtering happens post-compute so we must
	// go through the post-compute branch to get accurate pagination.
	const needsPostCompute =
		plan.execution.needsPostCompute || !!computeOptions;

	if (!needsPostCompute) {
		const [rows, total] = await Promise.all([
			listHotelsFromDb({
				where,
				orderBy: buildHotelDbOrder(plan),
				take: input.take,
				skip: input.skip,
			}),
			countHotelsFromDb({ where }),
		]);
		const resolvedComputeOptions = await resolveHotelComputeOptions(
			rows,
			computeOptions,
		);

		const items = await computeHotelsCollection(
			rows,
			user,
			resolvedComputeOptions,
		);

		return {
			items,
			total,
			page: input.page,
			limit: input.limit,
			pageCount: Math.ceil(total / input.limit),
		};
	}

	const rows = await listHotelsFromDb({
		where,
		orderBy: buildHotelDbOrder(plan),
	});
	const resolvedComputeOptions = await resolveHotelComputeOptions(
		rows,
		computeOptions,
	);

	const computedHotels = await computeHotelsCollection(
		rows,
		user,
		resolvedComputeOptions,
	);
	const processedHotels = applyHotelCollectionRules(
		computedHotels,
		buildHotelCollectionContext(plan, user, "post-compute"),
	);

	return toPaginatedResult(processedHotels, input.page, input.limit);
}
