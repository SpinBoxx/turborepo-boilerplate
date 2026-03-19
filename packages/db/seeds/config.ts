import z from "zod";

import { loadDbEnv } from "../src/load-env";

loadDbEnv();

const SeedEnvSchema = z.object({
	DATABASE_URL: z.string().min(1),
});

export const seedEnv = SeedEnvSchema.parse(process.env);
