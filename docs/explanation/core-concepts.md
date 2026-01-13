---
title: Core Concepts
description: Foundational concepts in Stonecrop's architecture
---

# Core Concepts

This document explains the foundational concepts that underpin Stonecrop's architecture.

## Hierarchical State Tree (HST)

The Hierarchical State Tree (HST) is Stonecrop's core state management system. It addresses a fundamental challenge in business applications: how do you manage state for dozens of different entity types, each with their own records, in a way that's both organized and reactive?

### Why a Tree?

A tree structure provides specific advantages for reactive state management:

**Scoped reactivity.** A tree lets you subscribe at any level of granularity. A component can watch a single field (`Todo.123.title`), an entire record (`Todo.123`), or all records of a type (`Todo`). The subscription scope maps directly to tree depth. A flat key-value store doesn't give you this naturally—you'd need to implement prefix matching or maintain parallel subscription registries.

**Lifecycle as structure.** When a record is created, you create a subtree. When it's deleted, the subtree goes with it. All nested state—child tables, computed caches, UI state—cleans up automatically. In a flat store, you'd need to track which keys belong to which logical entity and coordinate their cleanup manually.

**Single canonical location.** Every datum has exactly one address. This avoids the normalization problem where the same entity might appear in multiple places (a user in `users`, the same user in `currentOrder.customer`, again in `recentActivity[3].actor`) and you need to keep them synchronized. With the HST, data lives in one place and references point to that place.

**GraphQL alignment.** GraphQL responses are tree-shaped. If your client state is also tree-shaped, hydration is direct assignment rather than a normalization step. You don't flatten the response into a normalized cache and reconstruct it on read—the response shape matches the state shape.

The HST organizes data by path: `doctype.recordId.fieldname`. This addressing scheme reflects these structural choices. "The title of Todo 123" becomes `Todo.123.title`. Any piece of data has exactly one canonical location—no hunting through nested stores or wondering which module owns what.


### Reactivity Without Boilerplate

Vue's reactivity system is powerful, but wiring it up for complex nested data gets tedious. The HST handles this automatically. When you change a value through the HST, Vue components watching that path update. You don't write watchers, you don't manage subscriptions—reactivity is built into the data layer.

The `useStonecrop` composable bridges Vue components to the HST leveraging the `v-model` directive. It provides a `formData` ref that stays synchronized with the store, handles nested path updates, and ensures Vue's change detection triggers correctly. Components can read and write through normal Vue patterns; the HST handles the complexity underneath.

### Why Not Just Use Pinia Directly?

You could build something similar with raw Pinia stores. But you'd end up reinventing a lot:

- Path-based access (navigating nested state by string paths)
- Automatic store sections per doctype
- Integration with operation logging
- Consistent patterns across every entity type

The HST codifies these patterns. Instead of each developer making different choices about state structure, everyone works with the same tree. This consistency pays dividends in debugging, testing, and onboarding.

### Path Structure

HST uses dot-notation paths:

```
doctype.recordId.fieldname
```

For example:
- `Todo.123.title` — The title field of Todo record 123
- `User.abc.profile.email` — Nested email in user profile
- `Order.456.items.0.quantity` — First item's quantity in an order

Paths can go arbitrarily deep. The HST creates intermediate nodes as needed—if you set `Order.789.items.0.name`, it ensures the `items` array and first element exist.

### Connection to Operation Logging

Every HST mutation flows through the Operation Log. This happens automatically—you don't instrument individual changes. The logging captures the path, old value, new value, and timestamp. This enables undo/redo, audit trails, and debugging without any additional code at the call sites.

## Registry

The Registry is Stonecrop's central catalog of doctypes. It's a singleton—there's exactly one Registry per application—and it serves as the source of truth for "what entities exist in this system?"

### Why a Singleton?

Business applications need a single, authoritative answer to questions like "what doctypes are available?" and "what fields does a Customer have?" The singleton pattern ensures consistency: whether you're in a form component, a table view, or server-side rendering, you're looking at the same definitions.

This also enables lazy loading. You can register doctypes dynamically—when a route is accessed, when a user needs a particular feature—and the entire application sees them immediately. The Registry doesn't care *when* doctypes appear, only that they're accessible once registered.

### Registry and Routing

The Registry optionally integrates with Vue Router. When you register a doctype that has an associated component, the Registry can automatically create a route for it. This colocation—the doctype definition includes its UI entry point—means you don't maintain parallel route configurations.

This is purely optional. Many doctypes don't need routes (they're used embedded in other views, or they're purely data-layer concepts). The Registry accommodates both patterns.

### Metadata Fetching

In larger applications, doctype definitions might not all live in the frontend bundle. The Registry supports a `getMeta` hook for fetching doctype metadata from an API. This enables scenarios where:

- Doctypes are defined server-side and served dynamically
- Different users see different doctypes based on permissions
- The application discovers new entity types at runtime

This pattern keeps the frontend lightweight while maintaining the same doctype abstraction.

### Registry and Actions

When a doctype is registered, its actions are automatically registered with the global trigger engine. This means field triggers and workflow transitions work immediately—no additional wiring required. The Registry acts as a coordination point, ensuring all the pieces know about each other.

## Operation Log

The Operation Log is Stonecrop's memory. Every mutation to the HST is recorded with full context: what changed, what it changed from, when it happened, and who did it.

### Why Track Everything?

Business software has accountability requirements that typical web apps don't. When a price changes or a status updates, you often need to know:

- What was the value before?
- When did it change?
- Who changed it?
- Can we reverse it?

The Operation Log captures this automatically. You don't sprinkle audit logging throughout your code—it happens at the state layer, consistently.

### Undo/Redo as a First-Class Feature

The Operation Log enables undo/redo almost for free. Because every mutation records its before and after values, reversing a change is just applying the before value. The log maintains a cursor pointing to the current position, and undo/redo simply moves that cursor.

Not everything is reversible. Workflow transitions (moving a document from "draft" to "submitted") are typically one-way—you can't un-submit by clicking undo. The Operation Log distinguishes reversible from irreversible operations and prevents impossible undos.

### Batching

Sometimes a single user action produces multiple HST mutations. Updating a nested object, copying data between fields, or applying a template might touch many paths. Batching groups these into a single logical operation.

Why does this matter? Undo. Without batching, undoing a "paste template" operation would require clicking undo for each field that changed. With batching, one undo reverses the entire template application.

### Cross-Tab Synchronization

Modern users open multiple tabs. The Operation Log can synchronize across tabs using the browser's BroadcastChannel API. When you edit a record in one tab, other tabs see the change.

This isn't full real-time collaboration (that requires server coordination), but it prevents the common frustration of editing in one tab while another tab shows stale data.

### Persistence

Optionally, the Operation Log can persist to localStorage. This survives page refreshes, so a user can undo changes made before they accidentally refreshed.

This is a tradeoff. Persisting operations consumes storage and may not make sense for all applications. The Operation Log caps the number of stored operations and makes persistence opt-in.

### What Gets Logged

The log tracks four operation types:

1. **set** — A value was assigned to a path (the most common operation)
2. **delete** — A value was removed
3. **batch** — Multiple operations grouped as one
4. **action** — A stateless operation was executed (print, export, email)

Actions are special: they don't change HST state, but they're worth tracking for audit purposes. "User exported the report at 3:47pm" is valuable information even though nothing in the store changed.

## Related Documentation

- [Doctypes](./doctype) — Document type system and workflows
- [Stonecrop API Reference](/reference/stonecrop) — Full API documentation

