---
title: Utilities API Reference
description: Shared utility functions
---

# Utilities API Reference

> This documentation is automatically generated from the TypeScript API.

## Functions

### fromISODate

Reads a `YYYY-MM-DD` day. Anything that is not a real day written exactly that way reads as no day.

Not `Temporal.PlainDate.from` alone: it also takes the day out of a date-time, which would show a day field over a date-time column as a day instead of as the mismatch it is.

**Signature:**

```typescript
export declare function fromISODate(day: string): Temporal.PlainDate | undefined;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| day | `string` | The day, as `YYYY-MM-DD` |

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
    parent?: string | HTMLElement | Readonly<Ref<HTMLElement | null>>;
    selectors?: string | HTMLElement | HTMLElement[] | ComponentPublicInstance[] | Readonly<Ref<HTMLElement | null>> | Readonly<Ref<HTMLElement[] | null>> | Readonly<Ref<ComponentPublicInstance[] | null>>;
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

