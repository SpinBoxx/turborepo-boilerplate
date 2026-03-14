import z from "zod";

import { loadDbEnv } from "../src/load-env";

loadDbEnv();

const SeedEnvSchema = z.object({
	DATABASE_URL: z.string().min(1),
	SEED_ADMIN_EMAIL: z.email().default("admin@zanadeal.com"),
	SEED_ADMIN_PASSWORD: z.string().min(8).default("Admin123456!"),
	SEED_ADMIN_FIRST_NAME: z.string().min(1).default("Zana"),
	SEED_ADMIN_LAST_NAME: z.string().min(1).default("Admin"),
});

export const seedEnv = SeedEnvSchema.parse(process.env);
