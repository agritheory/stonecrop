---
title: Utilities API Reference
description: Shared utility functions
---

# Utilities API Reference

> This documentation is automatically generated from the TypeScript API.

## Functions

### fromISODate

Reads a `YYYY-MM-DD` day as its local midnight, the Date a calendar shows as that day. Anything that is not a real day written that way reads as an invalid Date.

**Signature:**

```typescript
export declare function fromISODate(day: string): Date;
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

### toISODate

Writes a Date as the `YYYY-MM-DD` day it falls on in local time, the day a calendar showed for it. Not `toISOString()`, which gives the UTC day: a day early east of UTC.

**Signature:**

```typescript
export declare function toISODate(date: Date): string;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| date | `Date` | The Date to write |

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

