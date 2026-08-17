# ADR-0001: Start with a Modular Monolith

- Status: Accepted
- Date: 2026-08-17

## Context and problem

NexusFlow coordinates commerce, inventory, payment, warehouse fulfillment, delivery, notifications, and operational visibility. These areas have different business responsibilities and may eventually require independent deployment and data ownership.

Starting with independently deployed services would introduce network failures, message delivery semantics, distributed tracing, cross-service consistency, and operational overhead before the core business rules are proven. A single unstructured application would avoid that operational cost, but it would allow responsibilities and data ownership to become tangled.

The project needs an initial architecture that keeps local development and transactions understandable while preserving meaningful business boundaries for later extraction.

## Decision drivers

- Make transaction boundaries and business invariants visible before introducing distributed consistency.
- Keep the initial development and deployment model practical for one developer and a resource-constrained environment.
- Preserve explicit ownership for inventory, fulfillment, delivery, and other business capabilities.
- Establish observable baseline behavior before moving a boundary across a network.
- Learn service extraction from demonstrated pressure rather than from an arbitrary service-count target.
- Avoid paying the operational cost of distributed systems before it solves a measured problem.

## Considered options

### Independently deployed services from the beginning

This option gives strong process and deployment isolation early. It was rejected for the initial phase because even simple business changes would immediately require remote contracts, message reliability, service discovery, distributed diagnostics, and eventual-consistency handling. Those concerns would obscure the domain rules that the project must establish first.

### A single unstructured monolith

This option provides simple deployment and local transactions. It was rejected because unrestricted dependencies and shared data access would blur ownership, make business rules difficult to locate, and make later extraction unnecessarily risky.

### A modular monolith with a separate worker

This option retains simple local execution while defining explicit business modules and dependency boundaries. Background and delayed work can run in a separate worker without prematurely distributing every domain capability.

## Decision

NexusFlow will begin as a layered modular monolith with a separate worker.

The initial application will follow these rules:

- Business capabilities are organized into explicit modules with documented ownership.
- Domain code does not depend on NestJS, databases, queues, transport protocols, or provider SDKs.
- Presentation calls application use cases; application logic coordinates domain behavior and infrastructure ports.
- A shared PostgreSQL schema may be used initially, but one module must not treat another module's data as freely writable state.
- PostgreSQL remains the durable source of truth for local business state.
- BullMQ is used for delayed and background jobs; it is not treated as a service-to-service event bus.
- RabbitMQ is introduced for commands and events when independently deployed service boundaries exist.
- The initial deployable units are the modular application and the worker, plus their infrastructure dependencies.

The system will not extract a module merely to increase the number of services. Before extraction, the project must have a working local flow, explicit ownership, observable failure behavior, and baseline behavior tests or verification scenarios.

## Positive consequences

- Core business rules and local transaction boundaries are easier to understand and debug.
- Development, testing, and initial deployment require fewer moving parts.
- Inventory, fulfillment, and delivery boundaries can be modeled before network concerns are introduced.
- Later extraction can be compared against known behavior instead of being treated as a rewrite without a baseline.
- The project can demonstrate why a service boundary became valuable.

## Negative consequences and trade-offs

- Module boundaries are enforced mainly through code structure and team discipline rather than process isolation.
- A shared database makes accidental cross-module coupling technically possible.
- Some boundaries will require deliberate refactoring when they become remote.
- The application and worker may initially scale as larger units than strictly necessary.
- Local transactions can hide distributed-consistency problems until extraction work begins.

These trade-offs are accepted because the roadmap explicitly includes contract definition, reliable messaging, idempotency, and failure verification before and during extraction.

## Revisit triggers

Reconsider the deployment boundary of a module when one or more of the following are demonstrated:

- It requires independent scaling or deployment for measured operational reasons.
- Its failure must be isolated from the Commerce Core runtime.
- Its data ownership and transaction boundary are stable and explicit.
- Its remote command and event contracts can be versioned and tested.
- Outbox publication, Inbox/idempotent consumption, retries, and dead-letter handling are available.
- Baseline behavior tests can prove that extraction preserves business outcomes.

The first planned extraction candidate is Inventory, followed by Delivery and Fulfillment. The order may be revisited only when repository evidence shows a stronger boundary or operational need.
