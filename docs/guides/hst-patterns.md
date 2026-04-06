---
title: HST Data Patterns
description: Common patterns for working with the Hierarchical State Tree (HST) in Stonecrop
---

# HST Data Patterns

The Hierarchical State Tree (HST) stores form data as flat paths, but APIs typically expect nested objects. This guide covers common patterns for working with HST data.

---

## HST Path Structure

HST stores values at dot-separated paths:

```
customer.123.name = "John Doe"
customer.123.address.street = "123 Main St"
customer.123.address.city = "Portland"
customer.123.address.phones = [{ number: "555-1234" }, { number: "555-5678" }]
```

---

## Collecting Data for API Submission

Use `collectRecordPayload` to gather all nested data from HST into a single object ready for API submission.

### When to Use

Call `collectRecordPayload` in your doctype's **save action** defined in the workflow. This keeps the framework opinion-free about persistence while providing the infrastructure to assemble nested records.

### Example: Save Action in Workflow

```typescript
import { Doctype, getStonecrop } from '@stonecrop/stonecrop'
import { List, Map } from 'immutable'
import { apiClient } from './api-client'

const customerDoctype = new Doctype(
  'Customer',
  List([
    { fieldname: 'name', fieldtype: 'Data', component: 'ATextInput' },
  ]),
  {
    id: 'customer',
    initial: 'draft',
    states: {
      draft: {
        on: {
          submit: { target: 'submitted', actions: ['saveRecord'] }
        }
      },
      submitted: { type: 'final' }
    }
  },
  Map({
    submit: ['validateData', 'saveRecord'],
  }),
  undefined,
  {
    address: { target: 'address', cardinality: 'one' },
  }
)

// Register the action handler — runs outside Vue, so use getStonecrop()
async function saveRecord(args: unknown[]) {
  const stonecrop = getStonecrop()
  const recordId = args?.[0] as string
  if (!recordId || !stonecrop) return

  // Collect all nested data into a single payload
  const payload = stonecrop.collectRecordPayload(customerDoctype, recordId)

  // Send to your API
  await apiClient.save('/customers', payload)
}
```

---

## How It Works

Given a doctype with scalar fields and a `links` object declaring relationships:

```typescript
// fields (scalars only):
[
  { fieldname: 'name', fieldtype: 'Data' },
]

// links object:
{
  address: { target: 'address', cardinality: 'one' },        // 1:1
  orders:  { target: 'order',   cardinality: 'noneOrMany' }, // 1:many
}
```

With HST containing:

```
customer.123.name = "Acme Corp"
customer.123.address.street = "123 Main St"
customer.123.address.city = "Portland"
customer.123.orders = [{ total: 100 }, { total: 250 }]
```

`collectRecordPayload` returns:

```json
{
  "name": "Acme Corp",
  "address": {
    "street": "123 Main St",
    "city": "Portland"
  },
  "orders": [
    { "total": 100 },
    { "total": 250 }
  ]
}
```

---

## Modifying the Payload

Since `collectRecordPayload` returns a plain object, you can modify it before sending:

```typescript
const payload = collectRecordPayload(doctype, recordId)

// Add metadata
payload._version = 2
payload._savedAt = new Date().toISOString()

// Remove sensitive fields
delete payload.internalNotes

// Transform for legacy API
payload.address = `${payload.address.street}, ${payload.address.city}`

await apiClient.save(payload)
```
