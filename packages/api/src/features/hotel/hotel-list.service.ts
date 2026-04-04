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

function buildComputeOptions(
	input: ListHotelsInput,
): HotelComputeOptions | undefined {
	if (!input.checkInDate || !input.checkOutDate) return undefined;
	return {
		checkInDate: stringToDate(input.checkInDate),
		checkOutDate: stringToDate(input.checkOutDate),
	};
}

export async function listHotels(
	input: ListHotelsInput,
	user: UserComputed | null | undefined,
): Promise<PaginatedResult<HotelComputed>> {
	const plan = buildHybridListExecutionPlan(input, hotelListConfig);
	const where = buildHotelWhere(input.filters, user);
	const computeOptions = buildComputeOptions(input);

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

		const items = await Promise.all(
			rows.map(async (row) => await computeHotel(row, user)),
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

	const computedHotels = await Promise.all(
		rows.map(async (row) => await computeHotel(row, user, computeOptions)),
	);

	const visibleHotels = filterVisibleHotelsForUser(computedHotels, user);
	const filteredHotels = applyComputedFilters(
		visibleHotels,
		plan.computed.filters,
	);
	const sortedHotels = applyComputedSort(filteredHotels, plan.computed.sort);

	return toPaginatedResult(sortedHotels, input.page, input.limit);
}
