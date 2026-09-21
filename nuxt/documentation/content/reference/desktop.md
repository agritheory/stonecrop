---
title: Desktop API Reference
description: Desktop navigation and command palette
---

# Desktop API Reference

> This documentation is automatically generated from the TypeScript API.

## Vue Components

### ActionSet

Vue component exported from @stonecrop/desktop.

```typescript
import { ActionSet } from '@stonecrop/desktop'
```

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| slots | `ActionSetSlot[] \| undefined` | no | `[]` |  |
| elements | `ActionElements[] \| undefined` | no | `[]` |  |
| controller | `ActionSetController` | yes |  |  |

**Events:**

| Event | Payload | Description |
|-------|---------|-------------|
| actionClick | `[label: string, action: (() => void \| Promise<void>) \| undefined]` |  |
| drawerChange | `[open: boolean]` |  |
| search | `[]` |  |

**Exposed:**

| Name | Type |
|------|------|
| closeDrawer | `() => void` |

### CommandPalette

Vue component exported from @stonecrop/desktop.

```typescript
import { CommandPalette } from '@stonecrop/desktop'
```

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| search | `(query: string) => T[]` | yes |  |  |
| isOpen | `boolean \| undefined` | no | `false` |  |
| placeholder | `string \| undefined` | no | `"Type a command or search..."` |  |
| maxResults | `number \| undefined` | no | `10` |  |

**Events:**

| Event | Payload | Description |
|-------|---------|-------------|
| select | `[T]` |  |
| close | `[]` |  |

**Slots:**

| Slot | Props | Description |
|------|-------|-------------|
| title | `any` |  |
| content | `any` |  |
| empty | `any` |  |

### Desktop

Vue component exported from @stonecrop/desktop.

```typescript
import { Desktop } from '@stonecrop/desktop'
```

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| availableDoctypes | `string[] \| undefined` | no | `[]` |  |
| routeAdapter | `RouteAdapter \| undefined` | no |  |  |
| actionSetSlots | `ActionSetSlot[] \| undefined` | no |  |  |
| hostActions | `ActionElements[] \| undefined` | no |  |  |

**Events:**

| Event | Payload | Description |
|-------|---------|-------------|
| action | `[payload: ActionEventPayload]` |  |
| navigate | `[target: NavigationTarget]` |  |
| record:open | `[payload: RecordOpenEventPayload]` |  |
| load-records | `[payload: LoadRecordsEventPayload]` |  |
| load-record | `[payload: LoadRecordEventPayload]` |  |

**Slots:**

| Slot | Props | Description |
|------|-------|-------------|
| default | `{}` |  |
| sheetnav-toolbar | `{}` |  |

### SheetNav

Vue component exported from @stonecrop/desktop.

```typescript
import { SheetNav } from '@stonecrop/desktop'
```

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| breadcrumbs | `{ title: string; to: string; }[] \| undefined` | no | `[]` |  |

**Slots:**

| Slot | Props | Description |
|------|-------|-------------|
| toolbar | `{}` |  |

## Other Components

### ActionSetIconActions

```typescript
export { ActionSetIconActions }
```

### ActionSetIconApprovals

```typescript
export { ActionSetIconApprovals }
```

### ActionSetIconChat

```typescript
export { ActionSetIconChat }
```

### ActionSetIconEmail

```typescript
export { ActionSetIconEmail }
```

### ActionSetIconFiles

```typescript
export { ActionSetIconFiles }
```

### ActionSetIconHelp

```typescript
export { ActionSetIconHelp }
```

### ActionSetIconPrint

```typescript
export { ActionSetIconPrint }
```

### ActionSetIconReports

```typescript
export { ActionSetIconReports }
```

### ActionSetIconSearch

```typescript
export { ActionSetIconSearch }
```

### ActionSetIconSettings

```typescript
export { ActionSetIconSettings }
```

### StonecropDesktop

```typescript
export { StonecropDesktop }
```

## Functions

### useActionSet

**Signature:**

```typescript
export declare function useActionSet(): ActionSetContext;
```

## Type Aliases

### ActionElements

