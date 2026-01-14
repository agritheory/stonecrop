---
title: Utilities API Reference
description: Shared utility functions
---

# Utilities API Reference

> This documentation is automatically generated from the TypeScript API.

## Functions

### install

Install all utility components

**Signature:**

```typescript
declare function install(_app: App): void;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| _app | `App` | Vue app instance |

### useKeyboardNav

Keyboard navigation composable

**Signature:**

```typescript
export declare function useKeyboardNav(options: KeyboardNavigationOptions[]): void;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| options | `KeyboardNavigationOptions[]` | Keyboard navigation options |

## Type Aliases

### KeyboardNavigationOptions

Keyboard navigation options

**Definition:**

```typescript
export type KeyboardNavigationOptions = {
    parent?: string | HTMLElement | Ref<HTMLElement>;
    selectors?: string | HTMLElement | HTMLElement[] | ComponentPublicInstance[] | Ref<HTMLElement> | Ref<HTMLElement[]> | Ref<ComponentPublicInstance[]>;
    handlers?: KeypressHandlers;
};
```

### KeypressHandlers

Key press handlers

**Definition:**

```typescript
export type KeypressHandlers = {
    [key: string]: (ev: KeyboardEvent) => any;
};
```

## Variables

### defaultKeypressHandlers

Default keypress handlers for keyboard navigation

**Type:**

```typescript
export const defaultKeypressHandlers: KeypressHandlers
```

