# Zero Trust ABAC Access Control System

A comprehensive, type-safe, Zero Trust Attribute-Based Access Control (ABAC) system built for TypeScript/Nx/MongoDB environments. This system provides policy-based access control with comprehensive audit logging and real-time security monitoring.

## 🏗️ Architecture

### Core Components

1. **ResourceRegistry Pattern**: Type-safe, extensible resource management
2. **Policy-Based Access Control**: Flexible, reusable policy system
3. **Zero Trust Environment**: Context-aware security evaluation
4. **Comprehensive Audit Logging**: Complete access trail with analytics
5. **Real-time Monitoring**: Suspicious activity detection

### Key Features

- ✅ **Type-Safe**: Full TypeScript support with strict typing
- ✅ **Zero Trust**: Environment-based security evaluation
- ✅ **Policy-Based**: Reusable policies referenced by ID
- ✅ **Audit Complete**: Comprehensive logging and analytics
- ✅ **Real-time Monitoring**: Suspicious activity detection
- ✅ **MongoDB Native**: Optimized for MongoDB with proper indexing
- ✅ **Extensible**: Easy to add new resource types and conditions
- ✅ **Performance**: Optimized queries and caching-ready

## 📁 Project Structure

```
domains/access-control/
├── src/
│   ├── constants/           # All enums and constants
│   ├── types/              # TypeScript type definitions
│   ├── schemas/            # MongoDB schemas
│   ├── services/           # Business logic services
│   └── index.ts           # Main exports
```

## 🚀 Quick Start

### Installation

```bash
# Install dependencies (run from monorepo root)
yarn install
```

### Basic Usage

```typescript
import { 
  accessControlService, 
  auditService, 
  PolicyService,
  WORKSPACE_ACTIONS,
  PROJECT_ACTIONS 
} from '@visionarai-one/access-control';

// Check access permission
const result = await accessControlService.checkPermission(
  {
    _id: 'user_123',
    type: 'user',
    workspaceId: 'workspace_456',
    clearanceLevel: 5,
  },
  {
    _id: 'workspace_456',
    type: 'workspace',
    name: 'Engineering Team',
    visibility: 'private',
    securityLevel: 'high',
  },
  WORKSPACE_ACTIONS.READ,
  {
    ip: '192.168.1.100',
    userAgent: 'Mozilla/5.0...',
    timestamp: new Date(),
    location: { country: 'US', region: 'CA' },
    networkType: 'internal',
  }
);

console.log(result.decision); // true/false
console.log(result.reason);   // Explanation
```

## 📊 System Components

### 1. Resource Registry

The `ResourceRegistry` provides type-safe resource management:

```typescript
// Current supported resources
interface ResourceRegistry {
  workspace: WorkspaceResource;
  project: ProjectResource;
  // Easily extensible for new resource types
}
```

### 2. Policy System

Policies are stored as separate documents and referenced by ID:

```typescript
interface Policy {
  _id: string;
  name: string;
  permissions: {
    workspace?: {
      actions: string[];
      operations?: string[];
    };
    project?: {
      actions: string[];
      operations?: string[];
    };
  };
  conditions?: ConditionGroup[];
  isActive: boolean;
}
```

### 3. Access Control Service

Core service for permission evaluation:

```typescript
class AccessControlService {
  async checkPermission(
    subject: Subject,
    resource: WorkspaceResource | ProjectResource,
    action: string,
    environment: Environment
  ): Promise<AccessControlResult>
}
```

### 4. Audit Service

Comprehensive audit logging and analytics:

```typescript
class AuditService {
  async queryAuditLogs(filter: AuditLogFilter): Promise<AuditLogResult>
  async getBasicStatistics(): Promise<AuditStatistics>
  async getSubjectAuditTrail(subjectId: string): Promise<AuditLogEntry[]>
  async cleanupOldLogs(retentionDays: number): Promise<{deletedCount: number}>
}
```

## 🔒 Security Features

### Zero Trust Principles

