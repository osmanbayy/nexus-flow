# NexusFlow Glossary

| Term | Definition |
| --- | --- |
| Organization | The tenant that owns business data, warehouses, employees, and operational policies. |
| User | A human identity that can authenticate with NexusFlow. |
| Membership | The relationship connecting a user to an organization and its role. |
| Customer | A user who performs storefront and order activities. |
| Admin | A privileged organization member responsible for management and operational exceptions. |
| Warehouse Staff | An organization member assigned to perform fulfillment work for permitted warehouses. |
| Courier | A delivery worker with availability, capacity, and shipment assignments. |
| Product | The customer-facing commercial description shared by its purchasable variants. |
| Product Variant | A purchasable configuration of a product, such as a size or color. |
| SKU | The unique stock-keeping identifier for a product variant. |
| Warehouse | A physical inventory and fulfillment location. |
| Service Area | A geographic area that a warehouse is eligible to serve. |
| Inventory Balance | The current quantity summary for one SKU at one warehouse. |
| Stock Movement | An immutable record explaining why an inventory quantity changed. |
| Reservation | A time-bounded claim on inventory for an authenticated cart. It is not an order. |
| Guest Cart | A client-side cart that does not reserve inventory. |
| Authenticated Cart | A server-side user cart that may hold a cart-wide inventory reservation. |
| Shipping Quote | A time-bounded calculation of shipping cost and eligibility. |
| Payment Attempt | One provider interaction identified independently for idempotency and reconciliation. |
| Order | The commercial agreement containing price, discount, tax, shipping, and item snapshots. |
| Order Item Snapshot | The immutable commercial details captured for an order line at checkout. |
| Shipment | The physical fulfillment and delivery unit associated with an order. |
| Fulfillment Task | Warehouse work required to pick, pack, or hand off a shipment. |
| Delivery Assignment | The active relationship between a courier and a shipment. |
| Delivery Code | A hashed, shipment-specific, attempt-limited, single-use proof of delivery. |
| Domain Event | A fact relevant inside a domain/application runtime. |
| Integration Event | A versioned fact published across independently deployed boundaries. |
| Command | A request for a specific action that may be accepted or rejected. |
| Saga | A durable coordinator for a multi-step business flow and its compensations. |
| Compensation | A business action that counteracts a previously completed Saga step. |
| Outbox | Durable records that connect a local database change to later message publication. |
| Inbox | Consumer-side records that prevent duplicate message delivery from causing duplicate effects. |
| Idempotency | The property that repeating the same logical operation produces one intended business effect. |
| Notification | Persistent user-facing information whose delivery failure does not invalidate the originating business operation. |
| Read Model | A query-oriented projection that is not authoritative for stock, payment, or authorization decisions. |
