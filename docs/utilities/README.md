# Utilities Documentation

> This documentation is automatically generated from the TypeScript API.

<h2>Functions</h2>

### install

**Signature:**

```typescript
declare function install(app: App): void;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| app | `App` |  |

### useKeyboardNav

**Signature:**

```typescript
export declare function useKeyboardNav(options: KeyboardNavigationOptions[]): void;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| options | `KeyboardNavigationOptions[]` |  |

<h2>Type Aliases</h2>

### KeyboardNavigationOptions

**Definition:**

```typescript
export type KeyboardNavigationOptions = {
    parent?: string | HTMLElement | Ref<HTMLElement>;
    selectors?: string | HTMLElement | HTMLElement[] | ComponentPublicInstance[] | Ref<HTMLElement> | Ref<HTMLElement[]> | Ref<ComponentPublicInstance[]>;
    handlers?: KeypressHandlers;
};
```

### KeypressHandlers

**Definition:**

```typescript
export type KeypressHandlers = {
    [key: string]: (ev: KeyboardEvent) => any;
};
```

<h2>Variables</h2>

### defaultKeypressHandlers

**Type:**

```typescript
export const defaultKeypressHandlers: KeypressHandlers
```

