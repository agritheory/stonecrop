# Nuxt Stonecrop

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]

The official Nuxt module for Stonecrop - a schema-driven UI framework with event-driven workflows and hierarchical state management.

## What is Stonecrop?

Stonecrop is a **schema-driven UI framework** that generates forms, tables, and workflows from JSON schemas. You define your data structure once and Stonecrop handles UI generation, state management, and validation.

**Key Benefits:**
- **Schema-Driven**: Define data models in JSON; form and table rendering follows automatically
- **HST State Management**: Hierarchical State Tree for complex, nested application state
- **FSM Workflows**: XState-powered finite state machines for predictable business logic
- **Nuxt Native**: First-class integration with Nuxt 4's architecture
- **Live Validation**: Real-time form validation based on schema rules
- **Excel-like Tables**: Rich table component with keyboard navigation and inline editing

## Module Features

- **Route Generation**: Scans your `/doctypes` folder and registers routes using your own page components
- **Plugin System**: Auto-registers Stonecrop composables and utilities
- **Theme Support**: Import and customize Stonecrop themes
- **TypeScript First**: Full type safety and IntelliSense support
- **Thin Wrapper**: The module is intentionally opinion-free — page rendering, queries, and navigation stay in your application

## Quick Setup

### Option 1: Interactive Installer (Recommended)

Use the Stonecrop CLI to interactively install features:

```bash
npx @stonecrop/nuxt init
```

This will prompt you to select which features to install:
- **@stonecrop/nuxt** - Frontend module with schema-driven UI
- **@stonecrop/graphql-client** - GraphQL client with Stonecrop integration
- **@stonecrop/nuxt-grafserv** - GraphQL server with Grafserv
- **@stonecrop/casl-middleware** - CASL authorization
- **@stonecrop/rockfoil** - PostGraphile middleware for database-driven GraphQL
- **Sample doctypes** - Example doctype files to get started

You can also use flags for non-interactive installation:

```bash
# Install everything
npx @stonecrop/nuxt init --frontend --graphql-client --graphql --casl --rockfoil --doctypes --yes

# Install just the frontend module
npx @stonecrop/nuxt init --frontend

# Add GraphQL server to existing setup
npx @stonecrop/nuxt init --graphql

# Add PostGraphile middleware
npx @stonecrop/nuxt init --rockfoil
```

### Option 2: Manual Installation

```bash
npx nuxi module add @stonecrop/nuxt
```

That's it! You can now use Stonecrop in your Nuxt app.

## Basic Usage

### Define a DocType Schema

Create a JSON schema in `/doctypes/task.json`:

```json
{
  "name": "task",
  "label": "Task",
  "fields": [
    {
      "fieldname": "title",
      "label": "Title",
      "component": "ATextInput",
      "required": true
    },
    {
      "fieldname": "description",
      "label": "Description",
      "component": "ATextarea"
    },
    {
      "fieldname": "completed",
      "label": "Completed",
      "component": "ACheckbox"
    }
  ]
}
```

The module picks up this file and, if `pageComponent` is configured, registers a route at the doctype's `slug` value (or `task` if no slug is set), passing the parsed schema into `route.meta`.

### Wire Up Your Data Client

After installing the module, add a client-side plugin to connect your data transport. Use `useStonecropSetup()` in plugins — it's designed for the initialization context where Stonecrop may not be fully ready yet:

```typescript
// app/plugins/stonecrop.client.ts
import { StonecropClient } from '@stonecrop/graphql-client'

export default defineNuxtPlugin(() => {
  const { registerClient, registerMeta } = useStonecropSetup()

  const client = new StonecropClient({ endpoint: '/graphql' })

  // Register the data client for record fetching
  registerClient(client)

  // Configure metadata fetching for lazy-loaded doctypes
  // Called by useStonecrop() when it needs doctype metadata
  registerMeta(({ segments }) => {
    const doctype = segments[0] // e.g., "task" from /task/123
    return client.getMeta({ doctype })
  })
})
```

This wires `useStonecrop()`'s automatic record loading to your GraphQL (or any other) backend. Without this step, `useStonecrop({ doctype, recordId })` falls back to a REST fetch stub that may not exist in your app.

### Use the Stonecrop Composable

In your page or component:

```vue
<script setup lang="ts">
import taskDoctype from '~/doctypes/task.json'

// HST-reactive form setup — pass doctype + recordId for full integration
const { stonecrop, provideHSTPath, handleHSTChange, formData } = useStonecrop({
  doctype: taskDoctype,
  recordId: 'task-123' // or undefined for new records
})

// Access the hierarchical state tree directly
const store = stonecrop.value?.getStore()
const taskTitle = store?.get('task.task-123.title')
</script>

<template>
  <AForm
    :schema="taskDoctype.fields"
    :data="formData"
    @update="handleHSTChange"
  />
</template>
```

