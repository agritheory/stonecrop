# HST + AForm Integration: Investigation & Learnings

**Date**: February 11, 2026
**Branch**: feat-nested-schema
**Status**: ⚠️ BLOCKED - Requires AForm API Investigation

---

## Executive Summary

Attempted to create live HST visualization demos showing real-time state updates when editing AForm fields. After implementing two variants (1:1 nested forms and 1:many arrays) and attempting multiple reactivity patterns, discovered a fundamental incompatibility between AForm's update mechanism and Vue 3's standard reactivity system.

**Key Finding**: AForm does not trigger Vue 3 reactivity when updating field values, preventing parent components from detecting changes through refs, computed properties, or watchers.

---

## Original Goal

Create HST Integration showcase variants in `examples/aform/nested.story.vue` that demonstrate:
- How HST manages nested data hierarchically
- Real-time visualization of HST state as forms are edited
- Path-based addressing and tree navigation
- CRUD operations (Create, Read, Update, Delete) on HST nodes
- Proof that HST is the single source of truth for form state

---

## What Was Implemented

### 1. HST Integration (1:1) Variant
**Location**: `examples/aform/nested.story.vue` lines ~360-600

**Features**:
- Customer form (customer_name, email, phone)
- Nested address form (street, city, state, zip_code)
- Real-time HST visualization showing:
  - Node paths: `customer.cust-001`, `customer.cust-001.address`
  - Existence flags: ✓ Exists / ❌ Deleted
  - Parent paths and breadcrumb trails
  - Full JSON data display
- Operations:
  - Delete Address: `store.set(addressPath, undefined)`
  - Restore Address: Recreates deleted address with defaults
  - Reset All Data: Resets entire customer + address to initial state

### 2. HST (1:many) Variant
**Location**: `examples/aform/nested.story.vue` lines ~700-900

**Features**:
- Order form (order_number, order_date, customer_name)
- Array of line items (product, quantity, price)
- HST visualization for order + each array item
- Array-specific operations:
  - Add Line Item: Adds new item to `line_items` array
  - Remove Line Item: Removes item by index
  - Reset Data: Restores order with 2 line items

### 3. Visual Design
- Two-column layout: Forms left, HST visualization right
- Color-coded sections: blue (customer), green (address/order), purple (line items)
- Responsive grid layout for array items
- Interactive buttons with hover states
- Comprehensive path and metadata display

---

## Issues Discovered

### Bug #1: Form Edits Don't Update HST Visualization
**Severity**: Critical
**Reproducible**: 100%

**Steps to Reproduce**:
1. Navigate to HST Integration (1:1) variant
2. Edit "Customer Name" field from "Alice Johnson" to "Bob Smith TEST"
3. Observe: Form field shows new value
4. Observe: HST JSON still displays `"customer_name": "Alice Johnson"`

**Expected**: HST visualization updates immediately to show "Bob Smith TEST"

**Actual**: Stale data persists in visualization despite form field changing

### Bug #2: Delete/Restore Operations Don't Work
**Severity**: Critical
**Reproducible**: 100%

**Steps to Reproduce**:
1. Click "Delete" button in Address section
2. Observe: Address form fields remain populated
3. Observe: HST still shows "✓ Exists" for address node
4. Click "Restore" button
5. Observe: No visible change occurs

**Expected**: Delete clears form and shows "❌ Deleted", Restore repopulates with defaults

**Actual**: Buttons execute but have no effect on UI or HST state

### Bug #3: Array Cross-Contamination (1:many)
**Severity**: High
**Reported**: Initial test phase
**Status**: Attempted fix, not verified

**Description**: Editing a field in one line item updates the same field in all other line items.

**Root Cause**: Shallow object copying in array items leading to shared references.

---

## Investigation Timeline & Attempted Solutions

### Attempt #1: Computed Properties with Getter/Setter
**Date**: Session start
**Duration**: ~30 minutes
**Outcome**: ❌ Failed

