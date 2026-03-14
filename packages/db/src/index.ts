import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../prisma/generated/client";
import { loadDbEnv } from "./load-env";

loadDbEnv();

const adapter = new PrismaPg({
	connectionString: process.env.DATABASE_URL || "",
});
const prisma = new PrismaClient({ adapter });

export default prisma;
