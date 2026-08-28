---
title: Node Editor API Reference
description: Visual FSM workflow editor
---

# Node_editor API Reference

> This documentation is automatically generated from the TypeScript API.

## Vue Components

### NodeEditor

Vue component exported from @stonecrop/node_editor.

```typescript
import { NodeEditor } from '@stonecrop/node_editor'
```

### StateEditor

Vue component exported from @stonecrop/node_editor.

```typescript
import { StateEditor } from '@stonecrop/node_editor'
```

## Functions

### install

Install all Node Editor components

**Signature:**

```typescript
declare function install(app: App): void;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| app | `App` | Vue app instance |

## Type Aliases

### FlowElement

Flow element

**Definition:**

```typescript
export type FlowElement = Element<{
    hasInput?: boolean;
    hasOutput?: boolean;
}, {
    hasInput?: boolean;
    hasOutput?: boolean;
    actionKey?: string;
}>;
```

### FlowElements

Flow elements

**Definition:**

```typescript
export type FlowElements = Elements<{
    hasInput?: boolean;
    hasOutput?: boolean;
}, {
    hasInput?: boolean;
    hasOutput?: boolean;
    actionKey?: string;
}>;
```

### Layout

Node layout

**Definition:**

```typescript
export type Layout = {
    [key: string]: {
        position?: XYPosition;
        targetPosition?: Position;
        sourcePosition?: Position;
    };
};
```

