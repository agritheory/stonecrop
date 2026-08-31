# @stonecrop/desktop

A three-view UI shell for Stonecrop applications. Renders a doctype list → records list → record form layout driven by the host application's Registry and HST state.

Desktop reads through Stonecrop — on navigating to a list or a record it calls `Stonecrop.getRecords` / `Stonecrop.getRecord`, which fetch through the host's registered `DataClient` and write into HST. Writes are the host's: Desktop emits `action` and the host dispatches it.

## Features

- **Three-view layout**: doctypes → records → record form, navigated by route or adapter
- **ActionSet toolbar**: FSM transitions become action buttons/dropdowns automatically from the doctype workflow
- **CommandPalette**: `Ctrl+K` / `Cmd+K` search across doctypes and records
- **SheetNav**: tabbed navigation between open records; optional `#sheetnav-toolbar` slot (or Teleport target) for page-level controls in the footer row

## Preview: SheetNav toolbar slot

The `dev/` app demonstrates teleporting controls into `#sheetnav-toolbar` — the same pattern FAB uses for planner toolbars.

```bash
cd desktop
pnpm dev
```

Opens the linked URL (default port 5174). Navigate between routes — toolbar controls sit just left of the tabs, with the cluster anchored bottom-right like the original SheetNav.

In **@stonecrop/nuxt**, run the playground (`pnpm dev` from the nuxt package), open a country record (e.g. **`/country/US`**), and use the **Country Explorer** field — its controls teleport into SheetNav.

Direct slot usage (no Teleport) also works when the controls are a child of `SheetNav` or `Desktop`:

```vue
<Desktop>
  <template #sheetnav-toolbar>
    <MyToolbar />
  </template>
</Desktop>
```

For controls deep in the page tree, Teleport to the anchor:

```vue
<Teleport to="#sheetnav-toolbar">
  <MyToolbar />
</Teleport>
```
- **Event-driven**: all significant interactions emit typed events for the host to respond to

## Installation

```bash
pnpm add @stonecrop/desktop
```

Desktop requires `@stonecrop/stonecrop` to be installed and the `StonecropPlugin` mounted before use:

```typescript
import { createApp } from 'vue'
import Stonecrop, { Doctype } from '@stonecrop/stonecrop'
import { RestDataClient } from './client'
import planDoctype from './doctypes/plan.json'

const app = createApp(App)

// The plugin constructs the Registry itself and provides it as `$registry` — it does not
// accept one. Register doctypes on that instance, after install.
app.use(Stonecrop, { router, client: new RestDataClient() })

const registry = app.config.globalProperties.$registry
registry.addDoctype(Doctype.fromObject(planDoctype))

app.mount('#app')
```

`client` is the `DataClient` Desktop reads through. It can also be supplied later with
`stonecrop.setClient(client)` — Nuxt hosts do this from a plugin via `useStonecropSetup().registerClient`.

## Basic Usage

```vue
<script setup lang="ts">
import { Desktop } from '@stonecrop/desktop'
import { useClientAction } from '@stonecrop/stonecrop'

// Runs an action's clientHandler when the doctype declares one, dispatches to the server
// otherwise, and reconciles the store and the route with the identity the server settled on.
// In a Nuxt host this is auto-imported — drop the import line.
const { run } = useClientAction()
</script>

<template>
  <Desktop
    :available-doctypes="['plan', 'recipe', 'resource']"
    @action="run"
  />
</template>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `availableDoctypes` | `string[]` | `[]` | Doctype slugs to display in the doctypes list |
| `routeAdapter` | `RouteAdapter` | — | Custom routing layer (required for Nuxt/custom hosts) |

Record identity is not a prop. It is declared per doctype (`primaryKey`, falling back to `id`) and
resolved through `Doctype.getRecordId`, so a row's link always matches the key the record is stored
under. One shell renders many doctypes, so a single prop could never answer this correctly.

## Emitted Events

| Event | When |
|-------|------|
| `action` | User triggers a declared action — an FSM transition or a Command |
| `navigate` | Desktop wants to change views |
| `record:open` | User opens a specific record |
| `load-records` | Desktop is about to read a records list (notification — Desktop performs the read) |
| `load-record` | Desktop is about to read a single record (notification — Desktop performs the read) |

See [api.md](./api.md) for payload type definitions.

### Event Handling Notes

- **action**: Desktop merges `Doctype.getAvailableTransitions` and `Doctype.getAvailableCommands`, both resolved against `Stonecrop.getRecordState`, into one Actions dropdown. **Desktop never dispatches** — that is the host application's responsibility.
- **load-records / load-record**: notifications, not fetch requests. Desktop reads through `Stonecrop.getRecords` / `Stonecrop.getRecord` itself, using the registered `DataClient`; these events announce that read so a host can hang analytics off it. A host that fetches here races Desktop's own read into the same HST key. `load-record` is not emitted for a draft, which has nothing to fetch.

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

Dispatching is not the whole job: the result has to land in HST under the identity the *server*
settled on, which for a newly created record is not the id that was dispatched.

Bind `@action` to `useClientAction`'s `run`, as in Basic Usage above. It runs an action's
`clientHandler` when it has one, dispatches otherwise, and reconciles the store and the route. It
lives in `@stonecrop/stonecrop`, so every Vue 3 host gets the same one; Nuxt hosts also get it as an
auto-import from `@stonecrop/nuxt`.

Three things are adjustable, for the cases that genuinely differ between applications:

| Option | Replaces | Use it for |
|--------|----------|------------|
| `buildArgs` | the `[{ id, data }]` envelope | a backend expecting another argument shape |
| `followRecord` | `router.replace('/{doctype}/{id}')` | a locale prefix, a nested route, or staying put |
| `onError` | a blocking `window.alert` | your own notification system |

`args` is an opaque JSON array: nothing validates it, so both ends of your own stack have to agree.
A backend taking positional `[recordId, data]` supplies `buildArgs` to say so.

Resolving a record's identity and keying it into HST are deliberately **not** adjustable. That rule
is declared on the doctype and re-derived server-side by the adapter, and every host that re-derived
it client-side got it wrong. If you dispatch through `Stonecrop.dispatchAction` directly instead of
using this composable, that method still files the returned record under the settled identity — you
cannot store it under the wrong key by accident. What you lose is the stale-key cleanup and the
route-follow, which need the id you dispatched.

Do not copy form data into HST before dispatching. Desktop already hands you the current form
snapshot in `payload.data`, and an unsaved record has no HST node to write to.

See the [host integration guide](../docs/guides/desktop-integration.md) for the full wiring.

## Provide / Inject

Desktop provides a `desktopMethods` object that child components (slot content) can inject:

```typescript
import { inject } from 'vue'

const { navigateToDoctype, openRecord, createNewRecord, emitAction } =
  inject('desktopMethods')!
```

`emitAction(name, data?)` is a convenience wrapper for emitting an `action` event from deeply nested slot content without passing refs down manually.

Desktop blesses no action name. It used to expose a `handleDelete` method and a `confirmFn` prop, which together emitted a hardcoded `DELETE` action and prompted before it — but no doctype declares `DELETE`, so it failed on every click, and only the host knows which of its actions are destructive. Removal is a workflow outcome: declare an action with a `nextState` such as `Archived` or `CANCELLED`, and confirm inside your own `@action` handler before dispatching.