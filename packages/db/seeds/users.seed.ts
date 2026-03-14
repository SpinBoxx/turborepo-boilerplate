import { randomUUID } from "node:crypto";

import { hashPassword } from "better-auth/crypto";

import { Role } from "../prisma/generated/enums";
import prisma from "../src/index";
import { adminUserSeed } from "./admin-user.data";

const credentialProviderId = "credential";

export async function seedAdminUser() {
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

	if (existingUser) {
		await prisma.user.update({
			where: { id: existingUser.id },
			data: {
				emailVerified: true,
				firstName: adminUserSeed.firstName,
				lastName: adminUserSeed.lastName,
				roles: [Role.ADMIN, Role.USER],
			},
		});

		const credentialAccount = existingUser.accounts[0];

		if (credentialAccount) {
			await prisma.account.update({
				where: { id: credentialAccount.id },
				data: { password: passwordHash },
			});
		} else {
			await prisma.account.create({
				data: {
					accountId: existingUser.id,
					id: randomUUID(),
					password: passwordHash,
					providerId: credentialProviderId,
					userId: existingUser.id,
				},
			});
		}

		return existingUser.id;
	}

	const userId = randomUUID();

	await prisma.user.create({
		data: {
			id: userId,
			email: adminUserSeed.email,
			emailVerified: true,
			firstName: adminUserSeed.firstName,
			lastName: adminUserSeed.lastName,
			roles: [Role.ADMIN, Role.USER],
			accounts: {
				create: {
					accountId: userId,
					id: randomUUID(),
					password: passwordHash,
					providerId: credentialProviderId,
				},
			},
		},
	});

	return userId;
}
