# Nuxt Stonecrop

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]

The official Nuxt module for Stonecrop - a schema-driven UI framework with event-driven workflows and hierarchical state management.

## What is Stonecrop?

Stonecrop is a **schema-driven UI framework** that generates forms, tables, and workflows from JSON schemas. Instead of manually creating CRUD interfaces for every data model, you define your data structure once and Stonecrop handles the UI generation, state management, and validation automatically.

**Key Benefits:**
- **Schema-Driven**: Define data models in JSON, get full CRUD interfaces automatically
- **HST State Management**: Hierarchical State Tree for complex, nested application state
- **FSM Workflows**: XState-powered finite state machines for predictable business logic
- **Nuxt Native**: First-class integration with Nuxt 4's architecture
- **Live Validation**: Real-time form validation based on schema rules
- **Excel-like Tables**: Rich table component with keyboard navigation and inline editing

## Module Features

- **Automatic Page Generation**: Creates routes from DocType schemas in your `/doctypes` folder
- **Form & Table Components**: Pre-configured AForm and ATable components with HST integration
- **Plugin System**: Auto-registers Stonecrop composables and utilities
- **Theme Support**: Import and customize Stonecrop themes
- **TypeScript First**: Full type safety and IntelliSense support
- **Zero Config**: Works out of the box with sensible defaults

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

The module automatically generates routes at `/task` for this DocType.

### Use the Stonecrop Composable

In your page or component:

```vue
<script setup lang="ts">
import taskDoctype from '~/doctypes/task.json'

// HST-reactive form setup
const { stonecrop, provideHSTPath, handleHSTChange, formData } = useStonecrop({
  doctype: taskDoctype,
  recordId: 'task-123' // or undefined for new records
})

// Access the hierarchical state tree
const taskTitle = stonecrop.getStore().get('task.task-123.title')
</script>

<template>
  <AForm
    :schema="formData.schema"
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
    // Enable DocBuilder for visual schema editing
    docbuilder: true,

    // Custom router configuration
    router: {
      // Router options
    }
  },

  // Import Stonecrop theme
  css: [
    '@stonecrop/themes/default/default.css',
    // or your custom theme
  ]
})
```

## Module Behavior

### Automatic Page Generation

The module scans your `/doctypes` folder and creates routes automatically:

```
doctypes/
  ├── task.json       → /task
  ├── user.json       → /user
  └── project.json    → /project
```

Each route uses the `StonecropPage.vue` layout that provides:
- List view with ATable component
- Detail view with AForm component
- HST state management
- Router integration for navigation

### Plugin Registration

The module auto-registers:
- `useStonecrop()` - Main composable for HST integration
- `useTableNavigation()` - Helper for table-to-detail navigation
- Pinia store configuration
- Component auto-imports (AForm, ATable, etc.)

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
