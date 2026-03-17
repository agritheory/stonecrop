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
  "schema": [
    {
      "fieldname": "title",
      "label": "Title",
      "fieldtype": "Data",
      "required": true
    },
    {
      "fieldname": "description",
      "label": "Description",
      "fieldtype": "Text"
    },
    {
      "fieldname": "completed",
      "label": "Completed",
      "fieldtype": "Check"
    }
  ]
}
```

The module picks up this file and, if `pageComponent` is configured, registers a route at the doctype's `slug` value (or `task` if no slug is set), passing the parsed schema into `route.meta`.

### Wire Up Your Data Client

After installing the module, add a client-side plugin to connect your data transport. The `useStonecropRegistry()` composable gives you a stable API for this — no need to reach into `globalProperties` directly:

```typescript
// app/plugins/stonecrop.client.ts
import { StonecropClient } from '@stonecrop/graphql-client'

export default defineNuxtPlugin(() => {
  const client = new StonecropClient({ endpoint: '/graphql' })
  const { setMeta, setFetchRecord, setFetchRecords } = useStonecropRegistry()

  // Map the route path/segments to a doctype name, then delegate to your client
  setMeta(({ segments }) => client.getMeta({ doctype: segments[0] }))
  setFetchRecord((doctype, id) => client.getRecord(doctype, id))
  setFetchRecords((doctype) => client.getRecords(doctype))
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
  },

  // Import Stonecrop theme
  css: [
    '@stonecrop/themes/default/default.css',
    // or your custom theme
  ]
})
```

### Module Options

| Option | Type | Description |
|--------|------|-------------|
| `pageComponent` | `string` | Path (relative to `srcDir`) to your page component. The module registers one route per doctype at `/<slug>`, passing `schema` and `doctype` in `route.meta`. |
| `routeStrategy` | `RouteStrategyFn` | Custom function receiving all parsed doctypes; returns a `NuxtPage[]`. Takes priority over `pageComponent`. |
| `docbuilder` | `boolean` | Enable the DocBuilder feature at `/docbuilder`. Defaults to `false`. |
| `doctypesDir` | `string` | Override the doctypes directory path. Defaults to `doctypes/` inside `srcDir`. |

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
    .filter(({ data }) => !data.parentDoctype) // skip child tables
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

## `useStonecropRegistry()` — Configuring the Framework After Install

The `@stonecrop/nuxt` runtime plugin installs `StonecropPlugin` with a router but no data transport, because data clients (GraphQL, tRPC, REST) are application-defined and cannot be serialised through `nuxt.config.ts` module options.

`useStonecropRegistry()` is the documented extension point for wiring your data transport after plugin install. Call it in a client-side plugin:

```typescript
// app/plugins/stonecrop.client.ts
export default defineNuxtPlugin(() => {
  const { setMeta, setFetchRecord, setFetchRecords } = useStonecropRegistry()

  // setMeta — resolves doctype metadata from the current route
  // The context has { path, segments } from the router; adapt to your API.
  setMeta(async ({ segments }) => {
    // Example: segments[0] is the doctype slug, e.g. "task" from /task/123
    const doctype = segments[0]
    const meta = await $fetch(`/api/doctypes/${doctype}`)
    return meta
  })

  // setFetchRecord — replaces the default REST stub in useStonecrop({ recordId })
  setFetchRecord(async (doctype, id) => {
    return await $fetch(`/api/${doctype.slug}/${id}`)
  })

  // setFetchRecords — replaces the default REST stub for list loading
  setFetchRecords(async (doctype) => {
    return await $fetch(`/api/${doctype.slug}`)
  })
})
```

**Why a composable and not module options?** Nuxt module options are serialised at build time — functions cannot be passed through `nuxt.config.ts`. `useStonecropRegistry()` is the composable equivalent of `usePinia()` or `useNuxtApp()`: a stable, typed API for configuring the framework singleton after it has been installed.

### API

| Method | Signature | Description |
|--------|-----------|-------------|
| `setMeta` | `(fn: (ctx) => DoctypeMeta \| Promise<DoctypeMeta>) => void` | Sets the `getMeta` function on the Registry. Called by `useStonecrop()` to lazy-load doctype metadata for the current route. `ctx` = `{ path, segments }`. |
| `setFetchRecord` | `(fn: (doctype, id) => Promise<Record \| null>) => void` | Replaces the default REST fetch stub in `Stonecrop.getRecord()`. Enables GraphQL-backed or any other custom transport. |
| `setFetchRecords` | `(fn: (doctype) => Promise<Record[]>) => void` | Replaces the default REST fetch stub in `Stonecrop.getRecords()`. |
| `registry` | `Registry` | The raw Registry instance, for advanced use cases. |

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
const parent = taskNode.getParent() // Returns project node
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

Check out the [playground](./playground) for an example featuring:
- Permission management system (RBAC)
- DocType builder with visual state machine editor
- Complex nested forms with relationships
- Table views with inline editing
- HST state visualization


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
npm install /path/to/stonecrop/nuxt/stonecrop-nuxt-0.6.3.tgz
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
