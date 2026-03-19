import { randomUUID } from "node:crypto";

import { hashPassword } from "better-auth/crypto";

import { Role } from "../prisma/generated/enums";
import prisma from "../src/index";

const USERS_SEED = [
	{
		email: "quentin.mimault@orange.fr",
		firstName: "Quentin",
		lastName: "Mimault",
		password: "Quentin86",
	},
	{
		email: "antoinemathe86@gmail.com",
		firstName: "Antoine",
		lastName: "Mathé",
		password: "AntoineAuMexique00",
	},
];

const credentialProviderId = "credential";

export default async function seedAdminUsers() {
	const adminUserIds: string[] = [];
	for (const adminUserSeed of USERS_SEED) {
		const userId = await seedUser(adminUserSeed);
		if (userId) {
			adminUserIds.push(userId);
		}
	}
	return adminUserIds;
}

async function seedUser(adminUserSeed: (typeof USERS_SEED)[number]) {
	const passwordHash = await hashPassword(adminUserSeed.password);

	const existingUser = await prisma.user.findUnique({
		where: { email: adminUserSeed.email },
		include: {
			accounts: {
				where: { providerId: credentialProviderId },
				select: { id: true },
			},
		},
	});

	if (!existingUser) {
		const id = randomUUID();
		const newUser = await prisma.user.create({
			data: {
				id,
				email: adminUserSeed.email,
				emailVerified: true,
				firstName: adminUserSeed.firstName,
				lastName: adminUserSeed.lastName,
				roles: [Role.ADMIN, Role.USER],
				accounts: {
					create: {
						accountId: id,
						id: randomUUID(),
						providerId: credentialProviderId,
						password: passwordHash,
					},
				},
			},
		});
		return newUser.id;
	}
}
