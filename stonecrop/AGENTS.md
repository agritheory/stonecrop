# GitHub Copilot Instructions for @stonecrop/stonecrop

## Package Overview
The **@stonecrop/stonecrop** package is the core orchestration layer of the Stonecrop framework. It provides:

- **Registry System**: Immutable doctype definitions with schema, workflow, and action registration
- **Hierarchical State Tree (HST)**: Advanced tree-based state management with path navigation
- **Stonecrop Class**: Main orchestration class integrating Registry and HST
- **Operation Log**: Optional Pinia-based undo/redo system with cross-tab sync
- **useStonecrop Composable**: Single unified Vue.js interface for all features
- **Field Triggers**: Event-driven field change handlers with rollback support
- **XState Integration**: FSM workflow management with HST state persistence

## Architecture Principles

### 1. Immutability
- **Registry**: Once a doctype is registered, it cannot be modified (use `Map` for immutable storage)
- **Schema**: Uses Immutable.js `List` for field definitions
- **Actions/Workflows**: Immutable after registration

### 2. State Management Hierarchy
```
Stonecrop (orchestration)
├── Registry (immutable definitions)
├── HST Store (mutable state tree)
└── Operation Log Store (optional, Pinia-based)
```

### 3. Dual-Mode Composable
The `useStonecrop` composable operates in two modes:

**Basic Mode** (no parameters):
```typescript
const { stonecrop, operationLog } = useStonecrop()
// Uses injected registry or loads from router params
```

**HST Mode** (with doctype/recordId):
```typescript
const { stonecrop, operationLog, hstStore, formData, provideHSTPath, handleHSTChange } = useStonecrop({ doctype, recordId })
// Creates HST-reactive form integration
```

## Key Components

### Registry (`registry.ts`)
- **Purpose**: Central registry for doctype definitions
- **Pattern**: Singleton with immutable storage
- **API**:
  - `registry.register(name, doctype)` - Register doctype (throws if duplicate)
  - `registry.get(name)` - Retrieve doctype (throws if not found)
  - `registry.has(name)` - Check existence
  - `registry.all()` - Get all doctypes

### Stonecrop Class (`stonecrop.ts`)
- **Purpose**: Main orchestration with Registry + HST integration
- **Initialization**:
  ```typescript
  const stonecrop = new Stonecrop(registry)
  const store = stonecrop.getStore() // HST root node
  ```
- **Record Management**:
  ```typescript
  stonecrop.addRecord('task', '123', data)
  stonecrop.getRecordById('task', '123')
  stonecrop.records('task') // All records of doctype
  ```
- **Operation Log** (lazy initialization):
  ```typescript
  const opLog = stonecrop.getOperationLogStore() // Only if Pinia available
  ```

### HST Store (`stores/hst.ts`)
- **Purpose**: Hierarchical state tree with path-based navigation
- **Structure**: `doctype.recordId.fieldname` paths
- **API**:
  - `store.set(path, value)` - Set value at path
  - `store.get(path)` - Get value at path
  - `store.has(path)` - Check path exists
  - `store.getNode(path)` - Get HSTNode for navigation
- **Navigation**:
  ```typescript
  const node = store.getNode('task.123')
  const parent = node.getParent()
  const breadcrumbs = node.getBreadcrumbs()
  const children = node.getChildren()
  ```

### useStonecrop Composable (`composable.ts`)
- **Return Structure**:
  ```typescript
  {
    stonecrop: Ref<Stonecrop>,
    operationLog: OperationLogAPI,  // Nested object with all op log features
    // HST mode only:
    hstStore?: Ref<HSTNode>,
    formData?: ComputedRef<Record<string, any>>,
    provideHSTPath?: (fieldname: string) => string,
    handleHSTChange?: (args: ChangeArgs) => void
  }
  ```
- **Operation Log API** (all nested under `operationLog`):
  - `operations`, `currentIndex`, `undoRedoState`
  - `canUndo`, `canRedo`, `undoCount`, `redoCount`
  - `undo(hstStore)`, `redo(hstStore)`
  - `startBatch()`, `commitBatch()`, `cancelBatch()`
  - `configure(config)`, `getSnapshot()`, `clear()`
  - `withBatch(fn, description)`, `setupUndoRedoShortcuts()`
  - `createSyncDelta()`, `applySyncDelta(delta)`

