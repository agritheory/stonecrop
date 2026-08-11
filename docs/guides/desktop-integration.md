---
title: Integrating Desktop in a Host Application
description: How to wire up @stonecrop/desktop in a Nuxt or custom Vue app
---

# Integrating `@stonecrop/desktop` in a Host Application

`@stonecrop/desktop` is a three-view UI shell (doctype list → records list → record form). It reads state from the Stonecrop Registry and HST, and **emits typed events** for every significant user interaction.

Desktop reads through Stonecrop: when the route lands on a list or a record, it calls `Stonecrop.getRecords` / `Stonecrop.getRecord`, which fetch through the `DataClient` the host registered and write the result into HST under each record's declared key. The host supplies *how to reach the backend*; it does not decide when to read.

Writes are the other half, and they are the host's: Desktop emits `action` and the host dispatches it.

This guide covers the wiring needed to integrate Desktop in a Nuxt app, but applies equally to any Vue 3 host.

---

## Prerequisites

- `@stonecrop/stonecrop` installed and `StonecropPlugin` mounted
- Doctypes registered in Registry before the component is rendered
- A `DataClient` registered (§2 below). Without one, Desktop renders empty lists and blank forms.

---

## 1. Mount the Plugin

```typescript
// app/plugins/stonecrop.ts (Nuxt plugin)
import { defineNuxtPlugin } from '#app'
import StonecropPlugin, { Doctype, type Registry } from '@stonecrop/stonecrop'
import planDoctype from '~/doctypes/plan.json'

export default defineNuxtPlugin(nuxtApp => {
  // The plugin owns the Registry (it constructs one internally and provides it as
  // `$registry`). Install it first, then register doctypes on that registry.
  nuxtApp.vueApp.use(StonecropPlugin)

  const registry = nuxtApp.vueApp.config.globalProperties.$registry as Registry

  // Register doctypes — load from JSON, API, or inline. Doctype.fromObject handles
  // the List/Map conversion from a plain config object internally.
  registry.addDoctype(Doctype.fromObject(planDoctype))
  // ... register other doctypes
})
```

---

## 2. Register a `DataClient`

A `DataClient` is the seam that says *how* to reach your backend. It has four methods — `getMeta`, `getRecord`, `getRecords`, `runAction` — and it is the only place backend knowledge lives. Stonecrop decides when to read and where the result lands.

Supply it at install time, or later with `setClient`:

```typescript
import { StonecropClient } from '@stonecrop/graphql-client'

app.use(StonecropPlugin, { router, client: new StonecropClient({ endpoint: '/graphql' }) })
// …or, at any point after install:
stonecrop.setClient(new StonecropClient({ endpoint: '/graphql' }))
```

In a Nuxt plugin, use `useStonecropSetup()` — it is built for the initialization context, where Stonecrop may not be ready yet:

```typescript
const { registerClient } = useStonecropSetup()
registerClient(new StonecropClient({ endpoint: '/graphql' }))
```

Nothing about this seam assumes GraphQL. `examples/desktop` ships a `RestDataClient` over plain `fetch`, and `nuxt/playground` ships one over a third-party API whose schema shares nothing with Stonecrop's.

Register it before Desktop renders. Desktop skips the read entirely when no client is configured, so a missing one shows up as permanently empty lists and blank forms rather than as an error. (`Stonecrop.getRecord` and `getRecords` do throw, naming `setClient`, for a host that calls them directly.)

---

## 3. Supply a `routeAdapter`

Desktop needs to know which doctype and record are active. In Nuxt, route meta fields carry this information — supply a `routeAdapter` so Desktop reads from `useRoute()` instead of from an internal Vue Router instance.

```typescript
// app/composables/useDesktopRouteAdapter.ts
import { useRoute, useRouter } from '#app'
import type { RouteAdapter, NavigationTarget } from '@stonecrop/desktop'

export function useDesktopRouteAdapter(): RouteAdapter {
  const route = useRoute()
  const router = useRouter()

  return {
    getCurrentDoctype: () => (route.meta.slug as string) ?? '',
    getCurrentRecordId: () => (route.params.id as string) ?? '',
    getCurrentView: () => {
      if (!route.meta.slug) return 'doctypes'
      if (!route.params.id) return 'records'
      return 'record'
    },
    navigate: (target: NavigationTarget) => {
      if (target.view === 'doctypes') return router.push('/')
      if (target.view === 'records') return router.push(`/${target.doctype}`)
      return router.push(`/${target.doctype}/${target.recordId}`)
    },
  }
}
```

