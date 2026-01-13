---
title: Rockfoil API Reference
description: Server-side utilities
---

# Rockfoil API Reference

> This documentation is automatically generated from the TypeScript API.

## Functions

### createPglRockfoilPlugin

Creates a PostGraphile plugin that wraps GraphQL query and mutation plans with before/after hooks

**Signature:**

```typescript
createPglRockfoilPlugin: (hookMap: HookConfig) => GraphileConfig.Plugin
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| hookMap | `HookConfig` |  |

## Interfaces

### HookConfig

Configuration object mapping field names to their before/after hooks for queries and mutations

**Definition:**

```typescript
export interface HookConfig {
}
```

### HookPlan

Internal mapping of field names to their plan wrapper rules

**Definition:**

```typescript
export interface HookPlan {
}
```

