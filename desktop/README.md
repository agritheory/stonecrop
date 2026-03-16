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
  // Call your server, trigger FSM transitions, update HST...
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

## Emitted Events

| Event | Payload | When |
|-------|---------|------|
| `action` | `ActionEventPayload` | User triggers an FSM transition or DELETE |
| `navigate` | `NavigationTarget` | Desktop wants to change views |
| `record:open` | `RecordOpenEventPayload` | User opens a specific record |

### `action` payload

```typescript
type ActionEventPayload = {
  name: string                 // FSM transition name e.g. 'SUBMIT', 'APPROVE', 'DELETE'
  doctype: string
  recordId: string
  data: Record<string, any>   // Form field snapshot at trigger time
}
```

Desktop reads the available transitions for the current record directly from the doctype workflow (`DoctypeMeta.getAvailableTransitions`) using `Stonecrop.getRecordState` to resolve the current FSM state (reads the `status` field, falls back to `workflow.initial`). **Desktop never calls `triggerTransition` itself** — that is the host application's responsibility.

### `navigate` payload

```typescript
type NavigationTarget = {
  view: 'doctypes' | 'records' | 'record'
  doctype?: string
  recordId?: string
}
```

Fired on every internal navigation. If a `routeAdapter` is provided it is also called. If not, Desktop falls back to `registry.router` (Vue Router) with paths `'/'`, `'/:doctype'`, `'/:doctype/:recordId'`.

## Router Adapter

For Nuxt apps (or any host with custom route conventions), supply a `routeAdapter` instead of relying on the registry's Vue Router:

```typescript
import { useRoute, useRouter } from '#app'
import type { RouteAdapter, NavigationTarget } from '@stonecrop/desktop'

function useFabRouteAdapter(): RouteAdapter {
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
<Desktop :route-adapter="useFabRouteAdapter()" @action="handleAction" />
```

## Handling `action` Events

The complete host-side pattern for handling an action in a Nuxt/fab context:

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

## Components

### ActionSet

Renders a toolbar from an `ActionElements[]` array. Used internally by Desktop; can be used standalone.

### CommandPalette

Full-text search over registered doctypes and records. Activated with `Ctrl+K`.

### SheetNav

Tab strip for navigating between open records.
