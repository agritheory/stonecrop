---
layout: home

hero:
  name: Stonecrop
  text: Schema-driven UI framework
  tagline: Build business applications with type-safe forms, tables, and workflows
  actions:
    - theme: brand
      text: Get Started
      link: /tutorials/
    - theme: alt
      text: API Reference
      link: /reference/
    - theme: alt
      text: View on GitHub
      link: https://github.com/agritheory/stonecrop

features:
  - icon:
      src: ./assets/schema-icon.svg
    title: Schema-Driven Forms
    details: AForm renders forms from schema definitions with built-in validation, masking, and a rich set of field components.
  - icon: 
      src: ./assets/advanced-tables-icon.svg
    title: Advanced Tables
    details: ATable provides sortable, filterable tables with tree views, Gantt charts, and inline editing.
  - icon:
      src: ./assets/state-management-icon.svg
    title: State Management
    details: Hierarchical State Tree (HST) with undo/redo, field triggers, and XState workflow integration.
  - icon:
      src: ./assets/graph-ql-logo.svg
    title: GraphQL Integration
    details: Full-stack GraphQL middleware with PostGraphile, CASL authorization, and Nuxt modules.
---

## Documentation Structure

This documentation follows the [Divio documentation framework](https://documentation.divio.com/):

- **[Tutorials](/tutorials/)** — Learning-oriented guides to help you get started
- **[Guides](/guides/)** — Task-oriented how-to guides for specific problems
- **[Reference](/reference/)** — Technical API documentation for all packages
- **[Explanation](/explanation/)** — Understanding-oriented discussions of architecture and design

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
| [@stonecrop/themes](/reference/themes) | CSS token floor |
| [@stonecrop/utilities](/reference/utilities) | Shared utility functions |

