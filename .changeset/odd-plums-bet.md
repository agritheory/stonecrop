---
"@stonecrop/desktop": major
---

Replace the legacy floating ActionSet with a tile column and drawer UI integrated into Desktop. Search opens the command palette; host slots render in the drawer; FSM transitions and commands populate the Actions list; slot components open a 50% preview flyin via `useActionSet()`.

Desktop adds `actionSetSlots`, `hostActions`, and a `#default` slot for host-controlled pages. DocBuilder now runs inside Desktop with `useDocBuilderRouteAdapter()` and `:host-actions`. The fullstack example uses `:action-set-slots` and `ActionSetIcon*`.

`@stonecrop/themes` adds `--sc-action-set-drawer-width` and `--sc-danger-color` to the token floor.

**Breaking:** The old standalone ActionSet API (`embedded`, `#rail` slot) is removed — use Desktop with `#default` and `hostActions` instead. On the flyin branch, rename interim APIs before upgrading: `DocumentRail` / `useDocumentRail` / `RailIcon*` / `railSlots` → `ActionSet` / `useActionSet` / `ActionSetIcon*` / `actionSetSlots`; `RailSubject` → `ActionSetPreview`; `DocumentRailSlot` → `ActionSetSlot`.