### Operation Log Store (`stores/operation-log.ts`)
- **Purpose**: Pinia store for undo/redo with cross-tab sync
- **Optional**: Only available if Pinia is configured in app
- **Features**:
  - Tracks all HST mutations with metadata
  - Undo/redo with reversibility tracking
  - Batch operations (group changes into single undo unit)
  - Cross-tab sync via BroadcastChannel
  - LocalStorage persistence
  - XState transition tracking (non-reversible)
- **Integration**: Automatically initialized when `getOperationLogStore()` is called

### Field Triggers (`field-triggers.ts`)
- **Purpose**: Event-driven field change handlers
- **Types**:
  - `GLOBAL_ACTION`: Runs for all doctypes
  - `FIELD_ACTION`: Runs for specific field in specific doctype
- **Rollback**: Automatic rollback on action failure
- **API**:
  ```typescript
  registerGlobalAction(name, handler)
  registerFieldAction(doctype, fieldname, actionName, handler)
  triggerFieldChange(context) // Called by HST set()
  ```

## Critical Patterns

### 1. Lazy Initialization (Operation Log)
The operation log is optional and uses lazy initialization:

```typescript
class Stonecrop {
  private _operationLogStore?: ReturnType<typeof useOperationLogStore>
  private _operationLogConfig?: Partial<OperationLogConfig>

  getOperationLogStore() {
    if (!this._operationLogStore) {
      this._operationLogStore = useOperationLogStore()
      if (this._operationLogConfig) {
        this._operationLogStore.configure(this._operationLogConfig)
      }
    }
    return this._operationLogStore
  }
}
```

In composable:
```typescript
try {
  const opLogStore = stonecrop.value.getOperationLogStore()
  // Setup reactivity...
} catch {
  // Pinia not available - silently continue (operation log is optional)
}
```

### 2. HST Path Construction
Fields in forms use dot-notation paths:

```typescript
const provideHSTPath = (fieldname: string) => {
  return `${doctype.value.doctype}.${recordId.value}.${fieldname}`
}

// Example: "task.123.title"
```

### 3. Nested Operation Log API
All operation log features are grouped under a single `operationLog` object:

```typescript
// CORRECT - Use nested API
const { operationLog } = useStonecrop({ doctype, recordId })
operationLog.undo(hstStore.value)
operationLog.configure({ maxOperations: 100 })

// INCORRECT - Don't destructure flat
// const { undo, redo, configure } = useStonecrop()
```

### 4. Error Handling
- **Registry errors**: Throw immediately (programming errors)
- **Pinia unavailability**: Silent catch in composable (optional feature)
- **Field trigger failures**: Automatic rollback with console logging
- **XState errors**: Propagate to caller

## Testing Patterns

### Test Utilities
- **`withSetup(composable)`**: Wraps composable in Vue component context
- **`withSetupAndPinia(composable)`**: Adds Pinia for operation log tests

### Common Test Setup
```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { Registry } from '../src/registry'
import { Stonecrop } from '../src/stonecrop'

describe('Feature', () => {
  let registry: Registry
  let stonecrop: Stonecrop

  beforeEach(() => {
    registry = new Registry()
    registry.register('task', taskDoctype)
    stonecrop = new Stonecrop(registry)
  })

  it('should do something', () => {
    // Test implementation
  })
})
```

### Testing with Operation Log
```typescript
import { createPinia, setActivePinia } from 'pinia'

beforeEach(() => {
  setActivePinia(createPinia()) // Required for operation log tests
})
```

## Common Pitfalls

### 1. ❌ Modifying Registry After Registration
```typescript
// WRONG - Registry is immutable
registry.register('task', doctype)
doctype.schema.push(newField) // Won't affect registered doctype
```

### 2. ❌ Using Flat Operation Log API
```typescript
// WRONG - Old flat API pattern
const { undo, redo, configure } = useStonecrop()

// CORRECT - Nested API
const { operationLog } = useStonecrop()
operationLog.undo(hstStore.value)
```

### 3. ❌ Forgetting Pinia Setup in Tests
```typescript
// WRONG - Will fail if testing operation log
const stonecrop = new Stonecrop(registry)
stonecrop.getOperationLogStore() // Error: Pinia not available

// CORRECT - Setup Pinia first
setActivePinia(createPinia())
const stonecrop = new Stonecrop(registry)
stonecrop.getOperationLogStore() // Works
```

### 4. ❌ Direct Store Mutation Without HST
```typescript
// WRONG - Bypasses operation log and triggers
formData.value.title = 'New Title'

// CORRECT - Use HST set() for proper tracking
hstStore.value.set('task.123.title', 'New Title')
```

