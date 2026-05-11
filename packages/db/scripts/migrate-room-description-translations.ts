import pg from "pg";
import { loadDbEnv } from "../src/load-env";

loadDbEnv();

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
	throw new Error("DATABASE_URL is required to migrate room descriptions.");
}

const client = new pg.Client({ connectionString: databaseUrl });

await client.connect();

try {
	await client.query("BEGIN");
	await client.query(
		'ALTER TABLE "Room" ADD COLUMN IF NOT EXISTS "descriptionTranslations" JSONB',
	);
	await client.query(`
		UPDATE "Room"
		SET "descriptionTranslations" = jsonb_build_object(
			'fr', jsonb_build_object('description', "description"),
			'en', jsonb_build_object('description', "description"),
			'mg', jsonb_build_object('description', "description")
		)
		WHERE "descriptionTranslations" IS NULL
	`);
	await client.query(
		'ALTER TABLE "Room" ALTER COLUMN "descriptionTranslations" SET NOT NULL',
	);
	await client.query('ALTER TABLE "Room" DROP COLUMN IF EXISTS "description"');
	await client.query("COMMIT");
} catch (error) {
	await client.query("ROLLBACK");
	throw error;
} finally {
	await client.end();
}
