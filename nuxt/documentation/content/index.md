---
title: Stonecrop
description: Schema-driven UI framework for business applications
---

# Stonecrop

---

Documentation for Stonecrop, the schema-driven UI framework for Vue 3 business applications.

Stonecrop pairs AForm's schema-driven fields with ATable's advanced grid, backed by a Hierarchical State Tree for undo/redo and field triggers, plus a full-stack GraphQL layer for wiring it all to a database. It's built for type-safe forms, tables, and workflows that come from a single schema definition.

::card-grid
  :::card-grid-item{href="/tutorials/" title="Tutorials" description="Learning-oriented guides to help you get started" color="blue"}
  :::

  :::card-grid-item{href="/guides/" title="Guides" description="Task-oriented how-to guides and live example sandboxes" color="purple"}
  :::

  :::card-grid-item{href="/reference/" title="Reference" description="Technical API documentation for every package, plus live component demos" color="amber"}
  :::

  :::card-grid-item{href="/explanation/" title="Explanation" description="Understanding-oriented discussions of architecture and design" color="rose"}
  :::
::

## Packages

| Package | Description |
|---------|-------------|
| [@stonecrop/stonecrop](/reference/stonecrop) | Core orchestration with Registry, HST, and composables |
| [@stonecrop/aform](/reference/aform) | Schema-driven form components |
| [@stonecrop/atable](/reference/atable) | Advanced table with tree/Gantt views |
| [@stonecrop/beam](/reference/beam) | Mobile-first scanning and MQTT |
| [@stonecrop/desktop](/reference/desktop) | Desktop navigation and command palette |
| [@stonecrop/schema](/reference/schema) | Doctype schema definitions |
| [@stonecrop/graphql-client](/reference/graphql-client) | GraphQL client utilities |
| [@stonecrop/graphql-middleware](/reference/graphql-middleware) | PostGraphile middleware |
| [@stonecrop/casl-middleware](/reference/casl-middleware) | CASL authorization for GraphQL |
| [@stonecrop/rockfoil](/reference/rockfoil) | Server-side utilities |
| [@stonecrop/nuxt](/reference/) | Nuxt module integration |
| [@stonecrop/nuxt-grafserv](/reference/) | Nuxt + Grafserv module |
| [@stonecrop/themes](/reference/) | CSS themes |
| [@stonecrop/utilities](/reference/utilities) | Shared utility functions |