### 5. ❌ Assuming Operation Log is Always Available
```typescript
// WRONG - Assumes Pinia is configured
const { operationLog } = useStonecrop()
operationLog.undo(hstStore.value) // May fail

// CORRECT - Check availability or handle gracefully
const { operationLog } = useStonecrop()
if (operationLog.canUndo.value) {
  operationLog.undo(hstStore.value)
}
```

## Code Organization

### File Structure
```
src/
├── stonecrop.ts           # Main Stonecrop class
├── registry.ts            # Registry singleton
├── composable.ts          # useStonecrop composable
├── field-triggers.ts      # Field change handlers
├── doctype.ts            # Doctype type definitions
├── exceptions.ts         # Custom error classes
├── composables/
│   └── operation-log.ts  # Operation log composables
├── stores/
│   ├── hst.ts           # HST store (Pinia)
│   └── operation-log.ts # Operation log store (Pinia)
├── types/
│   ├── index.ts         # Shared types
│   ├── registry.ts      # Registry types
│   ├── operation-log.ts # Operation log types
│   └── field-triggers.ts # Trigger types
└── plugins/
    └── index.ts         # Vue plugin
```

### Import Patterns
```typescript
// Prefer named imports from main index
import { Stonecrop, Registry, useStonecrop } from '@stonecrop/stonecrop'

// For internal files, use relative imports
import { HSTNode } from './stores/hst'
import type { OperationLogConfig } from './types/operation-log'
```

## Performance Considerations

### 1. HST Efficiency
- Path-based access is O(depth), not O(n)
- Tree navigation uses cached parent references
- Avoid deep nesting when possible (max 3-4 levels recommended)

### 2. Operation Log Memory
- Configure `maxOperations` based on use case (default: 100)
- Use `operationFilter` to exclude non-critical operations
- Batch operations to reduce memory footprint

### 3. Reactivity
- Use `computed` for derived state from HST
- Avoid unnecessary `watch` on deep paths
- Leverage `formData` computed ref instead of manual reactivity

## Documentation Standards

### TSDoc Comments
All public APIs must have TSDoc comments:

```typescript
/**
 * Registers a new doctype in the registry
 *
 * @param name - Unique identifier for the doctype
 * @param doctype - Complete doctype definition
 * @throws {DoctypeAlreadyRegisteredError} If doctype name is already registered
 * @public
 */
register(name: string, doctype: any): void
```

### API Extractor
- All public exports are documented via API Extractor
- Run `rushx docs` to regenerate `API.md`
- Breaking changes trigger API review warnings

## Related Documentation

- **HST Architecture**: `docs/hst/ARCHITECTURE.md`
- **Field Triggers**: `docs/hst/FIELD_TRIGGERS.md`
- **XState Integration**: `docs/hst/XSTATE_TRANSITIONS.md`
- **Operation Log**: `docs/operation-log/OPERATION_LOG.md`
- **Quick Start**: `docs/operation-log/QUICK_START.md`
- **Main README**: `README.md`

## When to Edit This Package

Edit `@stonecrop/stonecrop` when:
- ✅ Adding/modifying core registry logic
- ✅ Updating HST tree navigation or path resolution
- ✅ Enhancing operation log features (undo/redo/sync)
- ✅ Adding new field trigger types or rollback logic
- ✅ Improving `useStonecrop` composable API
- ✅ Updating type definitions for public APIs

Do NOT edit this package for:
- ❌ UI components (use `@stonecrop/aform`, `@stonecrop/atable`, `@stonecrop/beam`)
- ❌ Desktop-specific features (use `@stonecrop/desktop`)
- ❌ Visual FSM editor (use `@stonecrop/node-editor`)
- ❌ GraphQL client (use `@stonecrop/graphql-client`)
- ❌ Code editor (use `@stonecrop/code-editor`)

## Commands

```bash
# Development
rushx build        # Compile TypeScript
rushx test         # Run all tests
rushx test:watch   # Watch mode
rushx test:coverage # Coverage report
rushx docs         # Generate API docs

# From examples directory
cd ../examples
rushx dev:aform    # Test with AForm
rushx dev:atable   # Test with ATable
```

## Version & Changelog

- Current version: Check `package.json`
- Changes: See `CHANGELOG.md` and `CHANGELOG.json`
- API changes: Tracked in `common/reviews/api/stonecrop.api.md`
