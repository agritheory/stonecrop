# Desktop Documentation

> This documentation is automatically generated from the TypeScript API.

<h2>Vue Components</h2>

### ActionSet

Vue component exported from @stonecrop/desktop.

```typescript
import { ActionSet } from '@stonecrop/desktop'
```

### CommandPalette

Vue component exported from @stonecrop/desktop.

```typescript
import { CommandPalette } from '@stonecrop/desktop'
```

### Doctype

Vue component exported from @stonecrop/desktop.

```typescript
import { Doctype } from '@stonecrop/desktop'
```

### Records

Vue component exported from @stonecrop/desktop.

```typescript
import { Records } from '@stonecrop/desktop'
```

### SheetNav

Vue component exported from @stonecrop/desktop.

```typescript
import { SheetNav } from '@stonecrop/desktop'
```

<h2>Other Components</h2>

### StonecropDesktop

```typescript
export { StonecropDesktop }
```

<h2>Type Aliases</h2>

### ActionElements

**Definition:**

```typescript
export type ActionElements = ButtonElement | DropdownElement;
```

### BaseElement

**Definition:**

```typescript
export type BaseElement = {
    label: string;
    show?: boolean;
};
```

### ButtonElement

**Definition:**

```typescript
export type ButtonElement = BaseElement & ElementAction & {
    type: 'button';
};
```

### DropdownElement

**Definition:**

```typescript
export type DropdownElement = BaseElement & {
    type: 'dropdown';
    actions: ElementAction[];
};
```

### ElementAction

**Definition:**

```typescript
export type ElementAction = BaseElement & {
    link?: string;
    action?: () => void;
};
```

