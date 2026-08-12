---
title: API Reference
description: Technical API documentation for all Stonecrop packages
---

# API Reference

Technical documentation for all packages in the Stonecrop monorepo. API documentation is automatically generated from TypeScript source code using API Extractor.

Looking for a specific `aform` field's props and a live demo rather than a package-level API dump? See [Components](/components/) for interactive, per-component documentation.

## Core Packages

| Package | Description | Status |
|---------|-------------|--------|
| [@stonecrop/stonecrop](./stonecrop) | Core orchestration with Registry, HST, and composables | Production |
| [@stonecrop/aform](./aform) | Schema-driven form components with validation | Production |
| [@stonecrop/atable](./atable) | Advanced table with tree views and Gantt charts | Production |

## UI Components

| Package | Description | Status |
|---------|-------------|--------|
| [@stonecrop/beam](./beam) | Mobile-first scanning and MQTT integration | Prototype |
| [@stonecrop/desktop](./desktop) | Desktop navigation and command palette | Prototype |
| [@stonecrop/node-editor](./node-editor) | Visual FSM workflow editor | Prototype |
| [@stonecrop/code-editor](./code-editor) | Monaco-based code editor component | Prototype |

## Backend / Middleware

| Package | Description | Status |
|---------|-------------|--------|
| [@stonecrop/schema](./schema) | Doctype schema definitions and Zod validation | Utilities |
| [@stonecrop/graphql-client](./graphql-client) | GraphQL client utilities | Utilities |
| [@stonecrop/graphql-middleware](./graphql-middleware) | PostGraphile middleware plugin | Utilities |
| [@stonecrop/casl-middleware](./casl-middleware) | CASL authorization for GraphQL | Production |
| [@stonecrop/rockfoil](./rockfoil) | Server-side PostgreSQL utilities | Production |

## Utilities

| Package | Description | Status |
|---------|-------------|--------|
| [@stonecrop/utilities](./utilities) | Shared utility functions | Utilities |
| @stonecrop/themes | CSS themes (no TypeScript API) | Prototype |

## Nuxt Modules

| Package | Description | Status |
|---------|-------------|--------|
| @stonecrop/nuxt | Nuxt module for Stonecrop integration | Prototype |
| @stonecrop/nuxt-grafserv | Nuxt + Grafserv GraphQL module | Production |

::: info Note on Nuxt Modules
Nuxt modules use a different build system and their APIs are documented in their respective README files rather than through API Extractor.
:::

## Package Status Legend

- **Production**: Stable API, suitable for production use
- **Utilities**: Internal utilities, API may change
- **Prototype**: Under active development, expect breaking changes