### Understanding Schema-Driven Development

**Traditional Approach:**
```vue
<!-- Manual form creation -->
<template>
  <form>
    <input v-model="task.title" required />
    <textarea v-model="task.description" />
    <input type="checkbox" v-model="task.completed" />
    <button @click="validate">Save</button>
  </form>
</template>

<script setup>
// Manual validation logic
const validate = () => {
  if (!task.title) {
    errors.title = 'Required'
  }
  // ... more validation
}
</script>
```

**Stonecrop Approach:**
```vue
<!-- Schema generates form automatically -->
<template>
  <AForm :schema="taskSchema" :data="formData" />
</template>

<script setup>
// Validation is automatic from schema
const { formData } = useStonecrop({
  doctype: taskDoctype,
  recordId: taskId
})
</script>
```

The schema defines:
- Field types (text input, checkbox, select, etc.)
- Validation rules (required, patterns, min/max)
- Labels and help text
- Relationships between data models

## Configuration

Add options to your `nuxt.config.ts`:

```typescript
export default defineNuxtConfig({
  modules: ['@stonecrop/nuxt'],

  stonecrop: {
    // Point to your own page component for slug-based routing (one route per doctype)
    pageComponent: 'pages/StonecropPage.vue',

    // Or supply a custom strategy for full control
    // routeStrategy: (doctypes) => [...],

    // Enable DocBuilder for visual schema editing
    docbuilder: false,

    // The default theme (@stonecrop/themes/default.css) loads automatically.
    // Override it, or set `false` to bring your own:
    // theme: '@stonecrop/themes/dark.css',
  },
})
```

### Module Options

| Option | Type | Description |
|--------|------|-------------|
| `pageComponent` | `string` | Path (relative to `srcDir`) to your page component. The module registers one route per doctype at `/<slug>`, passing `schema` and `doctype` in `route.meta`. |
| `routeStrategy` | `RouteStrategyFn` | Custom function receiving all parsed doctypes; returns a `NuxtPage[]`. Takes priority over `pageComponent`. |
| `docbuilder` | `boolean` | Enable the DocBuilder feature at `/docbuilder`. Defaults to `false`. |
| `doctypesDir` | `string` | Override the doctypes directory path. Defaults to `doctypes/` inside `srcDir`. |
| `theme` | `string \| false` | Base theme stylesheet loaded into the host app (supplies the `--sc-*` CSS variables). Defaults to `'@stonecrop/themes/default.css'`; set `false` to load none and bring your own. |

If neither `pageComponent` nor `routeStrategy` is configured the module logs a warning and skips doctype route registration.

## Route Generation

### Default: slug-based routing

The module scans your `doctypes/` folder and registers one route per JSON file:

```
doctypes/
  ├── task.json        → /task  (if no slug field)
  ├── user.json        → /user/:id  (if slug is "user/:id")
  └── project.json     → /project
```

Each route's `meta` contains the parsed doctype:

```typescript
route.meta.schema   // ParsedDoctype['fields']
route.meta.doctype  // ParsedDoctype['data']
```

Your page component receives these via `useRoute()`:

```vue
<script setup lang="ts">
const route = useRoute()
const schema = route.meta.schema   // array of field definitions
const doctype = route.meta.doctype // full doctype JSON object
</script>
```

### Custom route strategy

For full control — multiple routes per doctype, conditional skipping, custom meta — provide a `RouteStrategyFn`:

```typescript
import type { RouteStrategyFn } from '@stonecrop/nuxt'
import { resolve } from 'path'

const myStrategy: RouteStrategyFn = (doctypes) =>
  doctypes
    .flatMap(({ fileName, data, fields }) => [
      {
        name: `${fileName}-list`,
        path: `/${data.slug ?? fileName.toLowerCase()}`,
        file: resolve('./pages/ListPage.vue'),
        meta: { schema: fields, doctype: data, viewMode: 'list' },
      },
      {
        name: `${fileName}-detail`,
        path: `/${data.slug ?? fileName.toLowerCase()}/:id`,
        file: resolve('./pages/DetailPage.vue'),
        meta: { schema: fields, doctype: data, viewMode: 'detail' },
      },
    ])

export default defineNuxtConfig({
  stonecrop: { routeStrategy: myStrategy },
})
```

