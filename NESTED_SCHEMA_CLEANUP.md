# Nested Schema Cleanup - Architectural Simplification

**Date:** February 11, 2026
**Branch:** `feat-nested-schema`
**Status:** ✅ Complete

## Summary

This cleanup removed two unused abstractions that were giving a false impression of complexity for nested schema handling. The nested forms feature works automatically with zero configuration - no manual setup or preloading required.

## What Was Removed

### 1. `preloadNestedSchemas()` Method
**Location:** `stonecrop/src/registry.ts`

**What it did:**
- 50+ line async method
- Recursively loaded nested Doctype schemas
- Prevented circular dependencies with visited Set
- Called getMeta() for missing schemas

**Why it was removed:**
- AForm doesn't use it for automatic nested rendering
- Only called by the now-removed `useNestedSchema` composable
- All examples manually register doctypes upfront anyway
- Created false impression that preloading was necessary

**Files changed:**
- Removed method from Registry class
- Removed property from SchemaRegistry interface
- Removed 3 tests from `nested-doctype.spec.ts`

### 2. `useNestedSchema` Composable
**Location:** `stonecrop/src/composables/useNestedSchema.ts` (deleted)

**What it did:**
- Loaded nested schemas from registry
- Initialized empty record data
- Provided schema management utilities
- Marked `@internal` but still exported

**Why it was removed:**
- AForm doesn't use it - has duplicate logic built-in
- AForm directly accesses `registry.registry[doctypeSlug]`
- AForm has its own `initializeNestedRecord()` function
- Zero usages in actual codebase (only in "old way" documentation)
- Duplicate code with no unique functionality

**Files changed:**
- Deleted `useNestedSchema.ts` entirely
- Removed exports from `stonecrop/src/index.ts`
- Updated documentation in `nested-schemas.md`
- Updated examples in `nested.story.vue`

## How Nested Forms Actually Work

### The Real Implementation (AForm.vue)

```typescript
// 1. Inject registry
const registry = inject<SchemaRegistry>('$registry', undefined)

// 2. Detect Doctype fields automatically
watchEffect(() => {
  schema.forEach(field => {
    if (field.fieldtype === 'Doctype' && field.options) {
      const doctypeSlug = field.options
      const doctype = registry.registry[doctypeSlug]  // Direct access!

      if (doctype && doctype.schema) {
        nestedSchemas.value[field.fieldname] = Array.from(doctype.schema)
        // Initialize nested data if needed
        if (!dataModel.value[field.fieldname]) {
          dataModel.value[field.fieldname] = initializeNestedRecord(schemaArray)
        }
      }
    }
  })
})

// 3. Render nested AForm recursively
// (happens automatically in template)
```

**Key insight:** No preloading, no composable, no manual setup. Just direct registry access when needed.

## Pattern: Manual Registration + Automatic Rendering

### The Correct Pattern

```typescript
// 1. Register ALL doctypes upfront
registry.addDoctype(addressDoctype)
registry.addDoctype(customerDoctype)
registry.addDoctype(orderDoctype)

// 2. Just use AForm - nested forms appear automatically!
<AForm :schema="customerSchema" v-model:data="customerData" />
```

No `preloadNestedSchemas()` call needed.
No `useNestedSchema()` composable needed.
Just register your schemas and use AForm.

## Test Results

- **Before:** 294 tests passing
- **After:** 291 tests passing (removed preload tests)
- All functionality intact
- Zero breakage from removal

## API Surface Reduction

### Removed from Public API
- ❌ `preloadNestedSchemas()` method (was on Registry)
- ❌ `useNestedSchema()` composable (was @internal)
- ❌ `UseNestedSchemaOptions` interface
- ❌ `UseNestedSchemaReturn` interface
- ❌ `SchemaRegistry` type export (only used internally by AForm)

### Kept in Internal Implementation
- ✅ `SchemaRegistry` interface (in AForm.vue)
- ✅ `initializeNestedRecord()` function (in AForm.vue)
- ✅ Automatic Doctype field detection
- ✅ Recursive AForm rendering

## Documentation Updates

### Files Updated
1. **`stonecrop/docs/schema/nested-schemas.md`**
   - Removed references to `useNestedSchema` composable
   - Updated "Under the Hood" section to explain direct implementation

2. **`examples/aform/nested.story.vue`**
   - Removed "Before and After" comparison showing old manual way
   - Added "Zero Configuration Required" section
   - Emphasized automatic behavior

3. **`common/reviews/api/stonecrop.api.md`**
   - Auto-regenerated without SchemaRegistry export
   - Cleaner API surface (34 interfaces instead of 35)

## Key Learnings

### 1. Question Every Abstraction
- `preloadNestedSchemas()` seemed useful but was never called by actual features
- `useNestedSchema` was marked internal but still exposed in public API
- Both created false impression of necessary complexity

### 2. Duplicate Code is a Code Smell
- `useNestedSchema.initializeRecord()` duplicated `AForm.initializeNestedRecord()`
- Same schema loading logic in two places
- If code isn't shared, it's not a useful abstraction

### 3. "Just In Case" Code is Technical Debt
- Both utilities were kept "just in case" they'd be useful
- Zero actual usage outside of tests and docs showing "old way"
- Removed 250+ lines of unused code

### 4. Direct Access Can Be Simpler
- `registry.registry[doctypeSlug]` is clear and direct
- No need for async preloading when synchronous access works fine
- Simpler implementation = fewer bugs

### 5. Manual Registration + Automatic Rendering
- User explicitly registers all doctypes they'll use
- Framework automatically detects and renders nested forms
- Best of both worlds: explicit dependencies, automatic UI

## Migration Guide (None Needed!)

Since both features were internal/unused, no migration needed. Any code using automatic nested forms continues to work exactly the same way.

### If You Were Using These (You Weren't)

**Old (never actually used):**
```typescript
await registry.preloadNestedSchemas('customer')
const { schema } = useNestedSchema({ doctype: 'address', registry })
```

**New (what you're already doing):**
```typescript
// Just register and use
registry.addDoctype(addressDoctype)
<AForm :schema="customerSchema" v-model:data="customerData" />
```

## Files Changed

### Deleted Files
- `stonecrop/src/composables/useNestedSchema.ts` (200+ lines)

### Modified Files
1. `stonecrop/src/registry.ts` - Removed preloadNestedSchemas()
2. `stonecrop/src/index.ts` - Removed exports
3. `stonecrop/docs/schema/nested-schemas.md` - Updated docs
4. `examples/aform/nested.story.vue` - Simplified examples
5. `stonecrop/tests/nested-doctype.spec.ts` - Removed preload tests

### Generated Files
- `stonecrop/api.md` - Auto-regenerated without removed exports
- `common/reviews/api/stonecrop.api.md` - Same

## Impact

- ✅ **Code:** -250+ lines of unused code
- ✅ **API Surface:** Simpler, fewer exports
- ✅ **Tests:** 291 passing (removed 3 unused tests)
- ✅ **Documentation:** More accurate to actual implementation
- ✅ **User Experience:** No change - was already automatic
- ✅ **Maintainability:** Less code to maintain, clearer architecture

## Conclusion

The nested schema feature is **simpler than it appeared**:

1. Register all doctypes you need
2. Include Doctype fields in your schemas
3. Pass schemas to AForm
4. Nested forms render automatically

No preloading. No composables. No manual setup. Just works.

This cleanup revealed that the best abstractions are often the ones you **don't** create. The direct implementation in AForm is clearer, simpler, and more maintainable than the unused utility functions we removed.
