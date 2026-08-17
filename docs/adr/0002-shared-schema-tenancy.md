# ADR-0002: Use Shared-Schema Tenancy in Commerce Core

- Status: Accepted
- Date: 2026-08-17

## Context and problem

NexusFlow begins with one company and multiple warehouses, but the domain must not assume that all data belongs to one permanent global tenant. Future organizations must not be able to read or mutate each other's catalog, inventory, orders, employees, or operational records.

The modular-monolith phase needs a tenancy model that is explicit enough to protect ownership without introducing a separate database or schema for every organization before the product flow is established.

## Decision drivers

- Make tenant ownership visible in the data model from the beginning.
- Prevent accidental cross-organization access in application use cases and repositories.
- Keep local development, migrations, reporting, and transactions manageable during the modular-monolith phase.
- Support composite database constraints that include tenant identity.
- Avoid premature operational complexity for a portfolio deployment with limited resources.
- Preserve a path toward stronger isolation if measured security or operational needs justify it.

## Considered options

### One database per organization

This provides a strong physical isolation boundary. It is not selected initially because provisioning, migrations, connection management, backups, and cross-tenant operations become significantly more complex before self-service organization provisioning exists.

### One PostgreSQL schema per organization

This gives more separation than shared tables while retaining one server. It is not selected initially because schema lifecycle and migration coordination add operational complexity without removing the need for correct application authorization.

### Shared schema with tenant identifiers

Tenant-owned rows share relational tables and carry an `organizationId`. Application policies, repository queries, and composite database constraints preserve tenant scope.

### Shared schema with PostgreSQL Row-Level Security immediately

Row-Level Security can add defense in depth. It is deferred because connection/session context and policy behavior would obscure the application-level isolation rules that must first be implemented and verified. It may be added later; it must not replace application authorization.

## Decision

Commerce Core will use a shared PostgreSQL schema during the modular-monolith phase.

The tenancy rules are:

- Every tenant-owned aggregate and record includes an `organizationId`.
- Repository and application operations require explicit organization scope.
- Tenant scope comes from authenticated server-side context, not from an untrusted client choice alone.
- Unique constraints for tenant-owned business identifiers include `organizationId` when uniqueness is tenant-local.
- Relationships between tenant-owned records use composite constraints where practical to prevent cross-tenant references.
- Authorization policies verify membership, role, organization, and resource ownership as required by the use case.
- Cache keys, jobs, events, logs, object-storage keys, and WebSocket rooms include tenant context where applicable.
- Global records are allowed only when their cross-tenant ownership is deliberate and documented.
- OAuth authentication never grants privileged operational roles automatically.
- PostgreSQL Row-Level Security may later provide defense in depth after application-level isolation is understood and tested.

Self-service organization provisioning is not part of the initial product phase.

## Positive consequences

- Tenant ownership is represented consistently without multiplying databases or schemas.
- Local transactions and migrations remain straightforward during early development.
- Composite keys and constraints can prevent important cross-tenant data mistakes.
- Repository and policy tests can demonstrate isolation behavior directly.
- The model supports more than one organization without requiring the first release to expose organization provisioning.

## Negative consequences and trade-offs

- A missing organization predicate can expose or modify another tenant's data.
- Shared infrastructure creates a larger blast radius than database-per-tenant isolation.
- Database administrators and sufficiently privileged application connections can access all tenants.
- Every cache, message, job, and read model must preserve tenant context deliberately.
- Tenant-wide backup, restore, and deletion are more complex than dropping an isolated database.

These risks are addressed through scoped repository APIs, authorization policies, composite constraints, targeted isolation tests, least-privilege credentials, and later consideration of Row-Level Security.

## Revisit triggers

Reconsider the tenancy storage model when one or more of the following become real requirements:

- Regulatory or contractual rules require stronger physical isolation.
- Individual tenants require independent backup, restore, encryption, residency, or maintenance schedules.
- A tenant's workload creates unacceptable noisy-neighbor behavior.
- The product introduces self-service provisioning at a scale that justifies automated database or schema lifecycle management.
- Application-level isolation is verified and Row-Level Security would materially reduce residual risk.

A future change must include a migration strategy, connection-routing design, operational cost analysis, and explicit authorization behavior. Physical isolation must not be treated as a substitute for correct access control.
