import prisma from "../src/index";
import { seedAmenities } from "./amenities.seed";
import { seedEnv } from "./config";
import { seedAdminUser } from "./users.seed";

async function main() {
	const amenityCount = await seedAmenities();
	const adminUserId = await seedAdminUser();

	console.log(`Seeded ${amenityCount} amenities.`);
	console.log(`Seeded admin user ${seedEnv.SEED_ADMIN_EMAIL} (${adminUserId}).`);
}

main()
	.catch((error) => {
		console.error("Database seeding failed.", error);
		process.exitCode = 1;
	})
	.finally(async () => {
		await prisma.$disconnect();
	});