### Plugin Registration

The module auto-registers:
- `useStonecropRegistry()` - Composable for wiring data clients and `getMeta` after plugin install
- `useStonecrop()` - Main composable for HST integration (from `@stonecrop/stonecrop`)
- Pinia store configuration
- AForm and ATable component registration (from `@stonecrop/aform`)

## Why Schema-Driven?

**Problem:** Building CRUD applications is repetitive. Every data model needs:
- Forms for creating/editing
- Tables for listing
- Validation logic
- State management
- API integration

**Solution:** Define the structure once, generate everything automatically.

**Benefits:**
- **Faster Development**: Write less boilerplate code
- **Consistency**: All forms/tables follow the same patterns
- **Fewer Bugs**: Validation and state management are centralized
- **Self-Documenting**: Schemas serve as data model documentation
- **Easy Updates**: Change schema, UI updates automatically

## `useStonecropSetup()` — Configuring the Framework in Plugins

When you need to configure Stonecrop during Nuxt plugin initialization (before components mount), use `useStonecropSetup()`. This composable is designed specifically for the plugin context and returns values that may be `undefined` if Stonecrop hasn't finished initializing.

```typescript
// app/plugins/stonecrop.client.ts
import { StonecropClient } from '@stonecrop/graphql-client'

export default defineNuxtPlugin(() => {
  const { isReady, registerClient, registerMeta, registerDoctype } = useStonecropSetup()

  // Check if Stonecrop is ready (module plugins run before project plugins)
  if (!isReady) {
    console.warn('Stonecrop not ready - ensure @stonecrop/nuxt module is installed')
    return
  }

  const client = new StonecropClient({ endpoint: '/graphql' })

  // Register the data client
  registerClient(client)

  // Configure metadata fetching for lazy-loaded doctypes
  registerMeta(({ segments }) => {
    const doctype = segments[0]
    return client.getMeta({ doctype })
  })

  // Optionally pre-load doctypes into the Registry
  const planDoctype = Doctype.fromObject({ name: 'plan', fields: [...] })
  registerDoctype(planDoctype)
})
```

### `useStonecropSetup()` vs `useStonecropRegistry()`

| Context | Use | Behavior |
|---------|-----|----------|
| **Plugin/initialization** | `useStonecropSetup()` | Returns values that may be `undefined`; provides `isReady` check |
| **Component/runtime** | `useStonecropRegistry()` | Throws if Stonecrop isn't initialized (expected to be ready) |

### `useStonecropSetup()` API

| Property/Method | Type | Description |
|-----------------|------|-------------|
| `registry` | `Registry \| undefined` | The Registry instance (undefined if not ready) |
| `stonecrop` | `Stonecrop \| undefined` | The Stonecrop instance (undefined if not ready) |
| `isReady` | `boolean` | `true` when both registry and stonecrop are available |
| `registerClient(client)` | `(client: DataClient) => void` | Set the data client for record fetching. Throws if stonecrop not available. |
| `registerMeta(fn)` | `(fn: (ctx) => Doctype) => void` | Set the `getMeta` function on the Registry. Throws if registry not available. |
| `registerDoctype(doctype)` | `(doctype: Doctype) => void` | Pre-load a doctype into the Registry. Throws if registry not available. |

## `useStonecropRegistry()` — Using the Framework in Components

`useStonecropRegistry()` is for component/runtime context where the framework is expected to be fully initialized. Use it in components to access the configured registry and stonecrop instances.

```typescript
// In a component or composable
const { registry, stonecrop, dispatchAction } = useStonecropRegistry()

// Access doctype metadata
const plan = registry.getDoctype('plan')

// Dispatch actions
await dispatchAction({ name: 'plan' }, 'SUBMIT', [recordId])
```

**Note**: If called before Stonecrop is initialized (e.g., in a plugin), this throws with guidance to use `useStonecropSetup()` instead.

### `useStonecropRegistry()` API

| Property/Method | Type | Description |
|-----------------|------|-------------|
| `registry` | `Registry` | The Registry instance for doctype management. |
| `stonecrop` | `Stonecrop` | The Stonecrop instance for HST and operation log access. Throws if not initialized. |
| `setMeta(fn)` | `(fn: (ctx) => Doctype \| Promise<Doctype>) => void` | Sets the `getMeta` function on the Registry. Called by `useStonecrop()` to lazy-load doctype metadata for the current route. `ctx` = `{ path, segments }`. |
| `setClient(client)` | `(client: DataClient) => void` | Set the data client for record fetching. Throws if stonecrop not available. |
| `getClient()` | `() => DataClient \| undefined` | Get the currently configured client. |
| `dispatchAction(doctype, action, args)` | `Promise<{ success, data, error }>` | Dispatch an action via the configured client. Returns error if doctype not found in registry. |

