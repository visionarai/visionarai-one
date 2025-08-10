import type { Logger } from 'pino';

/**
 * List of possible connector statuses.
 * @readonly
 */
export const STATUSES = ['disconnected', 'connected', 'connecting', 'disconnecting', 'error', 'reconnecting', 'unknown'] as const;

/**
 * Type representing all possible connector statuses.
 */
export type Status = (typeof STATUSES)[number];

/**
 * Health check result for a connector.
 *
 * @property status - Current status of the connector.
 * @property connected - Whether the connector is connected.
 * @property details - Additional health data.
 */
export type HealthCheck = {
	status: Status | undefined;
	connected: boolean | undefined;
	details?: Record<string, unknown>;
};

/**
 * Connector info returned by connect().
 */
export type ConnectorInfo = {
	name: string;
	healthCheck: () => Promise<HealthCheck> | HealthCheck;
};

/**
 * Interface for a connector with connect/disconnect lifecycle.
 */
export type Connector<Connection = unknown> = {
	connect: () => Promise<ConnectorInfo> | ConnectorInfo;
	disconnect: () => Promise<void> | void;
	getConnection: () => Connection;
};

/**
 * Factory function type for creating connectors.
 * @template ConnectorConfig - Configuration type for the connector.
 * @param config - Connector configuration.
 * @param logger - Logger instance for logging.
 * @returns The created connector instance.
 */
export type ConnectorFactory<ConnectorConfig = Record<string, unknown>, Connection = unknown> = (
	logger: Logger,
	config: ConnectorConfig
) => Connector<Connection>;
