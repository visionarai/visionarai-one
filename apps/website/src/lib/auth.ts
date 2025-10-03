import { betterAuth, type Logger } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins";
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
	plugins: [nextCookies(), admin({ defaultRole: "regular" })],
	session: {
		cookieCache: {
			enabled: true,
			// Include user.role in the cookie cache for middleware access
			include: ["user.id", "user.email", "user.name", "user.role"],
			maxAge: 60, // 1 minute
		},
	},
});

export type Session = typeof auth.$Infer.Session;
