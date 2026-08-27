---
title: Node Editor API Reference
description: Visual FSM workflow editor
---

# Node_editor API Reference

> This documentation is automatically generated from the TypeScript API.

## Vue Components

### NodeEditor

Vue component exported from @stonecrop/node-editor.

```typescript
import { NodeEditor } from '@stonecrop/node-editor'
```

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| modelValue | `FlowElements` | yes |  |  |
| nodeContainerClass | `ClassValue` | no | `""` |  |

**Events:**

| Event | Payload | Description |
|-------|---------|-------------|
| update:modelValue | `any[]` |  |

### StateEditor

Vue component exported from @stonecrop/node-editor.

```typescript
import { StateEditor } from '@stonecrop/node-editor'
```

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| nodeContainerClass | `ClassValue` | no | `""` |  |
| modelValue | `{ states?: string[] \| undefined; actions?: Record<string, { label: string; requiredFields?: string[] \| undefined; allowedStates?: string[] \| undefined; nextState?: string \| undefined; stateless?: boolean \| undefined; selfTransition?: boolean \| undefined; clientHandler?: string \| undefined; }> \| undefined; triggers?: Record<string, { on: string[]; clientHandler: string; label?: string \| undefined; }> \| undefined; layout?: Record<string, { position?: { x: number; y: number; } \| undefined; targetPosition?: "left" \| "right" \| "top" \| "bottom" \| undefined; sourcePosition?: "left" \| "right" \| "top" \| "bottom" \| undefined; }> \| undefined; } \| undefined` | no |  |  |
| layout | `Layout \| undefined` | no |  |  |

**Events:**

| Event | Payload | Description |
|-------|---------|-------------|
| update:modelValue | `[value: { states?: string[] \| undefined; actions?: Record<string, { label: string; requiredFields?: string[] \| undefined; allowedStates?: string[] \| undefined; nextState?: string \| undefined; stateless?: boolean \| undefined; selfTransition?: boolean \| undefined; clientHandler?: string \| undefined; }> \| undefined; triggers?: Record<string, { on: string[]; clientHandler: string; label?: string \| undefined; }> \| undefined; layout?: Record<string, { position?: { x: number; y: number; } \| undefined; targetPosition?: "left" \| "right" \| "top" \| "bottom" \| undefined; sourcePosition?: "left" \| "right" \| "top" \| "bottom" \| undefined; }> \| undefined; } \| undefined]` |  |
| update:layout | `[value: Layout \| undefined]` |  |

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

## Variables

### NodeEditor

**Type:**

```typescript
export const NodeEditor: typeof __VLS_export
```

### StateEditor

**Type:**

```typescript
export const StateEditor: typeof __VLS_export
```

