---
title: Utilities API Reference
description: Shared utility functions
---

# Utilities API Reference

> This documentation is automatically generated from the TypeScript API.

## Functions

### compareSemver

Orders two versions by SemVer 2.0.0 precedence: major, minor and patch as numbers, a prerelease before its release, and prerelease identifiers one by one. Build metadata does not count, so `1.4.0+a` and `1.4.0+b` compare equal. Text that is not a version comes after every version.

**Signature:**

```typescript
export declare function compareSemver(a: string, b: string): number;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| a | `string` | The first version |
| b | `string` | The second version |

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

### isSemver

Whether the text is a version under SemVer 2.0.0: `1.4.0`, `1.4.0-beta.2`, `1.4.0+build.5`. A `v` prefix, a missing part (`1.4`) and a leading zero (`01.4.0`) are not.

**Signature:**

```typescript
export declare function isSemver(text: string): boolean;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| text | `string` | The text to check |

### isSemverPrefix

Whether typing more could still make the text a version: `1.`, `1.4.0-` and the empty text can, while `v1`, `01` and `1.4-beta` cannot. Every version passes, so a box that refuses any edit failing this one never stops someone typing a version.

**Signature:**

```typescript
export declare function isSemverPrefix(text: string): boolean;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| text | `string` | The text so far |

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

