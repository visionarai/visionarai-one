/** biome-ignore-all lint/style/noMagicNumbers: Need to avoid magic numbers */
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
export const createMongoDBConnector: ConnectorFactory<MongoDBConfig, Connection> = (logger, { uri, name, options }) => {
	let connection: Connection;

	return {
		connect: async (): Promise<ConnectorInfo> => {
			logger.info("Connecting to MongoDB .......");
			connection = createConnection(uri, options);

			connection.on("connected", () => {
				logger.info("✅ Connected to MongoDB");
			});
			connection.on("error", (error) => {
				logger.error(error.message, "🚨 MongoDB connection error");
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

			return {
				healthCheck: () => getMongoHealth(connection),
				name: name ?? "mongodb",
			};
		},
		disconnect: async () => {
			if (!connection) {
				return;
			}
			await connection.close(true);
			logger.info(`Disconnected from MongoDB at ${uri}`);
		},

		getConnection: () => connection,
	};
};
