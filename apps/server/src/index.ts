import "dotenv/config";

import { createApp } from "./app";

const { fastify, env } = await createApp();

fastify.listen(
	{
		port: env.port,
		host: env.host,
	},
	(err) => {
		if (err) {
			fastify.log.error(err);
			process.exit(1);
		}
		console.log(`Server running on port ${env.port}`);
	},
);
