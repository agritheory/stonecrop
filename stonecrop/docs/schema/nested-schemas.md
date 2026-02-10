# Nested Schema Support in AForm

## Overview

AForm supports nested schemas through the `useNestedSchema` composable from `@stonecrop/stonecrop`. This allows you to dynamically load and initialize nested form structures without tight coupling to any specific state management solution.

**Note:** This implementation supports **1:1 nested schemas only**. For managing collections of records (1:many relationships), use nested table schemas which provide proper doctype mapping and state management.

## Key Features

- **No Dependencies**: The composable is part of Stonecrop's core schema management
- **Flexible Schema Source**: Load from a registry or provide schemas directly
- **1:1 Relationship Support**: Handle single nested forms within parent records
- **Type-Safe**: Full TypeScript support with interfaces
- **Initialization Helpers**: Built-in methods to initialize empty records with default values

## Installation

The composable is exported from `@stonecrop/stonecrop`:

```typescript
import { useNestedSchema } from '@stonecrop/stonecrop'
```

## Basic Usage

### Single Nested Form (1:1 Relationship)

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { useNestedSchema } from '@stonecrop/stonecrop'
import { AForm } from '@stonecrop/aform'

// Load the nested schema
const { schema: addressSchema, initializeRecord } = useNestedSchema({
  doctype: 'address',
  registry: myRegistry, // Optional: any object implementing SchemaRegistry interface
})

// Your parent form data
const customerData = ref({
  name: 'John Doe',
  address: {
    street: '123 Main St',
    city: 'Springfield',
  },
})
</script>

<template>
  <div>
    <!-- Parent form fields -->
    <input v-model="customerData.name" />

    <!-- Nested schema -->
    <div v-if="addressSchema">
      <h3>Address</h3>
      <AForm :modelValue="addressSchema" :data="customerData.address" />
    </div>
  </div>
</template>
```

### Initializing Empty Nested Records

Use `initializeRecord()` to create an empty nested object with proper default values:

```typescript
const { schema: addressSchema, initializeRecord } = useNestedSchema({
  doctype: 'address',
  registry: myRegistry,
})

// Create a new customer with an initialized nested address
const newCustomer = ref({
  name: '',
  email: '',
  address: initializeRecord(), // Creates { street: '', city: '', state: '', zip_code: '' }
})
```

## API Reference

### `useNestedSchema(options)`

Creates a composable for loading and working with nested schemas.

#### Options

```typescript
interface UseNestedSchemaOptions {
  /**
   * The target doctype slug to load schema for
   */
  doctype: string

  /**
   * Registry instance for schema lookup (optional)
   * If not provided, you must supply schema directly via setSchema
   */
  registry?: SchemaRegistry

  /**
   * Direct schema array to use instead of loading from registry
   */
  schema?: SchemaTypes[]

  /**
   * Initial data for the nested form
   */
  initialData?: any
}
```

#### Returns

```typescript
interface UseNestedSchemaReturn {
  /**
   * Reactive reference to the loaded schema
   */
  schema: Ref<SchemaTypes[] | null>

  /**
   * Error state if schema loading fails
   */
  error: Ref<Error | null>

  /**
   * Loading state during async schema loading
   */
  loading: Ref<boolean>

  /**
   * The normalized doctype name
   */
  doctypeName: Ref<string>

  /**
   * Initialize a single empty record with default values
   */
  initializeRecord: () => Record<string, any>

  /**
   * Initialize an array of empty records (utility for array initialization)
   */
  initializeArray: (count: number) => Record<string, any>[]

  /**
   * Load or reload the schema from the registry
   */
  loadSchema: () => Promise<void>

  /**
   * Manually set the schema
   */
  setSchema: (newSchema: SchemaTypes[]) => void
}
```

### SchemaRegistry Interface

Your registry object must implement this interface to be compatible:

```typescript
interface SchemaRegistry {
  registry: Record<
    string,
    {
      doctype: string
      slug: string
      schema?: SchemaTypes[] | Iterable<SchemaTypes>
    }
  >
  preloadNestedSchemas?: (doctypeSlug: string) => Promise<void>
}
```

The Stonecrop `Registry` class implements this interface automatically.

## Examples

See `/examples/aform/nested.story.vue` for complete working examples demonstrating:

1. Manual integration of single nested forms (1:1)
2. Composable API usage patterns
3. HST integration with nested schemas

For managing collections of records, use nested table schemas instead.

## Benefits

- **Decoupled Architecture**: AForm doesn't depend on Stonecrop
- **Flexibility**: You control how nested forms are rendered
- **Type Safety**: Full TypeScript support
- **Customizable**: Build your own nested form components using the composable
- **Progressive Enhancement**: Start simple, add complexity as needed

## Under the Hood

When you provide a registry, the composable:

1. Looks up the doctype in the registry
2. Retrieves the schema (converts from Immutable.List if needed)
3. Provides initialization helpers based on the schema structure
4. Handles async loading with proper loading/error states

Without a registry, you can provide schemas directly for maximum flexibility.