- **Never Trust, Always Verify**: Every request is evaluated
- **Principle of Least Privilege**: Minimal access by default
- **Context-Aware**: Environment factors in decisions
- **Continuous Monitoring**: Real-time activity tracking

### Environment Context

The system evaluates multiple environmental factors:

```typescript
interface Environment {
  ip: string;
  userAgent?: string;
  timestamp: Date;
  location?: {
    country?: string;
    region?: string;
    city?: string;
  };
  networkType?: 'internal' | 'external' | 'vpn';
  deviceFingerprint?: string;
  riskScore?: number;
}
```

### Condition System

Flexible condition evaluation with support for:

- **Field-based conditions**: `subject.clearanceLevel >= 5`
- **Logical operators**: AND, OR, NOT
- **Comparison operators**: equals, contains, regex, etc.
- **Nested conditions**: Complex logical expressions

## 📈 Monitoring & Analytics

### Audit Logging

Every access decision is logged with:

- **Who**: Subject details and attributes
- **What**: Resource and action requested
- **When**: Timestamp and evaluation time
- **Where**: Environment context (IP, location, etc.)
- **Why**: Policy decisions and condition results
- **How**: Detailed evaluation trace

### Real-time Monitoring

The system provides:

- **Basic Statistics**: Request counts, success rates
- **Suspicious Activity Detection**: Pattern recognition
- **Performance Metrics**: Evaluation times, bottlenecks
- **Audit Trail**: Complete access history

## 🛠️ Development

### Adding New Resource Types

1. **Define the resource interface** in `types/resources.ts`
2. **Add to ResourceRegistry** in `types/resource-registry.ts`
3. **Create MongoDB schema** in `schemas/`
4. **Update constants** for actions and operations
5. **Update access control service** for resource-specific logic

### Adding New Condition Operators

1. **Add operator constant** in `constants/index.ts`
2. **Implement comparison logic** in `AccessControlService.compareValues()`
3. **Update type definitions** if needed

### Testing

```bash
# Run tests
nx test access-control

# Run with coverage
nx test access-control --coverage

# Run specific test files
nx test access-control --testNamePattern="PolicyService"
```

## 📝 API Documentation

### Core Services

#### AccessControlService

| Method | Description | Parameters | Returns |
|--------|-------------|------------|---------|
| `checkPermission()` | Check if subject can perform action | `subject`, `resource`, `action`, `environment` | `AccessControlResult` |

#### PolicyService

| Method | Description | Parameters | Returns |
|--------|-------------|------------|---------|
| `createPolicy()` | Create new policy | `policy` | `Policy` |
| `updatePolicy()` | Update existing policy | `id`, `updates` | `Policy` |
| `deletePolicy()` | Delete policy | `id` | `void` |
| `listPolicies()` | List policies with filters | `filter`, `pagination` | `PolicyListResult` |

#### AuditService

| Method | Description | Parameters | Returns |
|--------|-------------|------------|---------|
| `queryAuditLogs()` | Query audit logs | `filter` | `AuditLogResult` |
| `getBasicStatistics()` | Get audit statistics | `fromDate?`, `toDate?` | `AuditStatistics` |
| `getSubjectAuditTrail()` | Get logs for subject | `subjectId`, `limit?`, `offset?` | `AuditLogEntry[]` |

## 🚦 Performance Considerations

### Database Indexes

The system includes optimized MongoDB indexes:

- **Audit Logs**: Timestamp, subject, resource, decision
- **Policies**: Active status, tags, expiration
- **Workspaces**: Members, security level
- **Projects**: Contributors, workspace relationship

### Caching Strategy

Recommended caching approach:

- **Policy Cache**: Cache active policies (TTL: 5-15 minutes)
- **Resource Cache**: Cache resource metadata (TTL: 30 minutes)
- **Negative Cache**: Cache denied decisions briefly (TTL: 1 minute)

## � API Reference

### Zod Validation Schemas