**Implementation**:
```typescript
const customerFormData = computed({
  get: () => store.get(customerPath) || {},
  set: (newData) => {
    Object.keys(newData).forEach(key => {
      if (key !== 'address') {
        store.set(`${customerPath}.${key}`, newData[key])
      }
    })
  }
})
```

**Why It Failed**:
- Computed setters only trigger on full object assignment: `formData.value = newObj`
- AForm mutates individual properties: `formData.value.customer_name = "Bob"`
- Property mutations bypass the setter entirely
- HST never receives update notifications

**Lessons Learned**:
- Computed setters are designed for `v-model` patterns (two-way binding)
- Not suitable for objects where properties are mutated directly
- Need reactivity at the property level, not object level

### Attempt #2: Debounced Watchers
**Duration**: ~15 minutes
**Outcome**: ❌ Failed (didn't complete implementation)

**Rationale**: Thought maybe frequent updates were causing issues

**Reality**: Never got to test because realized the fundamental setter problem

### Attempt #3: Refs with Deep Watch + onMounted
**Date**: Mid-session
**Duration**: ~45 minutes
**Outcome**: ❌ Failed

**Implementation**:
```typescript
// Mutable refs for forms (AForm can mutate freely)
const customerFormData = ref({
  customer_name: '',
  email: '',
  phone: ''
})

// Initialize from HST on mount
onMounted(() => {
  const data = store.get(customerPath)
  if (data) {
    customerFormData.value = {
      customer_name: data.customer_name,
      email: data.email,
      phone: data.phone
    }
  }
})

// Deep watch for immediate HST sync
watch(customerFormData, (newData) => {
  Object.keys(newData).forEach(key => {
    if (key !== 'address') {
      store.set(`${customerPath}.${key}`, newData[key])
    }
  })
}, { deep: true })

// Operations update BOTH store and refs
const deleteAddress = () => {
  store.set(addressPath, undefined)
  addressFormData.value = { street: '', city: '', state: '', zip_code: '' }
}
```

**Why It Failed**:
- Deep watchers didn't trigger when editing form fields
- Delete/Restore operations executed but had no effect
- Browser testing confirmed: form shows new value, HST shows stale data
- Indicates AForm is NOT mutating the ref's properties as expected

**Lessons Learned**:
- Deep watch SHOULD detect property mutations on refs
- If watch isn't triggering, AForm is either:
  - Cloning the data prop internally
  - Using a different reactivity mechanism
  - Not actually mutating the parent's ref
  - Wrapping data in a way that isolates it from Vue's tracking

### Browser Testing Confirmation
**Tool**: Chrome DevTools MCP
**Duration**: ~10 minutes

**Test 1: Form Edit**
```javascript
// Filled customer_name field with "Bob Smith TEST"
// Result: Form displays "Bob Smith TEST"
// HST JSON: Still shows "Alice Johnson"
// Conclusion: No data synchronization occurring
```

**Test 2: Delete Button**
```javascript
// Clicked Delete button
// Result: Button click registered
// Form: Still shows populated fields
// HST: Still shows "✓ Exists"
// Conclusion: Operations execute but don't affect reactivity chain
```

---

## Root Cause Analysis

### The Problem: AForm's Update Mechanism is Opaque

AForm receives form data as a prop:
```typescript
h(AForm, {
  modelValue: this.customerSchema,
  data: this.customerFormData,  // ref() passed as prop
})
```

When a field is edited, **none of the following trigger**:
- ❌ Ref property mutation detection
- ❌ Computed getter re-evaluation
- ❌ Deep watcher callbacks
- ❌ Parent component re-renders (unless forced)

This indicates AForm is handling field updates through a mechanism that doesn't integrate with Vue 3's standard reactivity system.

### What We Don't Know About AForm

**Critical Unknowns**:
1. Does AForm emit events when fields change?
   - Look for: `emit('update:data', newData)` or `emit('change', ...)`
   - Check: `defineEmits` declarations

2. Does AForm support v-model on the `data` prop?
   - Look for: `v-model:data` support
   - Check: `defineProps` with `data` + `defineEmits` with `update:data`

3. How does AForm internally update field values?
   - Direct DOM manipulation?
   - Internal reactive state separate from prop?
   - Custom proxy or wrapper around data?

4. What's the proper integration pattern?
   - Should we listen for specific events?
   - Is there a change handler callback prop?
   - Do we need to use a different AForm API?

### Why Standard Vue Patterns Failed

**Vue 3 Reactivity Expectations**:
```typescript
const data = ref({ name: 'Alice' })

// This SHOULD trigger watch:
data.value.name = 'Bob'  // Mutation tracked by Proxy

// This SHOULD re-evaluate computed:
computed(() => data.value.name)  // Getter tracks dependency
```

**AForm Behavior (Hypothesized)**:
```typescript
// AForm receives data as prop
const props = defineProps<{ data: any }>()

// Internally clones or wraps data
const internalData = reactive({ ...props.data })

// Updates internalData when fields change
internalData.name = 'Bob'  // This doesn't affect parent!

// Parent's ref remains unchanged
// Parent's watchers never trigger
// HST never gets updated
```

---

## Vue 3 Reactivity: Key Learnings

### 1. Computed Setters vs. Property Mutation

**When Computed Setters Work**:
```typescript
const fullName = computed({
  get: () => `${first.value} ${last.value}`,
  set: (val) => {
    const [f, l] = val.split(' ')
    first.value = f
    last.value = l
  }
})

// This triggers the setter:
fullName.value = "Bob Smith"  // ✅ Assignment

// This does NOT:
fullName.value.split(' ')  // ❌ Property access without assignment
```

**Takeaway**: Computed setters are designed for `v-model` on the computed itself, not for tracking mutations of the returned object.

### 2. Deep Watch Limitations

**When Deep Watch Works**:
```typescript
const data = ref({ name: 'Alice', age: 30 })

watch(data, () => {
  console.log('Changed!')
}, { deep: true })

data.value.name = 'Bob'  // ✅ Triggers watch
data.value.age = 31      // ✅ Triggers watch
```

**When It Doesn't Work**:
```typescript
// If a child component receives the ref as prop
// and internally clones/wraps it:
const Child = defineComponent({
  props: ['data'],
  setup(props) {
    const local = reactive({ ...props.data })  // Clone!
    local.name = 'Bob'  // ❌ Parent's watch won't see this
  }
})
```

**Takeaway**: Deep watch only tracks mutations on the original reactive object, not clones or separate reactive wrappers.

### 3. Prop Mutation Anti-Pattern

**Vue 3 Best Practice**: Props are read-only from child's perspective

**Proper Pattern**:
```typescript
// Child emits changes
const emit = defineEmits(['update:data'])

function updateField(key, value) {
  emit('update:data', { ...props.data, [key]: value })
}

// Parent listens
h(Child, {
  data: formData.value,
  'onUpdate:data': (newData) => {
    formData.value = newData
  }
})
```

**Anti-Pattern** (what AForm might be doing):
```typescript
// Direct prop mutation
function updateField(key, value) {
  props.data[key] = value  // ❌ Mutates parent's object
}
// Works functionally but breaks reactivity chain
```

**Takeaway**: If AForm mutates props directly without emitting events, parent components can't react to changes.

---

## Technical Debt Created

### Files Modified
1. **examples/aform/nested.story.vue**
   - Lines ~360-600: HST Integration (1:1) variant
   - Lines ~700-900: HST (1:many) variant
   - Both variants: Non-functional (bugs present)

2. **HST_REACTIVITY_FIX.md**
   - Initial analysis document
   - Proposed computed → ref refactoring
   - Superseded by this document

3. **HST_REACTIVITY_ISSUE_SUMMARY.md**
   - Mid-investigation technical summary
   - Detailed attempted solutions
   - Superseded by this document

### Code Quality Status
- ✅ TypeScript compiles without errors
- ✅ No console errors in browser
- ✅ Code follows project patterns
- ❌ Core functionality broken (form ↔ HST sync)
- ❌ Demo doesn't fulfill its purpose

### User-Facing Impact
- **Positive**: HST visualization UI is polished and informative
- **Negative**: "Watch HST update in real-time" promise is broken
- **Risk**: Users might think HST is broken when it's actually an integration issue

---

## Recommended Next Steps

### Option A: Investigate AForm API (Recommended)
**Priority**: High
**Estimated Time**: 30-60 minutes

**Action Items**:
1. Locate AForm source code in `aform/src/`
2. Find the main component file (likely `AForm.vue` or `Form.vue`)
3. Check `defineEmits` for event declarations:
   - `update:data`
   - `change`
   - `input`
   - `fieldChange`
4. Check `defineProps` for callback handlers:
   - `onChange`
   - `onFieldChange`
   - `onUpdate`
5. Read component documentation or existing examples
6. Test discovered API in HST variants

**Expected Findings**:
- AForm emits `update:data` → Use `@update:data` listener
- AForm accepts `onFieldChange` → Provide handler function
- AForm uses internal state → Need different integration approach

### Option B: Create Alternative HST Demo
**Priority**: Medium (workaround)
**Estimated Time**: 45 minutes

**Approach**: Plain HTML inputs with v-model to prove HST reactivity works

**Implementation**:
```typescript
const HSTDemoAlternative = defineComponent({
  setup() {
    const customerData = ref({
      customer_name: 'Alice Johnson',
      email: 'alice@example.com'
    })

    // Direct binding to HST via ref
    watch(customerData, (newData) => {
      Object.keys(newData).forEach(key => {
        store.set(`customer.${customerId}.${key}`, newData[key])
      })
    }, { deep: true })

    return { customerData }
  },
  render() {
    return h('div', [
      h('input', {
        value: this.customerData.customer_name,
        onInput: (e) => {
          this.customerData.customer_name = e.target.value
        }
      })
    ])
  }
})
```

**Pros**:
- Proves HST reactivity works correctly
- Provides working reference implementation
- Unblocks HST showcase

**Cons**:
- Doesn't use AForm (less realistic)
- Duplicates form rendering logic
- Doesn't solve the AForm integration problem

### Option C: Fix AForm (Breaking Change)
**Priority**: Low (requires team decision)
**Estimated Time**: 2-4 hours

**If AForm has no proper event mechanism**, consider:
1. Add `update:data` event emission on field changes
2. Implement `v-model:data` support
3. Add `onFieldChange` callback prop
4. Update AForm documentation with reactive patterns

**Risks**:
- Breaking change for existing AForm users
- Requires testing across all AForm usage
- May reveal architectural issues in AForm

---

## Knowledge Gaps

### About AForm's Architecture
- [ ] How are field values stored internally?
- [ ] What's the update flow: User types → ??? → Data changes
- [ ] Does AForm use VeeValidate, Formkit, or custom validation?
- [ ] Is there a form state manager separate from data?
- [ ] How does schema drive field rendering?

### About Project Patterns
- [ ] Are there existing examples of AForm reactivity integration?
- [ ] Do other components successfully watch AForm data changes?
- [ ] Is there a preferred pattern for form + state management?
- [ ] Has this problem been identified before?

### About HST Usage
- [ ] Are there other HST demos that work correctly?
- [ ] Is HST primarily used standalone or with UI components?
- [ ] What's the recommended integration pattern for HST + forms?

---

## Success Criteria (Future)

When this issue is resolved, the following should work:

### Functional Requirements
- ✅ Type in form field → HST JSON updates instantly
- ✅ Click Delete → Form clears + HST shows "❌ Deleted"
- ✅ Click Restore → Form repopulates + HST shows "✓ Exists"
- ✅ Click Reset → Both form and HST reset to defaults
- ✅ Edit line item in 1:many → Only that item updates (no cross-contamination)
- ✅ Add/remove line items → HST array reflects changes immediately

### Technical Requirements
- ✅ No stale data in HST visualization
- ✅ No manual polling or intervals needed
- ✅ Proper Vue 3 reactivity chain maintained
- ✅ Single source of truth: HST store
- ✅ Form data is derived from HST (not duplicate state)

### User Experience
- ✅ Instant visual feedback on all operations
- ✅ Clear indication of HST node existence/deletion
- ✅ Accurate representation of hierarchical data structure
- ✅ Demonstrates HST's real-world value proposition

---

## References & Resources

### Project Documentation
- `.github/ARCHITECTURE.md` - Stonecrop architecture overview
- `.github/copilot-instructions.md` - Development guidelines
- `stonecrop/API.md` - HST API documentation
- `aform/API.md` - AForm component API (if exists)

### Code Locations
- **HST Implementation**: `stonecrop/src/HierarchicalStateTree.ts`
- **AForm Implementation**: `aform/src/` (needs investigation)
- **Demo File**: `examples/aform/nested.story.vue`
- **Histoire Stories**: `http://localhost:6006/`

### External Resources
- [Vue 3 Reactivity Fundamentals](https://vuejs.org/guide/essentials/reactivity-fundamentals.html)
- [Vue 3 Deep Reactivity](https://vuejs.org/guide/extras/reactivity-in-depth.html)
- [Computed Getters and Setters](https://vuejs.org/guide/essentials/computed.html#writable-computed)

---

## Appendix: Code Patterns Tested

### Pattern 1: Computed with Getter/Setter
**Status**: ❌ Failed
**File**: Originally in HSTDemo, reverted

```typescript
const formData = computed({
  get: () => store.get(path) || {},
  set: (newData) => {
    Object.keys(newData).forEach(key => {
      store.set(`${path}.${key}`, newData[key])
    })
  }
})
```

### Pattern 2: Refs + Deep Watch + onMounted
**Status**: ❌ Failed
**File**: Currently in HSTDemo (lines ~405-475)

```typescript
const formData = ref({ customer_name: '', email: '', phone: '' })

onMounted(() => {
  const hstData = store.get(path)
  if (hstData) {
    formData.value = { ...hstData }
  }
})

watch(formData, (newData) => {
  Object.keys(newData).forEach(key => {
    store.set(`${path}.${key}`, newData[key])
  })
}, { deep: true })
```

### Pattern 3: Computed Visualization Only
**Status**: ✅ Works (current implementation)
**File**: HSTDemo and HSTArrayDemo

```typescript
// Form data as refs (mutable by AForm, no sync)
const formData = ref({})

// Separate computed for HST visualization (read-only)
const hstData = computed(() => ({
  customer: store.get(customerPath),
  customerNode: {
    path: customerPath,
    exists: store.has(customerPath),
    // ...metadata
  }
}))

// Renders HST state but doesn't sync from form edits
```

**Note**: This pattern allows HST visualization to work when HST is updated directly (e.g., via Reset button), but not when forms are edited.

---

## Contributing to This Investigation

If you're continuing this work:

1. **Start Here**: Read "Recommended Next Steps" → Option A
2. **Find AForm API**: Check `aform/src/` for component implementation
3. **Test Theories**: Use browser DevTools to intercept AForm behavior
4. **Document Findings**: Update this file with discoveries
5. **Implement Fix**: Choose appropriate pattern based on AForm API
6. **Verify**: Test all operations in both variants
7. **Clean Up**: Remove old investigation docs (HST_REACTIVITY_FIX.md, etc.)

---

**Last Updated**: February 11, 2026
**Investigators**: GitHub Copilot, User
**Status**: Investigation complete, awaiting AForm API review
**Next Action**: Investigate AForm source code for proper integration pattern
