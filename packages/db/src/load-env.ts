import path from "node:path";
import { fileURLToPath } from "node:url";

import dotenv from "dotenv";

const currentDir = path.dirname(fileURLToPath(import.meta.url));

export const dbEnvFilePath = path.resolve(
	currentDir,
	"../../../apps/server/.env",
);

let isLoaded = false;

export function loadDbEnv() {
	if (isLoaded) {
		return dbEnvFilePath;
	}

	dotenv.config({
		path: dbEnvFilePath,
	});

	isLoaded = true;

	return dbEnvFilePath;
}
