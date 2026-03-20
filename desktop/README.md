# @stonecrop/desktop

A three-view UI shell for Stonecrop applications. Renders a doctype list → records list → record form layout driven entirely by the host application's Registry and HST state. Desktop owns no data lifecycle — it emits events and the host app decides what to do.

## Features

- **Three-view layout**: doctypes → records → record form, navigated by route or adapter
- **ActionSet toolbar**: FSM transitions become action buttons/dropdowns automatically from the doctype workflow
- **CommandPalette**: `Ctrl+K` / `Cmd+K` search across doctypes and records
- **SheetNav**: tabbed navigation between open records
- **Event-driven**: all significant interactions emit typed events for the host to respond to

## Installation

```bash
pnpm add @stonecrop/desktop
```

Desktop requires `@stonecrop/stonecrop` to be installed and the `StonecropPlugin` mounted before use:

```typescript
import { createApp } from 'vue'
import Stonecrop from '@stonecrop/stonecrop'
import { registry } from './registry'

createApp(App).use(Stonecrop, { registry }).mount('#app')
```

## Basic Usage

```vue
<script setup lang="ts">
import { Desktop } from '@stonecrop/desktop'
import type { ActionEventPayload } from '@stonecrop/desktop'
import { useStonecrop } from '@stonecrop/stonecrop'

const { stonecrop } = useStonecrop()

async function handleAction(payload: ActionEventPayload) {
  const node = stonecrop.value?.getRecordById(payload.doctype, payload.recordId)
  await node?.triggerTransition(payload.name, { fsmContext: payload.data })
}
</script>

<template>
  <Desktop
    :available-doctypes="['plan', 'recipe', 'resource']"
    @action="handleAction"
  />
</template>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `availableDoctypes` | `string[]` | `[]` | Doctype slugs to display in the doctypes list |
| `routeAdapter` | `RouteAdapter` | — | Custom routing layer (required for Nuxt/custom hosts) |
| `confirmFn` | `(msg: string) => boolean \| Promise<boolean>` | `window.confirm` | Replacement for the native browser confirm dialog |
| `recordIdField` | `string` | `'id'` | Field name for the canonical record ID in list views |

## Emitted Events

| Event | When |
|-------|------|
| `action` | User triggers an FSM transition or DELETE |
| `navigate` | Desktop wants to change views |
| `record:open` | User opens a specific record |
| `load-records` | Desktop navigates to a records list and needs records loaded into HST |
| `load-record` | Desktop navigates to a record form and needs a single record loaded into HST |

See [api.md](./api.md) for payload type definitions.

### Event Handling Notes

- **action**: Desktop reads available transitions from `Doctype.getAvailableTransitions` using `Stonecrop.getRecordState`. **Desktop never calls `triggerTransition` itself** — that is the host application's responsibility.
- **load-records / load-record**: Desktop reads from HST but doesn't fetch data. Host apps should listen for these events, fetch from their data source, and call `stonecrop.addRecords()` or `stonecrop.addRecord()` to populate HST.

## Router Adapter

For Nuxt apps (or any host with custom route conventions), supply a `routeAdapter` instead of relying on the registry's Vue Router:

```typescript
import { useRoute, useRouter } from '#app'
import type { RouteAdapter, NavigationTarget } from '@stonecrop/desktop'

function useCustomRouteAdapter(): RouteAdapter {
  const route = useRoute()
  const router = useRouter()

  return {
    getCurrentDoctype: () => route.meta.slug as string ?? '',
    getCurrentRecordId: () => route.params.id as string ?? '',
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

```vue
<Desktop :route-adapter="useCustomRouteAdapter()" @action="handleAction" />
```

## Handling `action` Events

The complete host-side pattern for handling an action in a Nuxt context:

```typescript
import type { ActionEventPayload } from '@stonecrop/desktop'
import { useStonecrop } from '@stonecrop/stonecrop'

const { stonecrop } = useStonecrop()

async function handleAction(payload: ActionEventPayload) {
  if (!stonecrop.value) return

  // 1. Optionally persist field changes to HST before the transition
  const store = stonecrop.value.getStore()
  for (const [field, value] of Object.entries(payload.data)) {
    const path = `${payload.doctype}.${payload.recordId}.${field}`
    if (store.has(path) && store.get(path) !== value) {
      store.set(path, value)
    }
  }

  // 2. Call the server (StonecropClient, $fetch, tRPC — whatever your stack uses)
  const result = await client.runAction(payload.doctype, payload.name, {
    id: payload.recordId,
    data: payload.data,
  })

  // 3. Sync the server response back into HST
  if (result.success && result.data) {
    stonecrop.value.addRecord(payload.doctype, payload.recordId, result.data)
  }
}
```

## Provide / Inject

Desktop provides a `desktopMethods` object that child components (slot content) can inject:

```typescript
import { inject } from 'vue'

const { navigateToDoctype, openRecord, createNewRecord, handleDelete, emitAction } =
  inject('desktopMethods')!
```

`emitAction(name, data?)` is a convenience wrapper for emitting an `action` event from deeply nested slot content without passing refs down manually.