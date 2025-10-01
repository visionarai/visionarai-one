import { betterAuth, type Logger } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";
import { MongoClient } from "mongodb";
import { appLogger } from "./logger";

const client = new MongoClient(process.env.MONGODB_URI as string);
const db = client.db();

export const auth = betterAuth({
	database: mongodbAdapter(db, {
		client,
	}),
	emailAndPassword: {
		enabled: true,
	},
	logger: appLogger as unknown as Logger,
	plugins: [nextCookies()],
	session: {
		cookieCache: {
			enabled: true,
			maxAge: 60, // 1 minute
		},
	},
});

export type Session = typeof auth.$Infer.Session;
