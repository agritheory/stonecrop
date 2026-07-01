---
title: Custom Fetch Handlers
description: How to implement and register FetchHandler callbacks for the custom fetch strategy
---

# Custom Fetch Handlers

The `custom` fetch strategy lets you implement any data-fetching logic for a link that a plain `SELECT … WHERE backlink = $1` cannot express.

---

## When to use `custom`

Use `custom` when the data you need for a link cannot be satisfied by a single parameterised query against one table. Common cases:

- Aggregated data (e.g. sum of line item amounts, count of open tasks)
- Multi-table joins that aren't modelled as separate doctypes
- Data that comes from a different schema or a materialised view
- Business logic that gates which related records are visible

If your link is a simple foreign-key relationship, use `sync` or `lazy` instead — both are handled automatically by the middleware without any handler code.

---

## The `FetchHandler` signature

```typescript
import type { FetchHandler } from '@stonecrop/graphql-middleware'

const myHandler: FetchHandler = async (pgClient, parentRecord, link) => {
  // pgClient     — active PgClient from the current Grafast execution context
  // parentRecord — the already-fetched parent record as a plain object
  // link         — the LinkDeclaration from the doctype schema

  return [] // return a record or array of records
}
```

The return type depends on the link's cardinality:
- `atMostOne` or `one` → return a single record object (or `null`)
- `noneOrMany` or `atLeastOne` → return an array of record objects

---

## Registering a handler

```typescript
import { registerFetchHandler } from '@stonecrop/graphql-middleware'

registerFetchHandler('loadLineItemSummary', async (pgClient, parentRecord) => {
  const { rows } = await pgClient.query({
    text: `
      SELECT
        COUNT(*)::text                         AS item_count,
        COALESCE(SUM(unit_price * qty), 0)::text AS total_amount
      FROM line_items
      WHERE order_id = $1
    `,
    values: [parentRecord.id],
  })
  return rows[0] ?? null
})
```

Register handlers before the GraphQL schema is built. The handler name must match exactly what you put in the doctype's `fetch.handler` field.

---

## Wiring the handler to a link

In your doctype JSON:

```json
{
  "name": "Order",
  "fields": [
    { "fieldname": "id", "fieldtype": "Data" },
    { "fieldname": "status", "fieldtype": "Select" }
  ],
  "links": {
    "summary": {
      "target": "order-summary",
      "cardinality": "atMostOne",
      "fetch": {
        "method": "custom",
        "handler": "loadLineItemSummary"
      }
    }
  }
}
```

When `stonecropRecord` resolves an `Order`, it looks up `"loadLineItemSummary"` in the fetch handler registry and calls it. The result is merged into `data.summary` on the response.

---

## Worked example: aggregated order summary

A sales order has many line items. The frontend needs a single-record summary (total amount, item count) rather than the full list.

```typescript
import { registerFetchHandler } from '@stonecrop/graphql-middleware'

registerFetchHandler('orderSummary', async (pgClient, parentRecord) => {
  const { rows } = await pgClient.query<{
    item_count: string
    total_amount: string
  }>({
    text: `
      SELECT
        COUNT(*)::text                              AS item_count,
        COALESCE(SUM(unit_price * qty), 0)::text   AS total_amount
      FROM sales_order_items
      WHERE sales_order_id = $1
    `,
    values: [parentRecord.id],
  })

  const row = rows[0]
  if (!row) return null

  return {
    itemCount: parseInt(row.item_count, 10),
    totalAmount: parseFloat(row.total_amount),
  }
})
```

Doctype:

```json
{
  "links": {
    "summary": {
      "target": "sales-order-summary",
      "cardinality": "atMostOne",
      "fetch": { "method": "custom", "handler": "orderSummary" }
    }
  }
}
```

---

## Common mistakes

**Wrong return shape for the cardinality.** If the link has `cardinality: "noneOrMany"` but the handler returns a single object instead of an array, the client will receive an object where it expects a list. Always return an array for many-links, a single record (or `null`) for one-links.

**Issuing transactions inside the handler.** The `pgClient` is already inside an active transaction managed by Grafast. Do not call `BEGIN`, `COMMIT`, or `ROLLBACK` inside a fetch handler — doing so will corrupt the transaction state.

**Registering handlers after schema build.** Handlers must be registered before PostGraphile builds the schema. If you register a handler after the server starts, it will not be found when the resolver runs. Register all handlers in your application bootstrap, alongside `loadDoctypes` and `registerBuiltinHandlers`.