Superset of all element types in the Action Set

**Definition:**

```typescript
export type ActionElements = ButtonElement | DropdownElement;
```

### ActionSetContext

Instance-scoped ActionSet API provided by Desktop to slot content.

**Definition:**

```typescript
export type ActionSetContext = {
    doctype: ComputedRef<string>;
    recordId: ComputedRef<string>;
    activeSlotId: ComputedRef<ActionSetSlotId | null>;
    present: (subject: ActionSetPreview) => void;
    closePreview: () => void;
    close: () => void;
};
```

### ActionSetPreview

A presented subject occupies the compressed-document (50%) surface.

**Definition:**

```typescript
export type ActionSetPreview = {
    id?: string;
    view: Component;
    props?: Record<string, unknown>;
};
```

### ActionSetSlot

Host-declared drawer slot on the ActionSet tile column.

**Definition:**

```typescript
export type ActionSetSlot = {
    id: ActionSetSlotId;
    label: string;
    icon?: Component;
    component?: Component;
    badge?: MaybeRef<number>;
    show?: boolean;
};
```

### ActionSetSlotId

Host-chosen identifier for an ActionSet slot.

**Definition:**

```typescript
export type ActionSetSlotId = string;
```

### BaseElement

**Definition:**

```typescript
export type BaseElement = {
    label: string;
    show?: boolean;
};
```

### ButtonElement

Button elements

**Definition:**

```typescript
export type ButtonElement = BaseElement & ElementAction & {
    type: 'button';
    disabled?: boolean;
};
```

### DropdownElement

Dropdown elements

**Definition:**

```typescript
export type DropdownElement = BaseElement & {
    type: 'dropdown';
    actions: ElementAction[];
};
```

### ElementAction

Element actions

**Definition:**

```typescript
export type ElementAction = BaseElement & {
    link?: string;
    action?: () => void;
};
```

### LoadRecordEventPayload

Payload emitted with the 'load-record' event when Desktop needs a single record

**Definition:**

```typescript
export type LoadRecordEventPayload = {
    doctype: string;
    recordId: string;
};
```

### LoadRecordsEventPayload

Payload emitted with the 'load-records' event when Desktop needs records for a list view

**Definition:**

```typescript
export type LoadRecordsEventPayload = {
    doctype: string;
};
```

### NavigationTarget

Navigation target passed to RouteAdapter.navigate and emitted with the 'navigate' event

**Definition:**

```typescript
export type NavigationTarget = {
    view: 'doctypes' | 'records' | 'record';
    doctype?: string;
    recordId?: string;
};
```

### RecordOpenEventPayload

Payload emitted with the 'record:open' event

**Definition:**

```typescript
export type RecordOpenEventPayload = {
    doctype: string;
    recordId: string;
};
```

### RouteAdapter

Adapter that lets host applications (Nuxt, etc.) supply their own routing layer. When provided as a prop, Desktop uses these functions instead of reaching into the Vue Router instance baked into the Stonecrop registry.

**Definition:**

```typescript
export type RouteAdapter = {
    getCurrentDoctype: () => string;
    getCurrentRecordId: () => string;
    getCurrentView: () => 'doctypes' | 'records' | 'record';
    navigate: (target: NavigationTarget) => void | Promise<void>;
};
```

## Variables

### ActionSet

**Type:**

```typescript
export const ActionSet: typeof __VLS_export
```

### CommandPalette

**Type:**

```typescript
export const CommandPalette: typeof __VLS_export
```

### Desktop

**Type:**

```typescript
export const Desktop: typeof __VLS_export
```

### SHEET_NAV_TOOLBAR_SELECTOR

Teleport target for footer controls rendered anywhere on the page: `<Teleport :to="SHEET_NAV_TOOLBAR_SELECTOR">`.

**Type:**

```typescript
export const SHEET_NAV_TOOLBAR_SELECTOR: 
```

### SheetNav

**Type:**

```typescript
export const SheetNav: typeof __VLS_export
```

## Re-exported

Declared elsewhere and re-exported by this package.

| Name | From |
|------|------|
| ActionEventPayload | `./types` |

