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