**Validation Schemas:**
- `policyValidationSchema` - Validates policy creation/update data
- `workspaceValidationSchema` - Validates workspace data
- `projectValidationSchema` - Validates project data
- `auditLogValidationSchema` - Validates audit log entries
- `memberValidationSchema` - Validates member data

**Query Validation:**
- `policyQueryValidationSchema` - Validates policy query parameters
- `auditQueryValidationSchema` - Validates audit query parameters
- `accessCheckValidationSchema` - Validates access check requests

**Validation Helpers:**
- `validatePolicyWithZod(data)` - Validates policy data with Zod
- `validateWorkspaceWithZod(data)` - Validates workspace data with Zod
- `validateProjectWithZod(data)` - Validates project data with Zod
- `getFieldError(result, fieldPath)` - Gets specific field error
- `getAllFieldErrors(result)` - Gets all validation errors

**Type Definitions:**
- `PolicyValidationInput` - Input type for policy validation
- `WorkspaceValidationInput` - Input type for workspace validation
- `ProjectValidationInput` - Input type for project validation

### Admin UI Helpers

**Form Field Options:**
- `policyEffectOptions` - Policy effect dropdown options
- `workspaceActionOptions` - Workspace action dropdown options
- `projectActionOptions` - Project action dropdown options
- `comparisonOperatorOptions` - Comparison operator dropdown options
- `logicalOperatorOptions` - Logical operator dropdown options
- `memberTypeOptions` - Member type dropdown options

**Formatting Utilities:**
- `formatPolicyEffect(effect)` - Format policy effect for display
- `formatAction(action)` - Format action for display
- `formatComparisonOperator(operator)` - Format operator for display
- `formatDate(date)` - Format date for display
- `formatRelativeTime(date)` - Format relative time

**React Hook Form Helpers:**
- `getActionsForResourceType(resourceType)` - Get valid actions for resource
- `getOperatorsForDataType(dataType)` - Get operators for data type
- `commonContextFields` - Common context field suggestions
- `defaultPolicyFormValues` - Default policy form values
- `getValidationErrorMessage(error)` - Get user-friendly error message

### Core Services

**Policy Service:**
- `createPolicy(policyData)` - Create a new policy
- `getPolicyById(id)` - Get policy by ID
- `updatePolicy(id, updates)` - Update existing policy
- `deletePolicy(id)` - Delete policy
- `listPolicies(filters)` - List policies with filtering
- `validatePolicy(policyData)` - Validate policy structure
- `clonePolicy(id, newName)` - Clone existing policy

**Access Control Service:**
- `checkAccess(request)` - Check if access should be granted
- `evaluatePolicy(policy, context)` - Evaluate a single policy
- `evaluateConditionGroup(group, context)` - Evaluate condition group

**Audit Service:**
- `writeAuditLog(entry)` - Write audit log entry
- `queryAuditLogs(filters)` - Query audit logs
- `getAuditStatistics(filters)` - Get audit statistics
- `detectSuspiciousActivity()` - Detect suspicious patterns

## �🔮 Future Enhancements

### Planned Features

- [x] **Admin UI Integration**: React components with Zod validation
- [ ] **Policy Templates**: Pre-built policy templates
- [ ] **Machine Learning**: AI-powered risk scoring
- [ ] **Federation**: Multi-tenant policy sharing
- [ ] **GraphQL API**: Alternative query interface
- [ ] **Webhook Support**: Real-time event notifications
- [ ] **Policy Versioning**: Track policy changes over time
- [ ] **Bulk Operations**: Efficient batch processing

### Extensibility

The system is designed for easy extension:

- **New Resource Types**: Add to ResourceRegistry
- **Custom Conditions**: Extend condition operators
- **Plugin Architecture**: Custom evaluation logic
- **External Integrations**: LDAP, SAML, OAuth providers

## 📄 License

MIT License - See LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📞 Support

For questions and support:

- Create an issue in the repository
- Check the documentation and examples
- Review the test files for usage patterns

---

Built with ❤️ for the Visionarai ecosystem
