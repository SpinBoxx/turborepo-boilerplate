import prisma from "../src/index";
import { seedAmenities } from "./amenities.seed";
import seedAdminUsers from "./users.seed";

async function main() {
	const amenityCount = await seedAmenities();
	const adminUserIds = await seedAdminUsers();

	console.log(`Seeded ${amenityCount} amenities.`);
	console.log(`Seeded admin users (${adminUserIds.join(", ")}).`);
}

main()
	.catch((error) => {
		console.error("Database seeding failed.", error);
		process.exitCode = 1;
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
