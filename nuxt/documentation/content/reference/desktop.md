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
| elements | `ActionElements[] \| undefined` | no | `[]` |  |

**Events:**

| Event | Payload | Description |
|-------|---------|-------------|
| actionClick | `[label: string, action: (() => void \| Promise<void>) \| undefined]` |  |

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
| routeAdapter | `RouteAdapter \| undefined` | no |  | Pluggable router adapter. When provided, Desktop uses these functions for all routing instead of reaching into the registry's internal Vue Router instance. Nuxt hosts (or any host with custom route conventions) should supply this. |

**Events:**

| Event | Payload | Description |
|-------|---------|-------------|
| action | `[payload: ActionEventPayload]` |  |
| navigate | `[target: NavigationTarget]` |  |
| record:open | `[payload: RecordOpenEventPayload]` |  |
| load-records | `[payload: LoadRecordsEventPayload]` |  |
| load-record | `[payload: LoadRecordEventPayload]` |  |

### SheetNav

Vue component exported from @stonecrop/desktop.

```typescript
import { SheetNav } from '@stonecrop/desktop'
```

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| breadcrumbs | `{ title: string; to: string; }[] \| undefined` | no | `[]` |  |

## Other Components

### StonecropDesktop

```typescript
export { StonecropDesktop }
```

## Type Aliases

### ActionElements

Superset of all element types in the Action Set

**Definition:**

```typescript
export type ActionElements = ButtonElement | DropdownElement;
```

### BaseElement

Base type for elements in the Action Set

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

