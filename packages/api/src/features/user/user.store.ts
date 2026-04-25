import { randomUUID } from "node:crypto";

import prisma from "@zanadeal/db";
import { hashPassword } from "better-auth/crypto";
import type { Prisma } from "../../../../db/prisma/generated/client";
import { Role } from "../../../../db/prisma/generated/enums";
import type {
	CreateManagedUserInput,
	ManagedUserBusinessRole,
	UpdateManagedUserInput,
} from "./schemas/user.schema";

const credentialProviderId = "credential";
const managedRoles = [Role.ADMIN, Role.HOTEL_REVIEWER] as const;

const managedUserSelect = {
	id: true,
	email: true,
	firstName: true,
	lastName: true,
	emailVerified: true,
	roles: true,
	disabledAt: true,
	createdAt: true,
	updatedAt: true,
} satisfies Prisma.UserSelect;

export type ManagedUserDB = Prisma.UserGetPayload<{
	select: typeof managedUserSelect;
}>;

function buildManagedUserRoles(role: ManagedUserBusinessRole): Role[] {
	return [Role.USER, role];
}

export async function getManagedUserById(
	id: string,
): Promise<ManagedUserDB | null> {
	return await prisma.user.findUnique({
		where: { id },
		select: managedUserSelect,
	});
}

export async function getManagedUserByEmail(
	email: string,
): Promise<ManagedUserDB | null> {
	return await prisma.user.findUnique({
		where: { email },
		select: managedUserSelect,
	});
}

export async function listManagedUsers(): Promise<ManagedUserDB[]> {
	return await prisma.user.findMany({
		where: {
			roles: {
				hasSome: [...managedRoles],
			},
		},
		orderBy: [{ disabledAt: "asc" }, { createdAt: "desc" }],
		select: managedUserSelect,
	});
}

export async function createManagedUser(
	input: CreateManagedUserInput,
): Promise<ManagedUserDB> {
	const id = randomUUID();
	const passwordHash = await hashPassword(input.password);

	return await prisma.user.create({
		data: {
			id,
			email: input.email,
			emailVerified: true,
			firstName: input.firstName,
			lastName: input.lastName,
			roles: buildManagedUserRoles(input.role),
			accounts: {
				create: {
					accountId: id,
					id: randomUUID(),
					providerId: credentialProviderId,
					password: passwordHash,
				},
			},
		},
		select: managedUserSelect,
	});
}

export async function updateManagedUser(
	input: UpdateManagedUserInput,
): Promise<ManagedUserDB> {
	return await prisma.user.update({
		where: { id: input.id },
		data: {
			email: input.email,
			firstName: input.firstName,
			lastName: input.lastName,
			roles: input.role ? buildManagedUserRoles(input.role) : undefined,
		},
		select: managedUserSelect,
	});
}

export async function destroyUserSessions(userId: string): Promise<number> {
	const result = await prisma.session.deleteMany({
		where: { userId },
	});

	return result.count;
}

export async function deactivateManagedUser(
	id: string,
): Promise<ManagedUserDB> {
	const user = await prisma.user.update({
		where: { id },
		data: { disabledAt: new Date() },
		select: managedUserSelect,
	});

	await destroyUserSessions(id);

	return user;
}
