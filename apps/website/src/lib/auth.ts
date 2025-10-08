import { createMongoDBConnector } from "@visionarai-one/connectors";
import { betterAuth, type Logger } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins";
import type { MongoClient } from "mongodb";
import { appLogger } from "./logger";
import { runtimeConfig } from "./runtime-conf";

type GlobalWithMongoDbCache = typeof globalThis & { __visionarai_mongodb_client__?: MongoClient };
const g = globalThis as GlobalWithMongoDbCache;

if (!g.__visionarai_mongodb_client__) {
	g.__visionarai_mongodb_client__ = undefined;
}

let client: MongoClient;

if (g.__visionarai_mongodb_client__) {
	client = g.__visionarai_mongodb_client__;
} else {
	const databaseConnector = createMongoDBConnector(appLogger, {
		uri: runtimeConfig.MONGODB_URI,
	});
	await databaseConnector.connect();
	client = databaseConnector.getClient();
}

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
			maxAge: 60, // 1 minute
		},
	},
	socialProviders: {
		github: {
			clientId: runtimeConfig.GITHUB_CLIENT_ID,
			clientSecret: runtimeConfig.GITHUB_CLIENT_SECRET,
			mapProfileToUser: (profile) => ({
				image: profile.avatar_url,
			}),
		},
	},
});

export type Session = typeof auth.$Infer.Session;

export type User = Session["user"];
export type UserSession = Session["session"];
