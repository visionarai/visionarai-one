import { betterAuth, type Logger } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins";
import { MongoClient } from "mongodb";
import { appLogger } from "./logger";
import { runtimeConfig } from "./runtime-conf";

const client = new MongoClient(runtimeConfig.MONGODB_URI);
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
	socialProviders: {
		github: {
			clientId: runtimeConfig.GITHUB_CLIENT_ID,
			clientSecret: runtimeConfig.GITHUB_CLIENT_SECRET,
		},
	},
});

export type Session = typeof auth.$Infer.Session;

export type User = Session["user"];
export type UserSession = Session["session"];
