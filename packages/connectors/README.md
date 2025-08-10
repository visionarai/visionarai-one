
# @visionarai-one/connectors

> Robust, extensible connector framework for data sources in the visionarai-one ecosystem.

## Overview

`@visionarai-one/connectors` provides a unified, type-safe interface for connecting to external data sources, with a focus on reliability, health monitoring, and easy integration. It is designed for use in scalable data ingestion pipelines and services.

### Features

- **Connector Factory Pattern**: Create connectors for any data source with a consistent API.
- **Health Checks**: Built-in health status reporting for all connectors.
- **MongoDB Connector**: Production-ready connector using Mongoose, with lifecycle management and health reporting.
- **Extensible**: Add new connectors by implementing the factory interface.
- **TypeScript-first**: Strong types for configs, connections, and health checks.

## Usage

### Example: MongoDB Connector

```typescript
import { createMongoDBConnector } from '@visionarai-one/connectors';
import pino from 'pino';

const logger = pino();
const mongoConfig = {
  uri: 'mongodb://localhost:27017/mydb',
  options: { useNewUrlParser: true, useUnifiedTopology: true },
};

const mongoConnector = createMongoDBConnector(logger, mongoConfig);

// Connect to MongoDB
const info = await mongoConnector.connect();
console.log('Health:', await info.healthCheck());

// Disconnect when done
await mongoConnector.disconnect();
```

## API

### ConnectorFactory

```typescript
type ConnectorFactory<Config, Connection> = (logger, config) => Connector<Connection>;
```

### Connector

```typescript
type Connector<Connection> = {
  connect(): Promise<ConnectorInfo>;
  disconnect(): Promise<void>;
  getConnection(): Connection;
};
```

### HealthCheck

```typescript
type HealthCheck = {
  status: Status;
  connected: boolean;
  details?: Record<string, unknown>;
};
```

## Extending

To add a new connector, implement the `ConnectorFactory` interface and export it from `src/lib/`.

## Project Structure

- `src/lib/`: Connector implementations (e.g., MongoDB)
- `src/connector-factory/`: Core types and factory pattern
- `src/index.ts`: Entry point

## Admonitions

> [!NOTE]
> This package is part of the visionarai-one monorepo. For shared utilities, see `@visionarai-one/utils`.

> [!TIP]
> Use the health check API to monitor connector status in production environments.

## Resources

- [Mongoose](https://mongoosejs.com/)