Route meta must be set for each doctype page. Example `app/pages/[slug]/[id].vue`:

```vue
<script setup lang="ts">
definePageMeta({
  meta: { slug: useRoute().params.slug },
})
</script>
```

An unsaved record routes to `/{doctype}/new`. The adapter needs no special case for it — `new` is a record id like any other as far as routing is concerned, and Desktop recognises it as a draft.

---

## 4. Handle `@action`

The `action` event fires when the user triggers a declared action — an FSM transition or a stateless Command. The payload carries the action name, the doctype and record, and a snapshot of the form data.

Dispatching is the host's job, and it is not the whole job: the result has to be written back into HST under whichever identity the *server* settled on, which for a newly created record is not the id that was dispatched.

**In a Nuxt host**, delegate to `useClientAction` — it runs the action's `clientHandler` when it has one, dispatches to the server otherwise, and owns the writeback and the route-follow:

```vue
<script setup lang="ts">
import { Desktop } from '@stonecrop/desktop'

const { run } = useClientAction()
const routeAdapter = useDesktopRouteAdapter()
</script>

<template>
  <Desktop
    :available-doctypes="['plan', 'recipe', 'resource']"
    :route-adapter="routeAdapter"
    @action="run"
  />
</template>
```

Pass `onError` to route failures into your own notification system instead of the default alert:

```typescript
const { run } = useClientAction({
  onError: failure => toast.error(failure.message),
})
```

**In any other Vue 3 host**, dispatch through `Stonecrop.dispatchAction`, which forwards to your client's `runAction`:

```typescript
const result = await stonecrop.value.dispatchAction(doctype, payload.name, args)
```

`args` is an opaque JSON array. Its shape is a convention agreed between your client and your server handlers, not something the schema validates — `useClientAction` uses `[{ id, data }]` and omits `id` for a draft, while `examples/desktop` uses `[recordId, data]` end to end. Pick one and keep both ends of your own stack on it. `examples/desktop/components/View.vue` is the worked non-Nuxt example.

### Removal is a workflow outcome, not a blessed action

Desktop blesses no action name, and there is no `DELETE`. It once emitted a hardcoded `DELETE` and
prompted before it, but no doctype declares that action, so it failed on every click — and only the
host knows which of its actions are destructive.

Model removal the way you model every other state change: declare an action with a `nextState` such
as `ARCHIVED` or `CANCELLED`, and confirm inside your own `@action` handler before dispatching it.

---

## 5. The notification events

`navigate`, `record:open`, `load-records` and `load-record` are **notifications**, not requests. Desktop has already performed (or is about to perform) the work they announce; these handlers are optional hooks.

```typescript
function handleNavigate(target: NavigationTarget) {
  // e.g. analytics.track('desktop:navigate', target)
}

function handleRecordOpen(payload: RecordOpenEventPayload) {
  // e.g. analytics.track('desktop:record:open', payload)
}

function handleLoadRecord(payload: LoadRecordEventPayload) {
  // Desktop is about to read this record through Stonecrop. Nothing to fetch here.
}
```

`load-record` and `load-records` used to mean "the host should fetch this and populate HST". They no longer do — Stonecrop owns the read. A host that still fetches in these handlers races Desktop's own read into the same HST key.

That also makes prefetching counterproductive: `Stonecrop.getRecord` returns early when the record is already in HST, so a prefetch does not merely warm the cache — it decides what shape the record has, and Desktop's own read never runs. If you need a different shape (nested children, say), put that in your `DataClient`, where it applies to every read rather than only the ones you beat.

`load-record` is not emitted at all for a draft: an unsaved record has nothing to fetch.

---

## 6. FSM transitions and available actions

Desktop builds the record view's action toolbar from two sources on the doctype, merged into one Actions dropdown:

- `Doctype.getAvailableTransitions(currentState)` — actions that move the record to a new state.
- `Doctype.getAvailableCommands(currentState)` — stateless Commands, which run a side effect and change no state.

Both are resolved against `Stonecrop.getRecordState(doctype, recordId)`, and each entry's label comes from `Doctype.getActionMeta(name)?.label`, falling back to the raw action name.

`getRecordState` reads the record's `status` field from HST and falls back to `workflow.initial` when the field is absent. This means:

- **Server response should include `status`**: when the action result is written back, include the `status` field so Desktop renders the correct available actions.
- **No special wiring needed**: Desktop reads `status` automatically — no extra setup required.