## Advanced Features

### Hierarchical State Tree (HST)

HST provides path-based state addressing:

```typescript
const store = stonecrop.getStore()

// Set nested values with dot notation
store.set('project.proj-1.tasks.task-1.completed', true)

// Get values anywhere in the tree
const completed = store.get('project.proj-1.tasks.task-1.completed')

// Navigate the tree hierarchy
const taskNode = store.getNode('project.proj-1.tasks.task-1')
const ancestor = taskNode.getAncestor() // Returns project node
const breadcrumbs = taskNode.getBreadcrumbs()
```

### XState Integration

Define workflows as finite state machines:

```typescript
import { createMachine } from 'xstate'

const taskMachine = createMachine({
  id: 'task',
  initial: 'draft',
  states: {
    draft: {
      on: { SUBMIT: 'pending' }
    },
    pending: {
      on: {
        APPROVE: 'completed',
        REJECT: 'draft'
      }
    },
    completed: {
      type: 'final'
    }
  }
})

// Stonecrop persists state machine data in HST
```

## Examples

- **[playground](./playground)** — the default example: doctypes introspected from a live public GraphQL API with the `stonecrop-schema generate` CLI, browsed through the Desktop shell, and refined in the built-in DocBuilder (provenance-locked introspected fields, plus hand-authored workflow fixtures for the graph editor). `npm run dev` runs it.
- **[fullstack](./fullstack)** — the middleware core on the app's own GraphQL server (grafserv + guarded workflow transitions over in-memory storage, no database). `npm run dev:full` runs it.


## Contribution

```bash
# Install dependencies
npm install

# Generate type stubs
npm run dev:prepare

# Develop with the playground
npm run dev

# Build the playground
npm run dev:build

# Run ESLint
npm run lint

# Run Vitest
npm run test
npm run test:watch
```

### Testing the CLI Locally

To test the `npx @stonecrop/nuxt init` command from another directory outside this project:

**1. Build the monorepo (from stonecrop root):**

```bash
cd /path/to/stonecrop
rush update
rush build
```

**2. Create a test Nuxt project (in a separate directory):**

```bash
cd /tmp  # or any directory outside stonecrop
npx nuxi init my-test-app
cd my-test-app
npm install
```

**3. Run the CLI using the local package:**

```bash
# Option A: Run from within the nuxt package directory (simplest)
# This ensures Node can find the dependencies
cd /path/to/stonecrop/nuxt
node bin/init.mjs init --cwd /tmp/my-test-app

# Option B: Use pnpm link (from the test project)
cd /path/to/stonecrop/nuxt
pnpm link --global
cd /tmp/my-test-app
pnpm link --global @stonecrop/nuxt
npx stonecrop-nuxt init

# Option C: Use npm pack to create a tarball (simulates real npm install)
cd /path/to/stonecrop/nuxt
npm pack
cd /tmp/my-test-app
npm install /path/to/stonecrop/nuxt/stonecrop-nuxt-<version>.tgz
npx stonecrop-nuxt init
```

> **Note:** Option A uses `--cwd` to specify the target directory while running from within
> the nuxt package where dependencies are available. Options B and C install the package
> into the test project so dependencies are resolved correctly.

**4. Interactive testing:**

The CLI will detect that you're in a Nuxt project and prompt for features:

```
🌱 Stonecrop Nuxt Installer

✔ Nuxt project detected

? Select features to install
  ◉ @stonecrop/nuxt - Frontend module
  ◯ @stonecrop/nuxt-grafserv - GraphQL server
  ◯ @stonecrop/casl-middleware - Authorization
  ◉ Sample doctypes
```

**5. Verify the installation:**

After running the installer, check:
- `package.json` has the new dependencies
- `nuxt.config.ts` has the module configuration
- `doctypes/` folder contains sample schemas (if selected)
- `server/` folder contains GraphQL files (if selected)

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/@stonecrop/nuxt/latest.svg?style=flat&colorA=020420&colorB=00DC82
[npm-version-href]: https://npmjs.com/package/@stonecrop/nuxt

[npm-downloads-src]: https://img.shields.io/npm/dm/@stonecrop/nuxt.svg?style=flat&colorA=020420&colorB=00DC82
[npm-downloads-href]: https://npm.chart.dev/@stonecrop/nuxt
