# ADR: Badge component authoring and presentation

## Status

Accepted

## Context

List views and forms need to show Select values with semantic color (Task status, Sales Order fulfillment, Issue priority). ERPNext solves this with per-doctype `get_indicator` functions and global status heuristics. Stonecrop already has:

- `FieldOptions` as `string[] | Record<string, unknown>` for Select choices and input config bags
- `format` serialized functions with row context in ATable
- No badge component or color map in schema today

We considered three designs:

1. A new `badge` field sibling to `format` with a single `resolveBadge()` function
2. A BadgeKit cascade with app palettes, doctype-level indicators, and click-to-filter
3. Extending `options` for simple maps and `format` returning a badge descriptor for complex cases

We also needed different paint in tables vs forms: full cell fill in ATable, left-border accent inside the input in AForm.

## Decision

- **Mapping:** Simple cases use `options` — either a bare `{ value: variant }` map or `{ choices, badges }`. Complex cases use existing `format`, which may return `{ label, variant, color? }`.
- **Paint:** Theme tokens `--sc-badge-{variant}-bg|text|accent`. Apps may override with `color` on a map entry or descriptor.
- **Component:** `ABadge` in `@stonecrop/aform` with required `presentation`: `cell-fill` (table) or `input-accent` (form).
- **Wiring:** `schemaToColumns` passes `options` through to `TableColumn`. ACell renders `ABadge` as `cell-fill` when `format` returns a descriptor, or when the column's `options` carry a badge map. ADropdown applies `input-accent` in display and edit when a badge resolves.

No new schema property, no doctype-level indicator registry, no click-to-filter in v1.

## Consequences

- Plain `string[]` Selects stay uncolored; badge maps are an explicit opt-in.
- `isSelectChoiceMap` must distinguish badge maps from quantity/currency config objects.
- Form `format` functions get no row context. ATable supplies `{ table, row, column }` from the store, which owns the data; the AForm equivalent would have to be built the same way, at the call site — not by passing the data model down as a prop to every field.
- ACell renders `'ABadge'` by global registration to avoid an aform↔atable import cycle.
- Future work could add doctype-level indicators or filter actions without changing the descriptor shape.
