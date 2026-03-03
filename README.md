# Stonecrop

![Test Status](https://github.com/agritheory/stonecrop/actions/workflows/tests.yml/badge.svg) ![Lint Status](https://github.com/agritheory/stonecrop/actions/workflows/lint.yml/badge.svg)

This repository contains all the packages used in the Stonecrop project. It is managed with [Rush](https://rushjs.io).

### What is it?

These packages in combination create an application that creates a schema driven UI and system of event driven hooks (actual hooks, not the React kind which are not hooks at all). These are available in both the UI and as server middleware.

### Getting Started

This project has the following system dependencies:

- [`pnpm`](https://pnpm.io/) (using yarn or npm will break packages)
- [`rush`](https://rushjs.io/)
- Node v22 LTS ([installation instructions](https://nodejs.org/en/download/package-manager))

```bash
git clone stonecrop
# or
git pull

# install dependencies
cd stonecrop
rush update
rush rebuild

# Work on aform, for example
cd aform

# sometimes, when changing branches or updating dependencies you may have issues
# this command removes and re-links all dependencies
rush purge && rush update && rush rebuild

# Provide changelog for release
rush change

# Stage changes and run linters
rushx lint
```

### Projects

**Foundation**
- [`@stonecrop/schema`](./schema/README.md) — Doctype schema definitions, field types, naming utilities, and GraphQL→doctype converter
- [`@stonecrop/themes`](./themes/README.md) — Shared CSS tokens and design system themes
- [`@stonecrop/utilities`](./utilities/README.md) — Shared helper functions and type utilities
- [`@stonecrop/beam`](./beam/README.md) — UI component library with consistent theming
- [`@stonecrop/rockfoil`](./rockfoil/CHANGELOG.md) — Base configuration and rig package

**Middleware & Data Layer**
- [`@stonecrop/casl-middleware`](./casl_middleware/README.md) — CASL-based authorisation middleware
- [`@stonecrop/graphql-middleware`](./graphql_middleware/README.md) — GraphQL query/mutation middleware using doctype schemas
- [`@stonecrop/graphql-client`](./graphql_client/README.md) — Vue composables for GraphQL data fetching

**Core UI**
- [`@stonecrop/atable`](./atable/README.md) — Advanced data table with Excel-like navigation and editing
- [`@stonecrop/aform`](./aform/CHANGELOG.md) — Schema-driven form components with validation
- [`@stonecrop/code-editor`](./code_editor/CHANGELOG.md) — Code editor component
- [`@stonecrop/stonecrop`](./stonecrop/README.md) — Core orchestration: Registry, HST state management, and workflow engine

**Application**
- [`@stonecrop/desktop`](./desktop/README.md) — Desktop-specific UI patterns and command palette
- [`@stonecrop/node-editor`](./node_editor/README.md) — Visual FSM editor with Vue Flow integration

**Nuxt Integration**
- [`@stonecrop/nuxt`](./nuxt/README.md) — Nuxt module: schema-driven routing, pages, and layouts
- [`@stonecrop/nuxt-grafserv`](./nuxt_grafserv/README.md) — PostGraphile/Grafserv integration for Nuxt

### Dependency Tree

```mermaid
flowchart TB
    subgraph L0 ["Primitives"]
        schema["@stonecrop/schema"]
        themes["@stonecrop/themes"]
        utilities["@stonecrop/utilities"]
        beam["@stonecrop/beam"]
        rockfoil["@stonecrop/rockfoil"]
        casl["@stonecrop/casl-middleware"]
        node_ed["@stonecrop/node-editor"]
    end

    subgraph L1 ["Layer 1 — Data & Table"]
        atable["@stonecrop/atable"]
        gql_mw["@stonecrop/graphql-middleware"]
    end

    subgraph L2 ["Layer 2 — Components"]
        aform["@stonecrop/aform"]
        code_ed["@stonecrop/code-editor"]
        nuxt_gs["@stonecrop/nuxt-grafserv"]
    end

    subgraph L3 ["Layer 3 — Core"]
        stonecrop["@stonecrop/stonecrop"]
    end

    subgraph L4 ["Layer 4 — Applications"]
        gql_cl["@stonecrop/graphql-client"]
        desktop["@stonecrop/desktop"]
    end

    subgraph L5 ["Layer 5 — Nuxt Integration"]
        nuxt["@stonecrop/nuxt"]
    end

    themes & utilities          --> atable
    schema                      --> gql_mw
    atable & themes & utilities --> aform
    atable & themes & utilities --> code_ed
    gql_mw                      --> nuxt_gs
    aform & atable              --> stonecrop
    schema & stonecrop          --> gql_cl
    aform & atable & stonecrop & themes --> desktop
    aform & atable & casl & gql_mw & node_ed & nuxt_gs & schema & stonecrop --> nuxt

    classDef primitive fill:#e8f4e8,stroke:#4a8a4a,color:#1a3a1a
    classDef layer1    fill:#e8eef8,stroke:#4a6aaa,color:#1a2a4a
    classDef layer2    fill:#fdf3e3,stroke:#aa824a,color:#4a2a0a
    classDef layer3    fill:#f3e8fd,stroke:#8a4aaa,color:#3a0a4a
    classDef layer4    fill:#fde8e8,stroke:#aa4a4a,color:#4a0a0a
    classDef leaf      fill:#fff9c4,stroke:#aa8800,color:#4a3a00

    class schema,themes,utilities,beam,rockfoil,casl,node_ed primitive
    class atable,gql_mw layer1
    class aform,code_ed,nuxt_gs layer2
    class stonecrop layer3
    class gql_cl,desktop layer4
    class nuxt leaf
```
