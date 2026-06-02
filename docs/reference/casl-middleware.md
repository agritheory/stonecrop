---
title: CASL Middleware API Reference
description: CASL authorization for GraphQL
---

# Casl_middleware API Reference

> This documentation is automatically generated from the TypeScript API.

## Functions

### createAbility

Create ability using a provided builder function

**Signature:**

```typescript
createAbility: (user?: Context["user"], builderFn?: AbilityBuilderFunction) => Promise<AppAbility>
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| user | `Context["user"]` | User information for building the ability |
| builderFn | `AbilityBuilderFunction` | Function to build the ability |

### createCaslMiddleware

Creates CASL authorization middleware for GraphQL resolvers

**Signature:**

```typescript
createCaslMiddleware: (options?: MiddlewareOptions) => (resolve: ResolverFn, root: any, args: any, context: Context, info: GraphQLResolveInfo) => Promise<any>
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| options | `MiddlewareOptions` | Configuration options for the middleware |

### detectSubjectType

Detects the subject type from an object for CASL authorization

**Signature:**

```typescript
detectSubjectType: (object: any) => string
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| object | `any` | The object to detect the subject type from |

## Interfaces

### AbilityResponse

Response type for ability creation mutations

**Definition:**

```typescript
export interface AbilityResponse {
  ability: any;
  message: string;
  success: boolean;
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| ability | `any` | The created ability rules |
| message | `string` | Success or error message |
| success | `boolean` | Whether the ability was created successfully |

### Context

GraphQL context with CASL ability and user information

**Definition:**

```typescript
export interface Context {
  ability?: AppAbility;
  user?: User;
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| ability? | `AppAbility` | CASL ability instance for authorization checks |
| user? | `User` | Current authenticated user |

### CreateAbilityInput

Input type for creating a new ability

**Definition:**

```typescript
export interface CreateAbilityInput {
  roles: string[];
  userId: string;
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| roles | `string[]` | Array of role names to assign |
| userId | `string` | User ID to create ability for |

### FieldPermission

Field-level permission definition for fine-grained access control

**Definition:**

```typescript
export interface FieldPermission {
  action: string;
  conditions?: any;
  field?: string;
  subject: string;
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| action | `string` | CASL action (e.g., 'read', 'write') |
| conditions? | `any` | Conditional rules for permission |
| field? | `string` | Specific field name (optional) |
| subject | `string` | Subject/resource type to apply permission to |

### MiddlewareOptions

Configuration options for CASL middleware

**Definition:**

```typescript
export interface MiddlewareOptions {
  abilityBuilder?: AbilityBuilderFunction;
  actionMap?: Record<string, string>;
  debug?: boolean;
  fieldPermissions?: Record<string, FieldPermission[]>;
  subjectMap?: Record<string, string>;
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| abilityBuilder? | `AbilityBuilderFunction` | Custom function to build user abilities |
| actionMap? | `Record<string, string>` | Mapping of GraphQL operations to CASL actions |
| debug? | `boolean` | Enable debug logging |
| fieldPermissions? | `Record<string, FieldPermission[]>` | Field-level permission rules |
| subjectMap? | `Record<string, string>` | Mapping of GraphQL types to authorization subjects |

### PluginOptions

Plugin configuration options for framework integrations

**Definition:**

```typescript
export interface PluginOptions {
  abilityBuilder?: AbilityBuilderFunction;
  cacheOptions?: {
        ttl?: number;
        key?: (user?: User) => string;
    };
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| abilityBuilder? | `AbilityBuilderFunction` | Custom function to build user abilities |
| cacheOptions? | `{ ttl?: number; key?: (user?: User) => string; }` | Ability caching configuration |

### User

User information for authorization

**Definition:**

```typescript
export interface User {
  id: string;
  roles?: string[];
}
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| id | `string` | Unique identifier for the user |
| roles? | `string[]` | Array of role names assigned to the user |

## Type Aliases

### AppAbility

CASL ability type for authorization with flexible subject types

**Definition:**

```typescript
export type AppAbility = PureAbility<[string, any], any>;
```

### MiddlewareFn

Middleware function that wraps a GraphQL resolver with authorization logic

**Definition:**

```typescript
export type MiddlewareFn = (resolve: ResolverFn, root: any, args: any, context: Context, info: GraphQLResolveInfo) => any;
```

### ResolverFn

GraphQL resolver function type

**Definition:**

```typescript
export type ResolverFn = (root: any, args: any, context: Context, info: GraphQLResolveInfo) => any;
```

## Variables

### pglCaslPlugin

PostGraphile plugin for CASL authorization

**Type:**

```typescript
export const pglCaslPlugin: GraphileConfig.Plugin
```

