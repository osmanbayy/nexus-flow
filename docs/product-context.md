# NexusFlow Product Context

## Purpose

NexusFlow is a multi-warehouse commerce and logistics orchestration platform. It coordinates the journey from customer checkout to verified delivery while making failures, retries, and operational exceptions visible.

## Problem

Commerce operations cross several consistency boundaries:

- Stock may become unavailable while a customer is checking out.
- Payment may succeed, fail, time out, or report its result late.
- Warehouse staff may discover missing or damaged stock.
- Courier assignment and delivery may be delayed or interrupted.
- Notifications may fail even though the business operation succeeded.

NexusFlow must preserve valid business state across these situations without overselling stock, duplicating side effects, or hiding failures from operators.

## Product outcomes

1. Provide a complete storefront and order journey for customers.
2. Coordinate inventory, warehouse fulfillment, and delivery operations.
3. Give operators visibility into delayed, failed, and recoverable work.
4. Demonstrate production-grade reasoning about transactions, concurrency, messaging, idempotency, and recovery.

## Primary actors

| Actor | Primary responsibility |
| --- | --- |
| Customer | Browse products, manage a cart, check out, pay, track, cancel, return, review, and ask product questions. |
| Admin | Manage the organization, catalog, warehouses, employees, operational exceptions, and analytics. |
| Warehouse Staff | Pick, pack, report missing items, and hand shipments to couriers for assigned warehouses. |
| Courier | Accept assigned work, publish location, deliver shipments, and verify delivery. |

## Core journey

1. A customer builds a cart.
2. An authenticated cart reserves eligible stock for a limited time.
3. Checkout calculates and snapshots commercial values.
4. Payment is authorized through a provider-neutral boundary.
5. A valid order starts warehouse fulfillment.
6. Warehouse staff pick and pack the shipment.
7. An eligible courier is assigned.
8. The customer tracks delivery.
9. A single-use code verifies completion.

## Foundational constraints

- The initial currency is TRY.
- Monetary values are stored as integer kurus.
- Tenant-owned records are scoped by `organizationId`.
- Timestamps are persisted in UTC.
- PostgreSQL is the durable source of truth.
- WebSocket messages provide immediacy but are not durable truth.
- The system begins as a modular monolith with a separate worker.
- Service extraction happens only after boundaries and failure modes are demonstrated.
- Expected duplicate delivery is handled through idempotent business behavior.
- A failed notification must not invalidate a successful order.

## Initial scope

The roadmap includes:

- Identity and organization access
- Catalog and storefront
- Cart and expiring inventory reservations
- Pricing, coupons, and shipping quotes
- Payment and order management
- Warehouse fulfillment
- Courier assignment and live delivery
- Notifications and operations visibility
- Reliable integration messaging
- Selective service extraction
- Observability and failure simulation

## Deferred scope

The following capabilities are deliberately deferred until the core journey is stable:

- Split fulfillment across multiple warehouses
- Multi-stop courier routing
- Full return logistics
- OpenSearch
- Behavior-based recommendations
- Extracted services
- Distributed tracing
- Chaos tooling
- Deployment automation

## Non-goals

The initial product does not include:

- Multi-currency commerce
- Marketplace sellers and payouts
- Native mobile applications
- Kafka
- Full Event Sourcing
- Kubernetes
- Custom role builders
- General-purpose business intelligence
- Real production payment capture

## Success evidence

The finished system must demonstrate observable behavior for concurrency, retries, duplicate messages, delayed callbacks, process restarts, compensation, WebSocket recovery, and tenant isolation.
