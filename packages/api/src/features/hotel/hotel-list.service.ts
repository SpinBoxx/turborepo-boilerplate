import type { Prisma } from "../../../../db/prisma/generated/client";
import { Role } from "../../../../db/prisma/generated/enums";
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
import { getRolesByPriority } from "../user/user-roles";
import { computeHotel } from "./computes/hotel-compute";
import { countHotelsFromDb, listHotelsFromDb } from "./hotel.store";
import {
	type HotelComputed,
	hotelListConfig,
	type ListHotelsInput,
} from "./schemas/hotel.schema";

const HOTEL_FALLBACK_DB_ORDER: Prisma.HotelOrderByWithRelationInput[] = [
	{ updatedAt: "desc" },
	{ id: "desc" },
];

function buildHotelWhere(
	filters: ListHotelsInput["filters"],
	isAdmin: boolean,
): Prisma.HotelWhereInput {
	return {
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

export async function listHotels(
	input: ListHotelsInput,
	user: UserComputed | null | undefined,
): Promise<PaginatedResult<HotelComputed>> {
	const plan = buildHybridListExecutionPlan(input, hotelListConfig);
	const rolesSortedByPriority = getRolesByPriority(user?.roles);
	const highestRole = rolesSortedByPriority[0];
	const isAdmin = highestRole === Role.ADMIN;
	const where = buildHotelWhere(input.filters, isAdmin);

	if (!plan.execution.needsPostCompute) {
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
		rows.map(async (row) => await computeHotel(row, user)),
	);
	const filteredHotels = applyComputedFilters(
		computedHotels,
		plan.computed.filters,
	);
	const sortedHotels = applyComputedSort(filteredHotels, plan.computed.sort);

	return toPaginatedResult(sortedHotels, input.page, input.limit);
}
