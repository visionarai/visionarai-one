/** biome-ignore-all lint/style/noMagicNumbers: Need to avoid magic numbers */

import type { MongoClient } from "mongodb";
import { type Connection, type ConnectOptions, createConnection } from "mongoose";
import { type ConnectorFactory, type ConnectorInfo, type HealthCheck, STATUSES, type Status } from "../connector-factory";
/**
 * MongoDB connector configuration
 */
export type MongoDBConfig = {
	uri: string;
	name?: string;
	options?: ConnectOptions;
};

/**
 * Returns health status for a mongoose connection
 */
const getMongoHealth = (connection: Connection): HealthCheck => {
	const connected = connection.readyState === 1;
	const statusIndex: number = connection.readyState <= 3 ? connection.readyState : 4;
	const status: Status = STATUSES[statusIndex];
	return { connected, status };
};

/**
 * Creates a MongoDB connector using mongoose
 */
export const createMongoDBConnector: ConnectorFactory<MongoDBConfig, Connection, MongoClient> = (logger, { uri, name, options }) => {
	type MongoCache = Map<string, Connection>;
	type GlobalWithMongoCache = typeof globalThis & { __visionarai_mongoose_connections__?: MongoCache };
	const g = globalThis as GlobalWithMongoCache;
	if (!g.__visionarai_mongoose_connections__) {
		g.__visionarai_mongoose_connections__ = new Map<string, Connection>();
	}
	const connections: MongoCache = g.__visionarai_mongoose_connections__ as MongoCache;
	let connection: Connection | undefined = connections.get(uri);

	return {
		connect: async (): Promise<ConnectorInfo> => {
			logger.info("Connecting to MongoDB .......");

			// Reuse existing connection if present and connected
			if (connection && connection.readyState === 1) {
				logger.info("✅ Already connected to MongoDB (reused cached connection)");
				const conn = connection as Connection;

				return {
					healthCheck: () => getMongoHealth(conn),
					name: name ?? "mongodb",
				};
			}

			// If a connection exists but is not connected, remove it so we create a fresh one
			if (connection && connection.readyState !== 1) {
				connections.delete(uri);
				connection = undefined;
			}

			connection = createConnection(uri, options);
			// cache it immediately so parallel callers can reuse the same pending connection
			connections.set(uri, connection);

			connection.on("connected", () => {
				logger.info("✅ Connected to MongoDB");
			});
			connection.on("error", (error) => {
				logger.error(error.message, "🚨 MongoDB connection error onError");
			});
			connection.on("disconnected", () => {
				logger.warn("⚠️ Disconnected from MongoDB");
			});
			try {
				await connection.asPromise();
			} catch (err: unknown) {
				const errorMessage = err instanceof Error ? err.message : String(err);
				logger.error({ errorMessage }, "🚨 MongoDB connection error");
				throw err;
			}

			const conn = connection as Connection;

			return {
				healthCheck: () => getMongoHealth(conn),
				name: name ?? "mongodb",
			};
		},
		disconnect: async () => {
			if (!connection) {
				return;
			}
			await connection.close(true);
			// remove from cache when disconnected
			connections.delete(uri);
			logger.info(`Disconnected from MongoDB at ${uri}`);
		},
		getClient: (): MongoClient => {
			if (!connection) {
				throw new Error("MongoDB connection is not established. Call connect() first.");
			}
			const conn = connection as Connection;
			return conn.getClient();
		},

		getConnection: () => connection as Connection,
	};
};
