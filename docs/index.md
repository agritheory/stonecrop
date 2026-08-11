---
title: Stonecrop
description: Schema-driven UI framework for business applications
---

# Stonecrop

---

Documentation for Stonecrop, the schema-driven UI framework for Vue 3 business applications.

Stonecrop pairs AForm's schema-driven fields with ATable's advanced grid, backed by a Hierarchical State Tree for undo/redo and field triggers, plus a full-stack GraphQL layer for wiring it all to a database. It's built for type-safe forms, tables, and workflows that come from a single schema definition.

<CardGrid>

<CardGridItem href="/tutorials/" title="Tutorials" description="Learning-oriented guides to help you get started" color="blue">

<template #icon>

<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 2 8l10 5 10-5-10-5Z"/><path d="M6 10.5V16c0 1.5 2.5 3 6 3s6-1.5 6-3v-5.5"/></svg>

</template>

</CardGridItem>

<CardGridItem href="/guides/" title="Guides" description="Task-oriented how-to guides for specific problems" color="purple">

<template #icon>

<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M15 9l-2 6-6 2 2-6 6-2Z"/></svg>

</template>

</CardGridItem>

<CardGridItem href="/components/" title="Components" description="Live, interactive documentation for individual components" color="teal">

<template #icon>

<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>

</template>

</CardGridItem>

<CardGridItem href="/reference/" title="Reference" description="Technical API documentation for all packages" color="amber">

<template #icon>

<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v17H6.5A2.5 2.5 0 0 0 4 21.5v-17Z"/><path d="M4 4.5v17"/></svg>

</template>

</CardGridItem>

<CardGridItem href="/explanation/" title="Explanation" description="Understanding-oriented discussions of architecture and design" color="rose">

<template #icon>

<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.6.6 1 1.4 1 2.5h6c0-1.1.4-1.9 1-2.5A6 6 0 0 0 12 3Z"/></svg>

</template>

</CardGridItem>

<CardGridItem href="/stories/" title="Examples" description="Live component stories and sandboxes" color="indigo">

<template #icon>

<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18"/><path d="M10.5 12.5v4l3.5-2Z" fill="currentColor" stroke="none"/></svg>

</template>

</CardGridItem>

</CardGrid>

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
