---
title: Desktop API Reference
description: Desktop navigation and command palette
---

# Desktop API Reference

> This documentation is automatically generated from the TypeScript API.

## Vue Components

### ActionEventPayload

Vue component exported from @stonecrop/desktop.

```typescript
import { ActionEventPayload } from '@stonecrop/desktop'
```

### ActionSet

Vue component exported from @stonecrop/desktop.

```typescript
import { ActionSet } from '@stonecrop/desktop'
```

### CommandPalette

Vue component exported from @stonecrop/desktop.

```typescript
import { CommandPalette } from '@stonecrop/desktop'
```

### Desktop

Vue component exported from @stonecrop/desktop.

```typescript
import { Desktop } from '@stonecrop/desktop'
```

### SheetNav

Vue component exported from @stonecrop/desktop.

```typescript
import { SheetNav } from '@stonecrop/desktop'
```

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

