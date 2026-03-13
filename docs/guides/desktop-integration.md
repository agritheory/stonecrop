---
title: Integrating Desktop in a Host Application
description: How to wire up @stonecrop/desktop in a Nuxt or custom Vue app
---

# Integrating `@stonecrop/desktop` in a Host Application

`@stonecrop/desktop` is a three-view UI shell (doctype list → records list → record form). It reads state from the Stonecrop Registry and HST, then **emits typed events** for every significant user interaction. The host application handles those events — calling the server, persisting state, and updating HST. Desktop owns no data lifecycle.

This guide covers the wiring needed to integrate Desktop in a Nuxt app (the FAB pattern), but applies equally to any Vue 3 host.

---

## Prerequisites

- `@stonecrop/stonecrop` installed and `StonecropPlugin` mounted
- Doctypes registered in Registry before the component is rendered
- (Optional) `@stonecrop/graphql-client` for server communication

---

## 1. Mount the Plugin

```typescript
// app/plugins/stonecrop.ts (Nuxt plugin)
import { defineNuxtPlugin } from '#app'
import StonecropPlugin, { Registry, DoctypeMeta } from '@stonecrop/stonecrop'
import { List, Map } from 'immutable'
import planDoctype from '~/doctypes/plan.json'

export default defineNuxtPlugin(nuxtApp => {
  const registry = new Registry()

  // Register doctypes — load from JSON, API, or inline
  registry.addDoctype(new DoctypeMeta(
    planDoctype.name,
    List(planDoctype.fields),
    planDoctype.workflow,
    Map(planDoctype.actions ?? {}),
  ))
  // ... register other doctypes

  nuxtApp.vueApp.use(StonecropPlugin, { registry })
})
```

---

## 2. Supply a `routeAdapter`

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

---

## 3. Handle `@action`

The `action` event fires when the user clicks an FSM transition button (or the Delete confirmation). The payload contains the transition name, the current doctype/recordId, and a snapshot of the form data.

```vue
<script setup lang="ts">
import { Desktop } from '@stonecrop/desktop'
import type { ActionEventPayload } from '@stonecrop/desktop'
import { useStonecrop } from '@stonecrop/stonecrop'
import { useDesktopRouteAdapter } from '~/composables/useDesktopRouteAdapter'

const { stonecrop } = useStonecrop()
const routeAdapter = useDesktopRouteAdapter()

async function handleAction(payload: ActionEventPayload) {
  if (!stonecrop.value) return

  // 1. Sync any changed fields into HST before the RPC call
  const store = stonecrop.value.getStore()
  for (const [field, value] of Object.entries(payload.data)) {
    const path = `${payload.doctype}.${payload.recordId}.${field}`
    if (store.has(path) && store.get(path) !== value) {
      store.set(path, value)
    }
  }

  // 2. Call the server via StonecropClient (or $fetch / tRPC / etc.)
  //    stonecropAction is the single mutation; the handler on the server
  //    decides what to do based on payload.name.
  const result = await $fetch('/graphql/', {
    method: 'POST',
    body: {
      query: `mutation RunAction($doctype: String!, $action: String!, $args: JSON) {
        stonecropAction(doctype: $doctype, action: $action, args: $args) {
          success data error
        }
      }`,
      variables: {
        doctype: payload.doctype,
        action: payload.name,
        args: { id: payload.recordId, data: payload.data },
      },
    },
  })

  // 3. Sync the authoritative server response back into HST
  const actionResult = result?.data?.stonecropAction
  if (actionResult?.success && actionResult.data) {
    stonecrop.value.addRecord(payload.doctype, payload.recordId, actionResult.data)
  }
}
</script>

<template>
  <Desktop
    :available-doctypes="['plan', 'recipe', 'resource']"
    :route-adapter="routeAdapter"
    @action="handleAction"
  />
</template>
```

### DELETE is an action

When the user confirms a record deletion, Desktop emits `action` with `name: 'DELETE'`. The host app handles the server call and then removes the record from HST:

```typescript
if (payload.name === 'DELETE') {
  await $fetch(`/api/${payload.doctype}/${payload.recordId}`, { method: 'DELETE' })
  stonecrop.value?.removeRecord(payload.doctype, payload.recordId)
  return
}
```

---

## 4. Handle `@navigate` and `@record:open`

These events fire for informational/analytics purposes. Desktop has already performed (or will perform) the navigation via `routeAdapter.navigate`; these handlers are optional hooks for the host.

```typescript
function handleNavigate(target: NavigationTarget) {
  // e.g. analytics.track('desktop:navigate', target)
}

function handleRecordOpen(payload: RecordOpenEventPayload) {
  // e.g. eagerly fetch the record from the server before the view renders
  prefetchRecord(payload.doctype, payload.recordId)
}
```

---

## 5. Inject a confirmation dialog

Replace the browser's native `confirm()` with your app's modal:

```typescript
import { useModal } from '~/composables/useModal'

const { confirm } = useModal()

// Pass to Desktop:
// <Desktop :confirm-fn="confirm" ... />
```

```typescript
// The signature Desktop expects:
type ConfirmFn = (message: string) => boolean | Promise<boolean>
```

---

## 6. Pre-load records into HST

Desktop reads records from HST — it does not fetch them itself. Pre-load records before rendering (e.g., in a route middleware or `onMounted`):

```typescript
const { stonecrop } = useStonecrop()

// Load the records list
const records = await $fetch(`/api/${doctype}`)
records.forEach(r => stonecrop.value?.addRecord(doctype, r.id, r))

// Load a single record
const record = await $fetch(`/api/${doctype}/${id}`)
stonecrop.value?.addRecord(doctype, record.id, record)
```

---

## 7. FSM transitions and available actions

Desktop renders the action toolbar for a record view by calling `DoctypeMeta.getAvailableTransitions(currentState)` where `currentState` is resolved by `Stonecrop.getRecordState(doctype, recordId)`.

`getRecordState` reads the record's `status` field from HST and falls back to `workflow.initial` when the field is absent. This means:

- **Server response should include `status`**: When `addRecord` is called with the server response, include the `status` field so Desktop renders the correct available actions.
- **No special wiring needed**: Desktop reads `status` automatically — no extra setup required.

```typescript
// After an action, the server returns the updated record including status
stonecrop.value.addRecord(payload.doctype, payload.recordId, {
  ...actionResult.data,
  // status: 'submitted' — Desktop will now show APPROVE / REJECT buttons
})
```

---

## New APIs Added in PR 3

These methods were added to the stonecrop package to support Desktop's integration pattern. They can be used directly by host applications too:

### `Registry.getDoctype(slug)`

```typescript
const meta = stonecrop.value.registry.getDoctype('plan')
// Returns DoctypeMeta | undefined
```

Look up a registered doctype by slug. Prefer this over `registry.registry[slug]` (internal implementation detail).

### `DoctypeMeta.getAvailableTransitions(currentState)`

```typescript
const transitions = meta.getAvailableTransitions('draft')
// [{ name: 'SUBMIT', targetState: 'submitted' }, ...]
```

Returns the transitions available from a given workflow state directly from the XState config. Useful for rendering action menus without replicating workflow introspection logic.

### `Stonecrop.getRecordState(doctype, recordId)`

```typescript
const state = stonecrop.value.getRecordState('plan', 'plan-123')
// 'draft' — reads from HST status field, falls back to workflow.initial
```

Returns the current FSM state for a record. Centralises the convention that `status` holds the FSM state and ensures consistent fallback behaviour.
