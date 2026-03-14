import path from "node:path";
import { defineConfig, env } from "prisma/config";
import { loadDbEnv } from "./src/load-env";

loadDbEnv();

export default defineConfig({
	schema: path.join("prisma", "schema"),
	migrations: {
		path: path.join("prisma", "migrations"),
	},
	datasource: {
		url: env("DATABASE_URL"),
	},
});
