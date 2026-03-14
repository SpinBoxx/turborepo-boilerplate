export const adminUserSeed = {
	email: process.env.SEED_ADMIN_EMAIL ?? "admin@zanadeal.com",
	firstName: process.env.SEED_ADMIN_FIRST_NAME ?? "Zana",
	lastName: process.env.SEED_ADMIN_LAST_NAME ?? "Admin",
	password: process.env.SEED_ADMIN_PASSWORD ?? "Admin123456!",
} as const;